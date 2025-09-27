interface IParamsType {
  resource: string[] | undefined;
  params?: string | undefined;
}

export const fetchGet = async ({ resource, params }: IParamsType) => {
  const searchParams = new URLSearchParams(params);
  const cookies = localStorage.getItem('token');

  try {
    // Join resource array with slashes
    const resourcePath = Array.isArray(resource)
      ? resource.join('/')
      : resource;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${resourcePath}/?${searchParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies}`,
          'Content-type': 'application/json',
        },
      },
    );

    // Check if the response is not ok (e.g., 404, 500)
    if (!response.ok) {
      if (response.status !== 401) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }

    // Parse the JSON response
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch data. Please try again later.',
    };
  }
};
