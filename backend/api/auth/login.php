<?php

header("Content-Type: application/json; charset=UTF-8");

// Configuración CORS para React en desarrollo.
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Atendemos las peticiones OPTIONS.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Solo permitimos POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido."
    ]);

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
    ]);

    exit;
}

// Validamos los campos.
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El correo y la contraseña son obligatorios."
    ]);

    exit;
}

try {

    // Buscamos al administrador.
    $sql = "SELECT id, name, email, password
            FROM admins
            WHERE email = :email
            LIMIT 1";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":email" => $email
    ]);

    $admin = $stmt->fetch();

    // Comprobamos las credenciales.
    if (!$admin || !password_verify($password, $admin["password"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Correo o contraseña incorrectos."
        ]);

        exit;
    }

    // Renovamos el identificador de sesión.
    session_regenerate_id(true);

    // Guardamos los datos del administrador.
    $_SESSION["admin"] = [
        "id" => $admin["id"],
        "name" => $admin["name"],
        "email" => $admin["email"]
    ];

    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "Inicio de sesión exitoso.",
        "data" => [
            "id" => $admin["id"],
            "name" => $admin["name"],
            "email" => $admin["email"]
        ]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al iniciar sesión."
    ]);
}

