
<?php

// 1. Verificamos que exista una sesión de administrador.
require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// 2. Conectamos con la base de datos.
require_once __DIR__ . "/../../config/database.php";

// 3. Indicamos que la respuesta será JSON.
header("Content-Type: application/json; charset=UTF-8");

// 4. Permitimos únicamente solicitudes PUT.
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Utiliza PUT."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 5. Obtenemos y validamos el ID de la publicación.
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la publicación es obligatorio y debe ser válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 6. Leemos los datos enviados desde React.
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos válidos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 7. Obtenemos exclusivamente los campos de blog_posts.
$image = trim($data["image"] ?? "");
$title = trim($data["title"] ?? "");
$date = trim($data["date"] ?? "");
$author = trim($data["author"] ?? "");
$description = trim($data["description"] ?? "");
$content = trim($data["content"] ?? "");

// 8. Validamos que los campos obligatorios tengan contenido.
if (
    $image === "" ||
    $title === "" ||
    $date === "" ||
    $author === "" ||
    $description === "" ||
    $content === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Todos los campos de la publicación son obligatorios."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// 9. Validamos que la fecha tenga el formato YYYY-MM-DD.
$dateObject = DateTime::createFromFormat("!Y-m-d", $date);

if (!$dateObject || $dateObject->format("Y-m-d") !== $date) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "La fecha no tiene un formato válido. Utiliza YYYY-MM-DD."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    // 10. Comprobamos que la publicación exista.
    $checkStmt = $pdo->prepare(
        "SELECT id FROM blog_posts WHERE id = :id"
    );

    $checkStmt->execute([
        ":id" => $id
    ]);

    if (!$checkStmt->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "La publicación que intentas actualizar no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // 11. Actualizamos los datos de la publicación.
    $sql = "
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
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":image" => $image,
        ":title" => $title,
        ":date" => $date,
        ":author" => $author,
        ":description" => $description,
        ":content" => $content,
        ":id" => $id
    ]);

    // 12. Devolvemos una respuesta exitosa.
    echo json_encode([
        "success" => true,
        "message" => "Publicación actualizada correctamente.",
        "id" => (int) $id
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // 13. Capturamos cualquier error del servidor.
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la publicación.",
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
