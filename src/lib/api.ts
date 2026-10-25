import type { Propiedad } from "../types";

const API_URL = "http://localhost:8000/api";

type PropertiesResponse = {
  success: boolean;
  data: Propiedad[];
};

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