<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza GET."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Se requiere un ID de publicación válido."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, image, title, date, author, description, content
        FROM blog_posts
        WHERE id = :id
    ");
    $stmt->execute([":id" => $id]);
    $blog = $stmt->fetch();

    if (!$blog) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Publicación no encontrada."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $blog
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
