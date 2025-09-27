interface IProps {
  data: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resource?: string[]
    [key: string]: string | Blob
  };
  resource: string[]
  params?: string | undefined;
  method?: string
  isFormData?: boolean
}

const fetchMutation = async ({ data, resource, params, method = "POST", isFormData = false }: IProps) => {

  if(data?.resource) {
    resource = data.resource;
    delete data.resource;
  }
  const cookies = localStorage.getItem('token');
  let body: string | FormData;

  // In case the mutation contains fails so, it will add the form data
  if(isFormData) {
    // Define a new instance of FormData
    body = new FormData();

    // loop through the object keys to be added to the form data
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (body instanceof FormData) {
          // Convert complex values like arrays or objects to JSON strings
          if (typeof value === 'object' && value !== null && !('lastModified' in value)) {
            body.append(key, JSON.stringify(value));
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            body.append(key, value);
          }
        }
      });
    }
  }
  else {
    body = JSON.stringify(data) // In case the mutation doesn't contain files
  }

  const headers: { [key: string]: string } = {
    'Authorization': `Bearer ${cookies}`,
  };

// Only set Content-Type if it's not FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/${resource?.join('')}/${params}`,
    {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: headers,
      body: body,
      redirect: 'follow',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },
  ).then((fetchResponse) => fetchResponse.json());
};

export default fetchMutation;
