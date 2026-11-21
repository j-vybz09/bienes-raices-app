
<?php

// Cargamos CORS y autenticación.
require_once __DIR__ . "/../../config/auth.php";

// Solo permitimos solicitudes DELETE.
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método HTTP no permitido."
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

    // Preparamos la consulta para eliminar el mensaje.
    $sql = "
        DELETE FROM contact_messages
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    $stmt->execute();

    // Comprobamos si realmente se eliminó un registro.
    if ($stmt->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "No se encontró el mensaje solicitado."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Devolvemos la confirmación.
    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "Mensaje eliminado correctamente.",
        "data" => [
            "id" => (int) $id
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    // Registramos el error internamente.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar el mensaje."
    ], JSON_UNESCAPED_UNICODE);
}
