<?php

    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(204);
        exit;
    }

    session_start();

    if (!isset($_SESSION["admin"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "No hay una sesión activa."
        ]);

        exit;
    }

    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "Sesión activa.",
        "data" => $_SESSION["admin"]
    ]);

