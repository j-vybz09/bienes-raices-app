
<?php

$configFile = __DIR__ . "/database.production.php";

// Si no existe la configuración de producción,
// utilizamos la configuración local.
if (!file_exists($configFile)) {
    $configFile = __DIR__ . "/database.local.php";
}

// Comprobamos que exista una configuración.
if (!file_exists($configFile)) {
    throw new RuntimeException(
        "No se encontró el archivo de configuración de la base de datos."
    );
}

$config = require $configFile;

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4",
        $config["username"],
        $config["password"],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

} catch (PDOException $e) {
    error_log("Error de conexión MySQL: " . $e->getMessage());

    http_response_code(500);

    die("No se pudo establecer la conexión con la base de datos.");
}
