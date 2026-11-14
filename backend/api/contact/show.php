<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

header("Content-Type: application/json; charset=utf-8");

require_once "../../config/database.php";

try {

    // 1. Obtener y validar el ID desde la URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id || $id <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Debes proporcionar un ID válido"
        ]);

        exit;
    }

    // 2. Preparar la consulta SQL
    $sql = "SELECT id, name, email, phone, message, status, created_at FROM contact_messages WHERE id = :id LIMIT 1";

    // 3. Preparar la consulta con PDO
    $stmt = $pdo->prepare($sql);

    // 4. Ejecutar la consulta enviando el ID
    $stmt->execute([
        ":id" => $id
    ]);

    // 5. Obtener el registro encontrado
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    // 6. Comprobar si existe el mensaje
    if (!$contact) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "El mensaje de contacto no existe"
        ]);

        exit;
    }

    // 7. Devolver el resultado
    echo json_encode([
        "success" => true,
        "data" => $contact
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar el mensaje",
        "error" => $e->getMessage()
    ]);
}
