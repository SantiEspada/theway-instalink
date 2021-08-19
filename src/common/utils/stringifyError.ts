export function stringifyError(error: unknown): string {
  const stringifiedError = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error)
  );

  return stringifiedError;
}
