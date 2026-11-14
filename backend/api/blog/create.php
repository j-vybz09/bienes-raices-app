<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza POST."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$requiredFields = ["image", "title", "date", "author", "description", "content"];

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El cuerpo de la solicitud no contiene JSON válido."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "El campo " . $field . " es obligatorio."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

try {
    $sql = "
        INSERT INTO blog_posts
            (image, title, date, author, description, content)
        VALUES
            (:image, :title, :date, :author, :description, :content)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":image" => $data["image"],
        ":title" => $data["title"],
        ":date" => $data["date"],
        ":author" => $data["author"],
        ":description" => $data["description"],
        ":content" => $data["content"]
    ]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Publicación creada correctamente.",
        "id" => (int) $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al crear la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
