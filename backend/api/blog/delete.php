<?php

header("Content-Type: application/json; charset=uft-8");

//Contenemos 
require_once "../../config/database.php";

try {
    //Verificamos que la petición utilice el método DELETE
    if($_SERVER["REQUEST_METHOD"] !== "DELETE" ){
        //Si tira este error
        http_response_code(405);
        //Imprime este mensaje
        echo json_encode([
            "success" => false,
            "message" => "El método http no permitido. Utiliza DELETE"
        ]);

        exit;
    }

    //Obtiene y valida el ID desde la URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if(!$id || $id < 1){
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "El ID de la publicación es obligatorio y debe ser válido"
        ]);

        exit;
    }

    //Preparamos la consulta SQL para eliminar la pubicación
    $sql = "DELETE FROM blog_posts WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([ ":id" => $id ]);
    
    //Enviamos respuesta de exito
    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "Publicación eliminada correctamente",
        "id" => $id
    ]);

} catch (\Throwable $e) {
    //Manejar cualquier error inesperado

    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar la publicación",
        "error" => $e->getMessage()
    ]);
}
