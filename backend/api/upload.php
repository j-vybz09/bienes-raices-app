
<?php

// Cargamos CORS.
require_once __DIR__ . "/../config/auth.php";

header("Content-Type: application/json; charset=UTF-8");

// Solo permitimos solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza POST."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Verificamos la sesión administrativa.
requireAdmin();

// Comprobamos que se haya enviado una imagen.
if (!isset($_FILES["image"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "No se recibió ninguna imagen."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$file = $_FILES["image"];

// Comprobamos errores de subida.
if ($file["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ocurrió un error al subir la imagen."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Límite máximo de 10 MB.
$maxSize = 10 * 1024 * 1024;

if ($file["size"] <= 0 || $file["size"] > $maxSize) {
    http_response_code(413);

    echo json_encode([
        "success" => false,
        "message" => "La imagen no puede superar los 10 MB."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Identificamos el destino autorizado.
$type = $_POST["type"] ?? "";

$allowedTypes = [
    "property" => "properties",
    "blog" => "blog"
];

if (!array_key_exists($type, $allowedTypes)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El tipo de imagen no es válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {
    // Detectamos el MIME real.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file["tmp_name"]);

    // Formatos permitidos.
    $allowedMimeTypes = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
        "image/avif" => "avif"
    ];

    if (!isset($allowedMimeTypes[$mimeType])) {
        http_response_code(415);

        echo json_encode([
            "success" => false,
            "message" => "Formato no permitido. Utiliza JPG, PNG, WebP o AVIF."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Comprobamos que sea una imagen válida.
    $imageInfo = getimagesize($file["tmp_name"]);

    if ($imageInfo === false) {
        http_response_code(415);

        echo json_encode([
            "success" => false,
            "message" => "El archivo no contiene una imagen válida."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Limitamos las dimensiones.
    if ($imageInfo[0] > 8000 || $imageInfo[1] > 8000) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Las dimensiones máximas son 8000 x 8000 píxeles."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Determinamos la carpeta de destino.
    $folder = $allowedTypes[$type];

    $uploadDirectory = __DIR__ . "/../uploads/" . $folder . "/";

    // Creamos la carpeta si no existe.
    if (
        !is_dir($uploadDirectory) &&
        !mkdir($uploadDirectory, 0755, true)
    ) {
        throw new RuntimeException(
            "No se pudo crear la carpeta de imágenes."
        );
    }

    // Generamos un nombre aleatorio y seguro.
    $extension = $allowedMimeTypes[$mimeType];
    $filename = bin2hex(random_bytes(16)) . "." . $extension;

    $destination = $uploadDirectory . $filename;

    // Guardamos la imagen.
    if (!move_uploaded_file($file["tmp_name"], $destination)) {
        throw new RuntimeException(
            "No fue posible guardar la imagen."
        );
    }

    // Ruta relativa que guardaremos en MySQL.
    $imagePath = "uploads/" . $folder . "/" . $filename;

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Imagen subida correctamente.",
        "image" => $imagePath
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al procesar la imagen."
    ], JSON_UNESCAPED_UNICODE);
}
