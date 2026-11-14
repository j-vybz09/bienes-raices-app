<?php

require_once __DIR__ . "/../../config/auth.php";
requireAdmin();

// Importamos la conexión a la base de datos.
require_once __DIR__ . '/../../config/database.php';

// Importamos la función para enviar respuestas JSON.
require_once __DIR__ . '/../../helpers/response.php';

// Permitimos únicamente solicitudes DELETE.
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Método HTTP no permitido.'
    ]);

    exit;
}

// Obtenemos el ID enviado mediante la URL.
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

// Verificamos que el ID sea válido.
if (!$id || $id <= 0) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Debes proporcionar un ID válido.'
    ]);

    exit;
}

try {

    // Preparamos la consulta SQL para eliminar el mensaje.
    $sql = "DELETE FROM contact_messages WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    // Asociamos el ID recibido con el parámetro de la consulta.
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    // Ejecutamos la consulta.
    $stmt->execute();

    // Comprobamos si realmente se eliminó algún registro.
    if ($stmt->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'No se encontró el mensaje solicitado.'
        ]);

        exit;
    }

    http_response_code(200);

    // Devolvemos una respuesta exitosa.
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje eliminado correctamente.',
        'data' => [
            'id' => $id
        ]
    ]);

    exit;
    

} catch (PDOException $e) {
    http_response_code(500);

    json_encode([
        'success' => false,
        'message' => 'Error al eliminar el mensaje.'
    ]);
    // Registramos el error internamente.
    error_log($e->getMessage());

}
