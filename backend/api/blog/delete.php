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

// Validamos el ID recibido.
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la publicación es obligatorio y debe ser válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {
    // Primero obtenemos la ruta de la imagen asociada a la publicación.
    $find = $pdo->prepare("
        SELECT image
        FROM blog_posts
        WHERE id = :id
    ");

    $find->execute([":id" => $id]);

    $blog = $find->fetch(PDO::FETCH_ASSOC);

    if (!$blog) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "La publicación no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Eliminamos primero el registro de MySQL.
    $stmt = $pdo->prepare("
        DELETE FROM blog_posts
        WHERE id = :id
    ");

    $stmt->execute([":id" => $id]);

    // Después eliminamos su imagen del servidor.
    $imageDeleted = deleteUploadedImage($blog["image"], "blog");

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Publicación e imagen eliminadas correctamente."
            : "Publicación eliminada, pero no fue posible eliminar su imagen.",
        "id" => $id,
        "image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
