<?php

require_once __DIR__ . "/../../config/cors.php";

// Solo permitimos POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Configuramos la sesión.
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

// Conexión a la base de datos.
require_once __DIR__ . "/../../config/database.php";

// Recibimos los datos JSON.
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Los datos enviados no son válidos."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El correo y la contraseña son obligatorios."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    $sql = "SELECT id, name, email, password
            FROM admins
            WHERE email = :email
            LIMIT 1";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":email" => $email
    ]);

    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin["password"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Correo o contraseña incorrectos."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    session_regenerate_id(true);

    $_SESSION["admin"] = [
        "id" => $admin["id"],
        "name" => $admin["name"],
        "email" => $admin["email"]
    ];

    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "Inicio de sesión exitoso.",
        "data" => $_SESSION["admin"]
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al iniciar sesión."
    ], JSON_UNESCAPED_UNICODE);
}
