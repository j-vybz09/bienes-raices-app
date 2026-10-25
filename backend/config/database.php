<?php

$host = "127.0.0.1";
$dbname = "bienes_raices";
$username = "root";
$password = "root";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );
    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );
    $pdo->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );
} catch (\Throwable $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

