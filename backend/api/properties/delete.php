<?php

// CORS y autenticación administrativa.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Conexión a MySQL y helper de imágenes.
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

    // Iniciamos una transacción.
    $pdo->beginTransaction();

    // Buscamos la propiedad y su imagen.
    $find = $pdo->prepare("
        SELECT image
        FROM properties
        WHERE id = :id
        LIMIT 1
    ");

    $find->execute([
        ":id" => $id
    ]);

    $property = $find->fetch(PDO::FETCH_ASSOC);

    if (!$property) {

        $pdo->rollBack();

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Eliminamos el registro de MySQL.
    $stmt = $pdo->prepare("
        DELETE FROM properties
        WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $id
    ]);

    // Confirmamos la eliminación en MySQL.
    $pdo->commit();

    // Eliminamos la imagen física después del commit.
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

    // Si la transacción sigue activa, la revertimos.
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
