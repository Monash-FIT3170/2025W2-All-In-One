
export class InvalidDataError extends Error {
  static name = "InvalidDataError";

  constructor(message: string) {
    super(message);
  }
}