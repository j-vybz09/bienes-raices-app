
<?php

// Cargamos CORS y autenticación.
require_once __DIR__ . "/../../config/auth.php";

// Solo permitimos solicitudes GET.
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Verificamos la sesión del administrador.
requireAdmin();

// Conectamos con MySQL.
require_once __DIR__ . "/../../config/database.php";

try {

    // Obtenemos y validamos el ID desde la URL.
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id || $id <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Debes proporcionar un ID válido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Consultamos el mensaje solicitado.
    $sql = "
        SELECT
            id,
            name,
            email,
            phone,
            message,
            status,
            created_at
        FROM contact_messages
        WHERE id = :id
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);

    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    // Comprobamos si existe el mensaje.
    if (!$contact) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "El mensaje de contacto no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Devolvemos el mensaje encontrado.
    echo json_encode([
        "success" => true,
        "data" => $contact
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar el mensaje."
    ], JSON_UNESCAPED_UNICODE);
}
