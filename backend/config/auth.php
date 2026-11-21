<?php
// CONFIGURACIÓN DE AUTORIZACIÓN

// Cargamos CORS antes de ejecutar cualquier operación.
require_once __DIR__ . "/cors.php";

// FUNCIÓN PARA VERIFICAR AL ADMINISTRADOR
function requireAdmin(): void {
    // Iniciamos la sesión si todavía no está iniciada.
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Comprobamos que exista una sesión administrativa.
    if (!isset($_SESSION["admin"])) {

        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "No tienes autorización. Inicia sesión como administrador."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}
