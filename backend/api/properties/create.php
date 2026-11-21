
<?php

// Cargamos CORS y autenticación administrativa.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Conexión a MySQL.
require_once __DIR__ . "/../../config/database.php";

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

// Recibimos los datos enviados desde React.
$data = json_decode(file_get_contents("php://input"), true);

// Comprobamos que recibimos un objeto JSON válido.
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

// Validamos el título según la estructura de MySQL.
$title = trim($title);

if (strlen($title) > 150) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El título no puede superar los 150 caracteres."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos la descripción.
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

    // Insertamos la propiedad en MySQL.
    $sql = "
        INSERT INTO properties (
            image,
            title,
            description,
            price,
            bathrooms,
            garage,
            bedrooms
        )
        VALUES (
            :image,
            :title,
            :description,
            :price,
            :bathrooms,
            :garage,
            :bedrooms
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":image" => $image,
        ":title" => $title,
        ":description" => $description,
        ":price" => $price,
        ":bathrooms" => (int) $bathrooms,
        ":garage" => (int) $garage,
        ":bedrooms" => (int) $bedrooms
    ]);

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Propiedad creada correctamente.",
        "id" => (int) $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // Guardamos el detalle técnico en el servidor.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al crear la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
