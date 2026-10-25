
<?php

require_once "../../config/database.php";

header("Content-Type: application/json; charset=UTF-8");

if($_SERVER["REQUEST_METHOD"] !== "PUT"){
    http_response_code(405);

    echo json_encode([
        "seccess" => false,
        "message" => "Método no permitido"
    ]);

    exit;
}

$id = $_GET["id"] ?? null;

if(!$id){
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El ID de la propiedad es obligatorio"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "El cuerpo de la solicitud es válido"
    ]);

    exit;
}

//Ahora almacenamos los datos de la DB en las variables

$image = $data["image"] ?? null;
$title = $data["title"] ?? null;
$description = $data["description"] ?? null;
$price = $data["price"] ?? null;
$bathrooms = $data["bathrooms"] ?? null;
$garage = $data["garage"] ?? null;
$bedrooms = $data["bedrooms"] ?? null;

if(!$image || !$title || !$description || $price === null || $bathrooms === null || $garage === null || $bedrooms === null){
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare(
        "SELECT id FROM properties WHERE id = :id"
    );

    $stmt->execute([
        ":id" => $id
    ]);

    $property = $stmt->fetch();

    if (!$property) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Propiedad no encontrada"
        ]);

        exit;
    }

    $stmt = $pdo->prepare(
        "UPDATE properties
         SET
            image = :image,
            title = :title,
            description = :description,
            price = :price,
            bathrooms = :bathrooms,
            garage = :garage,
            bedrooms = :bedrooms,
            updated_at = NOW()
         WHERE id = :id"
    );

    $stmt->execute([
        ":image" => $image,
        ":title" => $title,
        ":description" => $description,
        ":price" => $price,
        ":bathrooms" => $bathrooms,
        ":garage" => $garage,
        ":bedrooms" => $bedrooms,
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Propiedad actualizada correctamente",
        "id" => (int) $id
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la propiedad",
        "error" => $e->getMessage()
    ]);
}

