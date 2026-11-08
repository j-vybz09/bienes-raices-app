import type { BlogPropiedad, Propiedad } from "../types";

const API_URL = "http://localhost:8000/api";

type PropertiesResponse = {
  success: boolean;
  data: Propiedad[];
};

type PropertyResponse = {
  success: boolean;
  data: Propiedad;
};

type BlogResponse = {
  success: boolean;
  data: BlogPropiedad[];
}

export async function getProperties(): Promise<Propiedad[]> {
  const response = await fetch(`${API_URL}/properties`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las propiedades");
  }

  const data: PropertiesResponse = await response.json();

  if (!data.success) {
    throw new Error("La API no pudo obtener las propiedades");
  }

  return data.data;
}

export async function getProperty(id: number): Promise<Propiedad> {
  const response = await fetch(`${API_URL}/properties/show.php?id=${id}`)

  if (!response.ok) {
    throw new Error("No se pudo obtener la propiedad");
  }

  const data: PropertyResponse = await response.json();

  if (!data.success) {
    throw new Error("La API no pudo obtener la propiedad");
  }

  return data.data;
}

//Encargada de comunicarse con el backend y pedir todas las publicaciones.
export async function getBlogs(): Promise<BlogPropiedad[]> {
    const response = await fetch(`${API_URL}/blog`);

    if(!response.ok){
      throw new Error("No se pudieron obtener las publicaciones");
    }

    const data : BlogResponse = await response.json();

    if(!data.success){
      throw new Error("La API no pudo obtener publicaciones");
    }

    return data.data;
}

