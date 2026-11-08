<?php

header("Content-Type: application/json; charset=utf-8");

require_once "../../config/database.php";

try {

    // 1. Obtener el ID desde la URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if (!$id) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El ID del mensaje es obligatorio"
        ]);

        exit;
    }

    // 2. Obtener los datos enviados en formato JSON
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos válidos"
        ]);

        exit;
    }

    // 3. Validar que se haya enviado el estado
    if (
        !array_key_exists("status", $data) ||
        !is_string($data["status"]) ||
        trim($data["status"]) === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El estado del mensaje es obligatorio"
        ]);

        exit;
    }

    // 4. Limpiar el valor recibido
    $status = trim($data["status"]);

    // 5. Comprobar que el mensaje existe
    $checkSql = "
        SELECT id
        FROM contact_messages
        WHERE id = :id
    ";

    $checkStmt = $pdo->prepare($checkSql);

    $checkStmt->execute([
        ":id" => $id
    ]);

    if (!$checkStmt->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "El mensaje de contacto no existe"
        ]);

        exit;
    }

    // 6. Actualizar únicamente el estado
    $sql = "
        UPDATE contact_messages
        SET status = :status
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":status" => $status,
        ":id" => $id
    ]);

    // 7. Enviar la respuesta
    echo json_encode([
        "success" => true,
        "message" => "Estado del mensaje actualizado correctamente",
        "data" => [
            "id" => $id,
            "status" => $status
        ]
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar el estado del mensaje",
        "error" => $e->getMessage()
    ]);
}