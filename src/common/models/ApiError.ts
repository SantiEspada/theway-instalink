import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  constructor(
    message,
    public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
  }
}
