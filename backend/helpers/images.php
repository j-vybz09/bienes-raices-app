
<?php

/**
 * Elimina una imagen subida por el administrador.
 *
 * Solo permite eliminar imágenes de las carpetas autorizadas
 * y cuyos nombres hayan sido generados por nuestro sistema.
 */
function deleteUploadedImage(string $imagePath, string $folder): bool
{
    // Carpetas permitidas.
    $allowedFolders = ["blog", "properties"];

    if (!in_array($folder, $allowedFolders, true)) {
        return false;
    }

    // La ruta debe comenzar con uploads/<carpeta>/.
    $expectedPrefix = "uploads/" . $folder . "/";

    if (!str_starts_with($imagePath, $expectedPrefix)) {
        return false;
    }

    // Extraemos el nombre del archivo.
    $filename = substr($imagePath, strlen($expectedPrefix));

    // Permitimos JPG, PNG, WebP y AVIF.
    // Los nombres deben tener 32 caracteres hexadecimales.
    if (!preg_match('/^[a-f0-9]{32}\.(jpg|jpeg|png|webp|avif)$/i', $filename)) {
        return false;
    }

    // Obtenemos la ruta física de la carpeta.
    $uploadDirectory = realpath(
        __DIR__ . "/../uploads/" . $folder
    );

    if ($uploadDirectory === false) {
        return false;
    }

    // Construimos la ruta completa del archivo.
    $filePath = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;

    // Si no existe, no hay nada que eliminar.
    if (!is_file($filePath)) {
        return true;
    }

    // Eliminamos el archivo.
    return unlink($filePath);
}
