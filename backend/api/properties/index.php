<?php

// Configuración CORS.
require_once __DIR__ . "/../../config/cors.php";

// Conexión a la base de datos.
require_once __DIR__ . "/../../config/database.php";

try {

    // Consultamos todas las propiedades.
    $sql = "
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
    ";

    $stmt = $pdo->query($sql);

    $properties = $stmt->fetchAll();

    // Devolvemos las propiedades.
    echo json_encode([
        "success" => true,
        "data" => $properties
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // Registramos el error en el servidor.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener las propiedades."
    ], JSON_UNESCAPED_UNICODE);
}
