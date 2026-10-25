<?php

require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

// Verificamos que la petición sea DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);

    exit;
}

// Obtenemos el ID desde la URL
$id = $_GET['id'] ?? null;

// Validamos que exista y sea un número entero
if (!$id || !filter_var($id, FILTER_VALIDATE_INT)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'El ID de la propiedad es obligatorio'
    ]);

    exit;
}

try {

    // Primero verificamos que la propiedad exista
    $stmt = $pdo->prepare(
        "SELECT id FROM properties WHERE id = :id"
    );

    $stmt->execute([
        'id' => $id
    ]);

    $property = $stmt->fetch();

    // Si no existe, devolvemos 404
    if (!$property) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Propiedad no encontrada'
        ]);

        exit;
    }

    // Eliminamos la propiedad
    $stmt = $pdo->prepare(
        "DELETE FROM properties WHERE id = :id"
    );

    $stmt->execute([
        'id' => $id
    ]);

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Propiedad eliminada correctamente',
        'id' => (int) $id
    ]);

} catch (\Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar la propiedad',
        'error' => $e->getMessage()
    ]);
}