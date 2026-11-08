<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

try {

    $stmt = $pdo->query("
        SELECT
            id,
            image,
            title,
            date,
            author,
            description,
            content
        FROM blog_posts
        ORDER BY id DESC
    ");

    $posts = $stmt->fetchAll();

    header("Content-Type: application/json");

    echo json_encode([
        "success" => true,
        "data" => $posts
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener los artículos",
        "error" => $e->getMessage()
    ]);
}