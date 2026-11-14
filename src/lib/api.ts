import type { BlogPropiedad, Propiedad } from "../types";

const API_URL = "http://localhost:8000/api";
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");
const AUTH_URL = "/auth";

// ======================================================
// TIPOS DE RESPUESTA
// ======================================================

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  id?: number | string;
  total?: number;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
};

export type PropertyInput = Omit<Propiedad, "id">;
export type BlogInput = Omit<BlogPropiedad, "id">;

// ======================================================
// ERROR PERSONALIZADO DE LA API
// ======================================================

class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

// ======================================================
// FUNCIÓN CENTRAL PARA LAS PETICIONES HTTP
// ======================================================

async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: options.credentials ?? "same-origin",
    headers,
  });

  const result = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !result?.success) {
    throw new ApiRequestError(
      result?.message || `Error en la solicitud (${response.status}).`,
      response.status
    );
  }

  return result;
}

// ======================================================
// SUBIDA DE IMÁGENES
// ======================================================

type UploadImageResponse = {
  success: boolean;
  message?: string;
  image?: string;
};

// Tipos de imágenes que permite subir el backend.
export type ImageUploadType = "property" | "blog";

// Convierte la ruta guardada en MySQL en una URL que el navegador pueda mostrar.
export function getImageUrl(path: string): string {
  if (!path) return "";

  // Si ya es una URL completa, la utilizamos directamente.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Limpiamos las barras iniciales.
  const cleanPath = path.replace(/^\/+/, "");

  // Las imágenes subidas por PHP se sirven desde el backend.
  if (cleanPath.startsWith("uploads/")) {
    return `${SERVER_URL}/${cleanPath}`;
  }

  // Las imágenes estáticas pertenecen al public/ del frontend.
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

// Sube imágenes al servidor PHP.
// El backend determina la carpeta según el tipo recibido.

export async function uploadImage(
  file: File,
  type: ImageUploadType
): Promise<string> {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("type", type);

  const response = await fetch(`${API_URL}/upload.php`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as
    | UploadImageResponse
    | null;

  if (!response.ok || !result?.success || !result.image) {
    throw new ApiRequestError(
      result?.message ||
        `No fue posible subir la imagen (${response.status}).`,
      response.status
    );
  }

  return result.image;
}



// Sube una imagen exclusivamente a backend/uploads/blog/.
// Este endpoint no recibe ni permite seleccionar la carpeta de destino.
export async function uploadBlogImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/blog/upload.php`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as
    | UploadImageResponse
    | null;

  if (!response.ok || !result?.success || !result.image) {
    throw new ApiRequestError(
      result?.message || `No fue posible subir la imagen del blog (${response.status}).`,
      response.status
    );
  }

  return result.image;
}

// ======================================================
// PROPIEDADES
// ======================================================

// Obtener todas las propiedades.
export async function getProperties(): Promise<Propiedad[]> {
  const result = await apiRequest<Propiedad[]>("/properties");

  if (!result.data) {
    throw new Error("La API no devolvió las propiedades.");
  }

  return result.data;
}

// Obtener una propiedad por ID.
export async function getProperty(id: number): Promise<Propiedad> {
  const result = await apiRequest<Propiedad>(
    `/properties/show.php?id=${id}`
  );

  if (!result.data) {
    throw new Error("La API no devolvió la propiedad.");
  }

  return result.data;
}

// Crear una propiedad.
export async function createProperty(
  property: PropertyInput
): Promise<number> {
  const result = await apiRequest("/properties/create.php", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(property),
  });

  if (result.id === undefined) {
    throw new Error("La propiedad se creó, pero no se recibió su ID.");
  }

  return Number(result.id);
}

// Actualizar una propiedad.
export async function updateProperty(
  id: number,
  property: PropertyInput
): Promise<void> {
  await apiRequest(`/properties/update.php?id=${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(property),
  });
}

// Eliminar una propiedad.
export async function deleteProperty(id: number): Promise<void> {
  await apiRequest(`/properties/delete.php?id=${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// ======================================================
// PUBLICACIONES DEL BLOG
// ======================================================

// Obtener todas las publicaciones.
export async function getBlogs(): Promise<BlogPropiedad[]> {
  const result = await apiRequest<BlogPropiedad[]>("/blog");

  if (!result.data) {
    throw new Error("La API no devolvió las publicaciones.");
  }

  return result.data;
}

// Obtener una publicación por ID.
export async function getBlog(id: number): Promise<BlogPropiedad> {
  const result = await apiRequest<BlogPropiedad>(
    `/blog/show.php?id=${id}`
  );

  if (!result.data) {
    throw new Error("La API no devolvió la publicación.");
  }

  return result.data;
}

// Crear una publicación.
export async function createBlog(blog: BlogInput): Promise<number> {
  const result = await apiRequest("/blog/create.php", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(blog),
  });

  if (result.id === undefined) {
    throw new Error("La publicación se creó, pero no se recibió su ID.");
  }

  return Number(result.id);
}

// Actualizar una publicación.
export async function updateBlog(
  id: number,
  blog: BlogInput
): Promise<void> {
  await apiRequest(`/blog/update.php?id=${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(blog),
  });
}

// Eliminar una publicación.
export async function deleteBlog(id: number): Promise<void> {
  await apiRequest(`/blog/delete.php?id=${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// ======================================================
// MENSAJES DE CONTACTO
// ======================================================

// Obtener todos los mensajes.
export async function getContacts(): Promise<ContactMessage[]> {
  const result = await apiRequest<ContactMessage[]>("/contact", {
    credentials: "include",
  });

  if (!result.data) {
    throw new Error("La API no devolvió los mensajes de contacto.");
  }

  return result.data;
}

// Obtener un mensaje por ID.
export async function getContact(id: number): Promise<ContactMessage> {
  const result = await apiRequest<ContactMessage>(
    `/contact/show.php?id=${id}`,
    {
      credentials: "include",
    }
  );

  if (!result.data) {
    throw new Error("La API no devolvió el mensaje.");
  }

  return result.data;
}

// Actualizar el estado de un mensaje.
export async function updateContactStatus(
  id: number,
  status: string
): Promise<void> {
  await apiRequest(`/contact/update.php?id=${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ status }),
  });
}

// Eliminar un mensaje.
export async function deleteContact(id: number): Promise<void> {
  await apiRequest(`/contact/delete.php?id=${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// ======================================================
// AUTENTICACIÓN DEL ADMINISTRADOR
// ======================================================

// Iniciar sesión.
export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminUser> {
  const result = await apiRequest<AdminUser>(
    `${AUTH_URL}/login.php`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );

  if (!result.data) {
    throw new Error("No se recibieron los datos del administrador.");
  }

  return result.data;
}

// Comprobar si existe una sesión activa.
export async function checkAdminSession(): Promise<AdminUser | null> {
  try {
    const result = await apiRequest<AdminUser>(
      `${AUTH_URL}/check.php`,
      {
        credentials: "include",
      }
    );

    return result.data ?? null;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

// Cerrar sesión.
export async function logoutAdmin(): Promise<void> {
  await apiRequest(`${AUTH_URL}/logout.php`, {
    method: "POST",
    credentials: "include",
  });
}
