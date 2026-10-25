<?php

require_once "../../config/database.php";

header("Content-Type: application/json");

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la propiedad es requerido"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare(
        "SELECT * FROM properties WHERE id = ?"
    );

    $stmt->execute([$id]);

    $property = $stmt->fetch();

    if (!$property) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada"
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $property
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener la propiedad"
    ]);
}