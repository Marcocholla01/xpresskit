export class appError extends Error {
  public statusCode: number;
  public errorCode?: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Helpful for distinguishing handled vs crash errors

    Error.captureStackTrace(this, this.constructor);
  }
}
