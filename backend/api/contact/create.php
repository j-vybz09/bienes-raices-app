<?php

header("Content-Type: application/json; charset=utf-8");

// Permitir solicitudes desde nuestro frontend
header("Access-Control-Allow-Origin: http://localhost:5173");

// Permitir el método POST y las solicitudes OPTIONS
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Permitir el encabezado Content-Type
header("Access-Control-Allow-Headers: Content-Type");

// Responder a la solicitud previa del navegador
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=uft-8");

require_once "../../config/database.php";
require_once "../../config/cors.php";

try {
    //El usuario realizara una peticion tipo POST
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        //Si marca este estado
        http_response_code(405);

        echo json_encode([
            "success" => false,
            "message" => "Método no permitido"
        ]);

        exit;
    }
    
    //Recibimos los datos enviados en formato JSON
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );
    
    //Comprobamos que los datos sean validos
    if(!is_array($data)){
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "No se recibieron datos válidos"
        ]);

        exit;
    }

    //Extraemos y limpiamos los datos
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $message = trim($data['message'] ?? '');

    if($name === "" || $email === "" || $message === ""){
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Nombre, Correo, Mensaje son obligatorios"
        ]);

        exit;
    }

    //Validamos el formato del correo
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El correo no es válido"
        ]);

        exit;
    }
    
    // 10. Preparamos la consulta SQL
    $sql = " INSERT INTO contact_messages ( name, email, phone, message ) VALUES ( :name, :email, :phone, :message)";

    $stmt = $pdo->prepare($sql);

    // 11. Ejecutamos el INSERT con los datos recibidos
    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":phone" => $phone !== "" ? $phone : null,
        ":message" => $message
    ]);

    // 12. Obtenemos el ID del registro creado
    $id = $pdo->lastInsertId();

    // 13. Respondemos que el registro fue exitoso
    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Mensaje de contacto enviado correctamente",
        "data" => [
            "id" => $id,
            "name" => $name,
            "email" => $email
        ]
    ]);

} catch (\Throwable $e) {

    // 14. Si ocurre un error, respondemos con código 500
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al guardar el mensaje de contacto",
        "error" => $e->getMessage()
    ]);
}
