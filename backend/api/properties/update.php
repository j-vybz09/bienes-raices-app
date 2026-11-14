<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

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

// Validamos el ID de la propiedad.
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la propiedad no es válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Recibimos los datos enviados desde React.
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El cuerpo de la solicitud no contiene JSON válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Extraemos los campos.
$image = $data["image"] ?? null;
$title = $data["title"] ?? null;
$description = $data["description"] ?? null;
$price = $data["price"] ?? null;
$bathrooms = $data["bathrooms"] ?? null;
$garage = $data["garage"] ?? null;
$bedrooms = $data["bedrooms"] ?? null;

// Validamos los campos obligatorios.
// Usamos === null para permitir valores numéricos iguales a cero.
if (
    !is_string($image) || trim($image) === "" ||
    !is_string($title) || trim($title) === "" ||
    !is_string($description) || trim($description) === "" ||
    $price === null ||
    $bathrooms === null ||
    $garage === null ||
    $bedrooms === null
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {
    // Buscamos la propiedad y recuperamos su imagen actual.
    $find = $pdo->prepare("
        SELECT image
        FROM properties
        WHERE id = :id
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

    // Guardamos la ruta de la imagen anterior.
    $oldImage = $currentProperty["image"];
    $newImage = trim($image);

    // Actualizamos los datos de la propiedad.
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
        ":title" => trim($title),
        ":description" => trim($description),
        ":price" => $price,
        ":bathrooms" => $bathrooms,
        ":garage" => $garage,
        ":bedrooms" => $bedrooms,
        ":id" => $id
    ]);

    // Si cambió la imagen, eliminamos el archivo anterior.
    $imageDeleted = true;

    if ($oldImage !== $newImage) {
        $imageDeleted = deleteUploadedImage($oldImage, "properties");
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
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
