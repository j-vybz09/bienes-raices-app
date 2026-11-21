
<?php

// CORS y autenticación administrativa.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Conexión a MySQL y helper de imágenes.
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/images.php";

header("Content-Type: application/json; charset=UTF-8");

// Solo permitimos solicitudes PUT.
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza PUT."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos el ID.
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la propiedad no es válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Recibimos los datos JSON.
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Los datos enviados no son válidos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Extraemos los campos.
$image = $data["image"] ?? "";
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$price = $data["price"] ?? null;
$bathrooms = $data["bathrooms"] ?? null;
$garage = $data["garage"] ?? null;
$bedrooms = $data["bedrooms"] ?? null;

// Validamos los campos de texto.
if (
    !is_string($image) || trim($image) === "" ||
    !is_string($title) || trim($title) === "" ||
    !is_string($description) || trim($description) === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "La imagen, el título y la descripción son obligatorios."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos la ruta de la imagen.
$image = trim($image);

if (
    strlen($image) > 255 ||
    !preg_match(
        '/^uploads\/properties\/[a-f0-9]{32}\.(jpg|png|webp|avif)$/',
        $image
    )
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "La ruta de la imagen no es válida."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos el título.
$title = trim($title);

if (strlen($title) > 150) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El título no puede superar los 150 caracteres."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$description = trim($description);

// Validamos el precio.
if (
    !is_numeric($price) ||
    !is_finite((float) $price) ||
    (float) $price < 0
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El precio debe ser un número válido mayor o igual a cero."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos baños, garajes y habitaciones.
$numbers = [
    "bathrooms" => $bathrooms,
    "garage" => $garage,
    "bedrooms" => $bedrooms
];

foreach ($numbers as $field => $value) {

    if (
        filter_var($value, FILTER_VALIDATE_INT) === false ||
        (int) $value < 0
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El campo " . $field . " debe ser un entero mayor o igual a cero."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}

try {

    // Buscamos la propiedad y su imagen actual.
    $find = $pdo->prepare("
        SELECT image
        FROM properties
        WHERE id = :id
        LIMIT 1
    ");

    $find->execute([
        ":id" => $id
    ]);

    $currentProperty = $find->fetch(PDO::FETCH_ASSOC);

    if (!$currentProperty) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Conservamos la ruta de la imagen anterior.
    $oldImage = $currentProperty["image"];
    $newImage = $image;

    // Actualizamos la propiedad.
    $stmt = $pdo->prepare("
        UPDATE properties
        SET
            image = :image,
            title = :title,
            description = :description,
            price = :price,
            bathrooms = :bathrooms,
            garage = :garage,
            bedrooms = :bedrooms,
            updated_at = NOW()
        WHERE id = :id
    ");

    $stmt->execute([
        ":image" => $newImage,
        ":title" => $title,
        ":description" => $description,
        ":price" => $price,
        ":bathrooms" => (int) $bathrooms,
        ":garage" => (int) $garage,
        ":bedrooms" => (int) $bedrooms,
        ":id" => $id
    ]);

    // Eliminamos la imagen anterior únicamente si cambió.
    $imageDeleted = true;

    if ($oldImage !== $newImage) {
        $imageDeleted = deleteUploadedImage(
            $oldImage,
            "properties"
        );
    }

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Propiedad actualizada correctamente."
            : "Propiedad actualizada, pero no fue posible eliminar la imagen anterior.",
        "id" => (int) $id,
        "old_image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
