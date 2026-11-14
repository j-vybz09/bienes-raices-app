<?php

require_once __DIR__ . "/../../config/cors.php";
require_once "../../config/cors.php";
require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza GET."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT id, image, title, date, author, description, content
        FROM blog_posts
        ORDER BY id DESC
    ");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al obtener los artículos."
    ], JSON_UNESCAPED_UNICODE);
}