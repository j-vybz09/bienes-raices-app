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

// Recibimos los datos JSON.
$data = json_decode(file_get_contents("php://input"), true);

$requiredFields = [
    "image",
    "title",
    "date",
    "author",
    "description",
    "content"
];

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El cuerpo de la solicitud no contiene JSON válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Validamos los campos obligatorios.
foreach ($requiredFields as $field) {
    if (
        !isset($data[$field]) ||
        !is_string($data[$field]) ||
        trim($data[$field]) === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El campo " . $field . " es obligatorio."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}

try {
    // Consultamos la imagen que tiene actualmente la publicación.
    $find = $pdo->prepare("
        SELECT image
        FROM blog_posts
        WHERE id = :id
    ");

    $find->execute([":id" => $id]);

    $currentBlog = $find->fetch(PDO::FETCH_ASSOC);

    if (!$currentBlog) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "La publicación no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $oldImage = $currentBlog["image"];
    $newImage = trim($data["image"]);

    // Actualizamos los datos de la publicación.
    $stmt = $pdo->prepare("
        UPDATE blog_posts
        SET image = :image,
            title = :title,
            date = :date,
            author = :author,
            description = :description,
            content = :content
        WHERE id = :id
    ");

    $stmt->execute([
        ":image" => $newImage,
        ":title" => trim($data["title"]),
        ":date" => $data["date"],
        ":author" => trim($data["author"]),
        ":description" => trim($data["description"]),
        ":content" => trim($data["content"]),
        ":id" => $id
    ]);

    // Si la imagen cambió, intentamos eliminar la anterior.
    $imageDeleted = true;

    if ($oldImage !== $newImage) {
        $imageDeleted = deleteUploadedImage($oldImage, "blog");
    }

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Publicación actualizada correctamente."
            : "Publicación actualizada, pero no fue posible eliminar la imagen anterior.",
        "id" => $id,
        "old_image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
