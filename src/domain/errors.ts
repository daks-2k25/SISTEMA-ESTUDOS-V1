export class NotFoundError extends Error {
  constructor(resource: string) {
    super(resource + " não encontrado");
    this.name = "NotFoundError";
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}
