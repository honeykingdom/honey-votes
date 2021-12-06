const getErrorMessageKey = (error: any | unknown): string =>
  error?.data?.message || '';

export default getErrorMessageKey;
