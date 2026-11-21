
<?php

// Orígenes autorizados para consumir la API.
$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173"
];

// Obtenemos el origen que envía el navegador.
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

// Verificamos si el origen está autorizado.
if ($origin !== "" && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

// Métodos HTTP permitidos.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Cabeceras permitidas.
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Tiempo de caché para las solicitudes OPTIONS.
header("Access-Control-Max-Age: 86400");

// Formato de respuesta.
header("Content-Type: application/json; charset=UTF-8");

// Gestionamos las solicitudes previas del navegador.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    if ($origin !== "" && !in_array($origin, $allowedOrigins, true)) {
        http_response_code(403);
        exit;
    }

    http_response_code(204);
    exit;
}
