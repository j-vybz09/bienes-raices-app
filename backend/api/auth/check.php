
<?php

require_once __DIR__ . "/../../config/cors.php";

// Solo permitimos GET.
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

session_start();

if (!isset($_SESSION["admin"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "No hay una sesión activa."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

http_response_code(200);

echo json_encode([
    "success" => true,
    "message" => "Sesión activa.",
    "data" => $_SESSION["admin"]
], JSON_UNESCAPED_UNICODE);
