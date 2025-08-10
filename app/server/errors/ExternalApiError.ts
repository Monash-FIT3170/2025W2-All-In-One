export class ExternalApiError extends Error {
  static name = "ExternalApiError";

  constructor(message: string) {
    super(message);
  }
}