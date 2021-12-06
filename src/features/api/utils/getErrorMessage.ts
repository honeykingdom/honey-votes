import { API_ERRORS } from '../apiConstants';

/** @deprecated */
const getErrorMessage = (error: any | unknown): string =>
  API_ERRORS[error?.data?.message || ''] || '';

export default getErrorMessage;
