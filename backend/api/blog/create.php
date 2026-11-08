<?php
    require_once "../../config/database.php";

    try {
        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        if(!$data){
            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "No se recibieron datos"
            ]);

            exit;
        }

        $sql = "INSERT INTO blog_posts (image, title, date, author, description, content) VALUES (:image, :title, :date, :author, :description, :content)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ":image" => $data["image"],
            ":title" => $data["title"],
            ":date" => $data["date"],
            ":author" => $data["author"],
            ":description" => $data["description"],
            ":content" => $data["content"]
        ]);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => true,
            "message" => "Publicación creada correctamente",
            "id" => $pdo->lastInsertId()
        ]);
        
    } catch (\Throwable $e) {
        http_response_code(500);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => false,
            "message" => "Error al crear la publicación",
            "error" => $e->getMessage()
        ]);
    }
