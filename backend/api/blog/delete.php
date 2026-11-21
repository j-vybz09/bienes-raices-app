
<?php

// CORS y autenticación.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Conexión a MySQL y helper de imágenes.
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/images.php";

header("Content-Type: application/json; charset=UTF-8");

// Solo permitimos DELETE.
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
        "message" => "El ID de la publicación no es válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {
    // Recuperamos la imagen de la publicación.
    $find = $pdo->prepare("
        SELECT image
        FROM blog_posts
        WHERE id = :id
    ");

    $find->execute([
        ":id" => $id
    ]);

    $blog = $find->fetch(PDO::FETCH_ASSOC);

    if (!$blog) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "La publicación no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Eliminamos el registro de MySQL.
    $stmt = $pdo->prepare("
        DELETE FROM blog_posts
        WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $id
    ]);

    // Eliminamos el archivo físico.
    $imageDeleted = deleteUploadedImage(
        $blog["image"],
        "blog"
    );

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Publicación e imagen eliminadas correctamente."
            : "Publicación eliminada, pero no fue posible eliminar su imagen.",
        "id" => (int) $id,
        "image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
