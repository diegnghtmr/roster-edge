import { toast } from "sonner";

interface IProps {
  data: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resource?: string[];
    [key: string]: string | Blob;
  };
  resource: string[];
  params?: string | undefined;
  method?: string;
  isFormData?: boolean;
}

const fetchMutation = async ({
  data,
  resource,
  params,
  method = "POST",
  isFormData = false,
}: IProps) => {
  if (data?.resource) {
    resource = data.resource;
    delete data.resource;
  }
  const cookies = localStorage.getItem("token");
  let body: string | FormData;

  // In case the mutation contains fails so, it will add the form data
  if (isFormData) {
    // Define a new instance of FormData
    body = new FormData();

    // loop through the object keys to be added to the form data
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        if (body instanceof FormData) {
          // Convert complex values like arrays or objects to JSON strings
          if (
            typeof value === "object" &&
            value !== null &&
            !("lastModified" in value)
          ) {
            body.append(key, JSON.stringify(value));
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            body.append(key, value);
          }
        }
      });
    }
  } else {
    body = JSON.stringify(data); // In case the mutation doesn't contain files
  }

  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${cookies}`,
  };

  // Only set Content-Type if it's not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${resource?.join("")}/${params}`,
      {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: headers,
        body: body,
        redirect: "follow",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    );

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 0 || response.status >= 500) {
        toast.error(
          "El servidor no está disponible. Por favor, inténtalo más tarde.",
        );
        throw new Error(
          "El servidor no está disponible. Por favor, inténtalo más tarde.",
        );
      } else if (response.status === 401) {
        toast.error("No autorizado. Por favor, inicia sesión nuevamente.");
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      } else if (response.status === 403) {
        toast.error("No tienes permisos para realizar esta acción.");
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (response.status === 404) {
        toast.error("Recurso no encontrado.");
        throw new Error("Recurso no encontrado.");
      } else if (response.status === 400) {
        toast.error("Datos de entrada inválidos.");
        throw new Error("Datos de entrada inválidos.");
      } else if (response.status === 409) {
        toast.error("Conflicto: El recurso ya existe.");
        throw new Error("Conflicto: El recurso ya existe.");
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      toast.error(
        "El servidor no está disponible. Por favor, inténtalo más tarde.",
      );
      throw new Error(
        "El servidor no está disponible. Por favor, inténtalo más tarde.",
      );
    }
    throw error;
  }
};

export default fetchMutation;
