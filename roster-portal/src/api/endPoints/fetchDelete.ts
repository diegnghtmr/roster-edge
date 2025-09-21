interface IParamsType {
  id: string | number,
  resource: string[] | undefined
}

export const fetchDelete = async ({ id, resource }: IParamsType) => {
  const cookies = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/${resource?.join('')}/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cookies}`,
        'Content-type': 'application/json',
      },
    }
  );

  if(response.status === 204)
    return { data: {}, status: response.status };

  const data = await response.json() || true;
  return { data, status: response.status };
};
