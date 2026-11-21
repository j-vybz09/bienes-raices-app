
<?php

// Cargamos CORS y autenticación.
require_once __DIR__ . "/../../config/auth.php";

// Solo permitimos solicitudes PUT.
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Verificamos la sesión administrativa.
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

    // Recibimos los datos JSON enviados desde React.
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos válidos."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Comprobamos que se haya enviado el estado.
    if (
        !isset($data["status"]) ||
        !is_string($data["status"])
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El estado del mensaje es obligatorio."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $status = trim($data["status"]);

    // Estados permitidos por la aplicación.
    $allowedStatuses = [
        "pending",
        "read",
        "answered"
    ];

    // Validamos que el estado sea uno de los permitidos.
    if (!in_array($status, $allowedStatuses, true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El estado enviado no es válido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Comprobamos que el mensaje exista.
    $checkSql = "
        SELECT id
        FROM contact_messages
        WHERE id = :id
        LIMIT 1
    ";

    $checkStmt = $pdo->prepare($checkSql);

    $checkStmt->execute([
        ":id" => $id
    ]);

    if (!$checkStmt->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "El mensaje de contacto no existe."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Actualizamos el estado del mensaje.
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

    // Devolvemos la respuesta al frontend.
    echo json_encode([
        "success" => true,
        "message" => "Estado del mensaje actualizado correctamente.",
        "data" => [
            "id" => (int) $id,
            "status" => $status
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // Registramos el error internamente.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar el estado del mensaje."
    ], JSON_UNESCAPED_UNICODE);
}
