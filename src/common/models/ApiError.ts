export class ApiError extends Error {
  constructor(message, public readonly code: number = 500) {
    super(message);
  }
}
