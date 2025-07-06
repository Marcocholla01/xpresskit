import { ERROR_CODES } from '@/config/constants';

export const handleMailError = (err: any) => {
  if (['getaddrinfo', 'connect'].includes(err.syscall)) {
    return {
      statusCode: 503,
      errorCode: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      message: 'Mailing service is currently unavailable. Try again later.',
    };
  }

  return null;
};
