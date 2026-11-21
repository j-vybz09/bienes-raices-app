
<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

// Solo permitimos solicitudes POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

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

    // Limpiamos los datos recibidos.
    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $message = trim($data["message"] ?? "");

    // Validamos los campos obligatorios.
    if ($name === "" || $email === "" || $message === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Nombre, correo y mensaje son obligatorios."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Validamos el correo electrónico.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El correo electrónico no es válido."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Insertamos el mensaje en MySQL.
    $sql = "
        INSERT INTO contact_messages
            (name, email, phone, message)
        VALUES
            (:name, :email, :phone, :message)
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":phone" => $phone !== "" ? $phone : null,
        ":message" => $message
    ]);

    // Obtenemos el ID generado.
    $id = $pdo->lastInsertId();

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Mensaje de contacto enviado correctamente.",
        "data" => [
            "id" => $id,
            "name" => $name,
            "email" => $email
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al guardar el mensaje de contacto."
    ], JSON_UNESCAPED_UNICODE);
}
