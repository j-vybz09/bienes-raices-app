<?php

    require_once "../../config/database.php";

    $id = $_GET["id"] ?? null;

    if(!$id){
        //Al presentar el error con este numero
        http_response_code(400);
        //El success es false, y tira el siguiente mensaje
        echo json_encode([
            "success" => false,
            "message" => "Se requiere el ID de la publicación"
        ]);
        exit;
    }

    try {
        $sql = "SELECT id, image, title, date, author, description, content FROM blog_posts WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":id" => $id
        ]);
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$blog){
            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Publicación no encontrada"
            ]);

            exit;
        }

        header("Content-Type: application/json");

        echo json_encode([
            "success" => true,
            "data" => $blog
        ]);

    } catch (\Throwable $e) {
        http_response_code(500);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => false,
            "message" => "Error al obtener la publicación",
            "error" => $e->getMessage()
        ]);
    }
