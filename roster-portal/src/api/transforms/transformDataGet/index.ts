/* eslint-disable @typescript-eslint/no-explicit-any */

const dataTransform = (data: any, keyResults: string) => {
  return {
    metaData: {
      records_count: data.records_count,
      limit: data.limit,
      next_page: data.next_page,
      previous_page: data.previous_page,
    },
    results: keyResults ? data[keyResults] : data,
  };
};

export default dataTransform;
