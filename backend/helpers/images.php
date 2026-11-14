<?php
/**
 * Elimina una imagen subida por el administrador.
 *
 * Solo permite eliminar imágenes de la carpeta indicada
 * y con nombres de archivo generados por nuestro sistema.
 */
function deleteUploadedImage(string $imagePath, string $folder): bool {
    // Solo aceptamos estas dos carpetas.
    $allowedFolders = ["blog", "properties"];

    if (!in_array($folder, $allowedFolders, true)) {
        return false;
    }

    // La ruta debe comenzar exactamente con uploads/<carpeta>/.
    $expectedPrefix = "uploads/" . $folder . "/";

    if (!str_starts_with($imagePath, $expectedPrefix)) {
        return false;
    }

    // Extraemos únicamente el nombre del archivo.
    $filename = substr($imagePath, strlen($expectedPrefix));

    // Aceptamos solamente nombres hexadecimales generados por random_bytes.
    if (!preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', $filename)) {
        return false;
    }

    // Construimos la ruta física dentro de backend/uploads/.
    $uploadDirectory = realpath(__DIR__ . "/../uploads/" . $folder);

    if ($uploadDirectory === false) {
        return false;
    }

    $filePath = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;

    // Si el archivo ya no existe, no hay nada que eliminar.
    if (!is_file($filePath)) {
        return true;
    }

    return unlink($filePath);
}
