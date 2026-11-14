<?php

// Origen autorizado del frontend durante el desarrollo.
$allowedOrigin = "http://localhost:5173";

// Permitimos únicamente el origen configurado.
header("Access-Control-Allow-Origin: " . $allowedOrigin);

// Permitimos enviar y recibir cookies de sesión.
header("Access-Control-Allow-Credentials: true");

// Métodos HTTP utilizados por nuestra API.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Cabeceras que puede enviar React.
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Indicamos que las respuestas pueden variar según el origen.
header("Vary: Origin");

// Formato de respuesta de nuestra API.
header("Content-Type: application/json; charset=UTF-8");

// ======================================================
// PETICIONES PREVIAS OPTIONS
// ======================================================

// El navegador puede enviar OPTIONS antes de POST, PUT o DELETE.
// Respondemos sin ejecutar la lógica del endpoint.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}
