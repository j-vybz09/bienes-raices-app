<?php

require_once "../../config/database.php";

try {

    $stmt = $pdo->query("
        SELECT
            id,
            image,
            title,
            description,
            price,
            bathrooms,
            garage,
            bedrooms
        FROM properties
        ORDER BY id DESC
    ");

    $properties = $stmt->fetchAll();

    header("Content-Type: application/json");

    echo json_encode([
        "success" => true,
        "data" => $properties
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener las propiedades",
        "error" => $e->getMessage()
    ]);
}