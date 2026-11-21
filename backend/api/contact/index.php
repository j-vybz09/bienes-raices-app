
<?php

// Cargamos CORS y la autenticación del administrador.
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

// Comprobamos que exista una sesión administrativa.
requireAdmin();

// Conectamos con MySQL.
require_once __DIR__ . "/../../config/database.php";

try {

    // Consultamos los mensajes más recientes.
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
        ORDER BY created_at DESC, id DESC
    ";

    $stmt = $pdo->query($sql);

    $contacts = $stmt->fetchAll();

    // Devolvemos los mensajes en formato JSON.
    echo json_encode([
        "success" => true,
        "total" => count($contacts),
        "data" => $contacts
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // Registramos el error internamente.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener los mensajes de contacto."
    ], JSON_UNESCAPED_UNICODE);
}
