
<?php

header("Content-Type: application/json; charset=utf-8");

require_once "../../config/database.php";

try {

    // 1. Obtener el ID desde la URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El ID de la publicación es obligatorio"
        ]);

        exit;
    }

    // 2. Obtener los datos enviados en formato JSON
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos válidos"
        ]);

        exit;
    }

    // 3. Validar los campos necesarios
    $requiredFields = [ "image", "title", "date", "author", "description", "content"];

    foreach ($requiredFields as $field) {

        if (!array_key_exists($field, $data) || $data[$field] === null) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Falta el campo: " . $field
            ]);

            exit;
        }
    }

    // 4. Comprobar que la publicación existe
    $checkSql = "SELECT id FROM blog_posts WHERE id = :id";

    $checkStmt = $pdo->prepare($checkSql);

    $checkStmt->execute([
        ":id" => $id
    ]);

    if (!$checkStmt->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "La publicación no existe"
        ]);

        exit;
    }

    // 5. Construir la consulta SQL para actualizar
    $sql = "
        UPDATE blog_posts
        SET
            image = :image,
            title = :title,
            date = :date,
            author = :author,
            description = :description,
            content = :content
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    // 6. Ejecutar la actualización
    $stmt->execute([
        ":image" => $data["image"],
        ":title" => $data["title"],
        ":date" => $data["date"],
        ":author" => $data["author"],
        ":description" => $data["description"],
        ":content" => $data["content"],
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Publicación actualizada correctamente",
        "id" => $id
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la publicación",
        "error" => $e->getMessage()
    ]);
}
