
<?php

// CORS y autenticación.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Conexión a MySQL y helper de imágenes.
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../helpers/images.php";

header("Content-Type: application/json; charset=UTF-8");

// Solo permitimos PUT.
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

// Recibimos el JSON.
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

// Validamos todos los campos.
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

// Validamos la fecha.
$date = trim($data["date"]);
$dateObject = DateTime::createFromFormat("!Y-m-d", $date);

if (!$dateObject || $dateObject->format("Y-m-d") !== $date) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "La fecha no es válida. Utiliza YYYY-MM-DD."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Limpiamos los valores.
$image = trim($data["image"]);
$title = trim($data["title"]);
$author = trim($data["author"]);
$description = trim($data["description"]);
$content = trim($data["content"]);

try {
    // Recuperamos la imagen actual.
    $find = $pdo->prepare("
        SELECT image
        FROM blog_posts
        WHERE id = :id
    ");

    $find->execute([
        ":id" => $id
    ]);

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

    // Actualizamos la publicación.
    $stmt = $pdo->prepare("
        UPDATE blog_posts
        SET
            image = :image,
            title = :title,
            date = :date,
            author = :author,
            description = :description,
            content = :content,
            updated_at = NOW()
        WHERE id = :id
    ");

    $stmt->execute([
        ":image" => $image,
        ":title" => $title,
        ":date" => $date,
        ":author" => $author,
        ":description" => $description,
        ":content" => $content,
        ":id" => $id
    ]);

    // Eliminamos la imagen anterior si fue reemplazada.
    $imageDeleted = true;

    if ($oldImage !== $image) {
        $imageDeleted = deleteUploadedImage($oldImage, "blog");
    }

    echo json_encode([
        "success" => true,
        "message" => $imageDeleted
            ? "Publicación actualizada correctamente."
            : "Publicación actualizada, pero no fue posible eliminar la imagen anterior.",
        "id" => (int) $id,
        "old_image_deleted" => $imageDeleted
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la publicación."
    ], JSON_UNESCAPED_UNICODE);
}
