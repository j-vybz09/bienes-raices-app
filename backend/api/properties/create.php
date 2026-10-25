<?php

require_once "../../config/database.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos"
        ]);

        exit;
    }

    $sql = "
        INSERT INTO properties
        (
            image,
            title,
            description,
            price,
            bathrooms,
            garage,
            bedrooms
        )
        VALUES
        (
            :image,
            :title,
            :description,
            :price,
            :bathrooms,
            :garage,
            :bedrooms
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":image" => $data["image"],
        ":title" => $data["title"],
        ":description" => $data["description"],
        ":price" => $data["price"],
        ":bathrooms" => $data["bathrooms"],
        ":garage" => $data["garage"],
        ":bedrooms" => $data["bedrooms"]
    ]);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => true,
        "message" => "Propiedad creada correctamente",
        "id" => $pdo->lastInsertId()
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => false,
        "message" => "Error al crear la propiedad",
        "error" => $e->getMessage()
    ]);
}