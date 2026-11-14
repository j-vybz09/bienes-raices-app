<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ]);

    exit;
}

session_start();

if (!isset($_SESSION["admin"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "No tienes autorización para consultar estos mensajes."
    ]);

    exit;
}

require_once "../../config/database.php";

try {
    $sql = "SELECT id, name, email, phone, message, status, created_at FROM contact_messages ORDER BY created_at DESC, id DESC";

    $stmt = $pdo->query($sql);
    $contacts = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "total" => count($contacts),
        "data" => $contacts
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener los mensajes de contacto."
    ], JSON_UNESCAPED_UNICODE);
}
