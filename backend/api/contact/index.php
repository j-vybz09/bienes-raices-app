<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

try {
    $sql = " SELECT id, name, email, phone, message, status, created_at FROM contact_messages ORDER BY created_at DESC, id DESC";

    //Prepara y ejecuta la consulta
    $stmt = $pdo->prepare($sql);//prepara
    $stmt->execute();//ejecuta

    //Obtiene todos los resultados
    $contacts = $stmt->fetchAll();

    //Devolver la respuesta en formato JSON
    echo json_encode([
        "success" => true,
        "total" => count($contacts),
        "data" => $contacts
    ], JSON_UNESCAPED_UNICODE);

} catch (\Throwable $e) {
    //Manejar posibles errores
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al obtener los mensajes de contacto",
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
