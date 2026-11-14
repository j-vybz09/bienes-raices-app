<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/images.php";

header("Content-Type: application/json; charset=UTF-8");

// Solo permitimos solicitudes DELETE.
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza DELETE."
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

try {
    // Buscamos la propiedad y recuperamos su imagen.
    $find = $pdo->prepare("
        SELECT image
        FROM properties
        WHERE id = :id
    ");

    $find->execute([
        ":id" => $id
    ]);

    $property = $find->fetch(PDO::FETCH_ASSOC);

    if (!$property) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Eliminamos primero el registro de MySQL.
    $stmt = $pdo->prepare("
        DELETE FROM properties
        WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $id
    ]);

    // Después eliminamos la imagen física.
    $imageDeleted = deleteUploadedImage(
        $property["image"],
        "properties"
    );

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Propiedad e imagen eliminadas correctamente."
            : "Propiedad eliminada, pero no fue posible eliminar su imagen.",
        "id" => (int) $id,
        "image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
