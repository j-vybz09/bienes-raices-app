
<?php

// Configuración CORS.
require_once __DIR__ . "/../../config/cors.php";

// Conexión a la base de datos.
require_once __DIR__ . "/../../config/database.php";

// Obtenemos y validamos el ID.
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la propiedad debe ser válido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    // Consultamos una propiedad específica.
    $sql = "
        SELECT
            id,
            image,
            title,
            description,
            price,
            bathrooms,
            garage,
            bedrooms,
            created_at,
            updated_at
        FROM properties
        WHERE id = :id
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);

    $property = $stmt->fetch();

    // Comprobamos si existe la propiedad.
    if (!$property) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $property
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener la propiedad."
    ], JSON_UNESCAPED_UNICODE);
}
