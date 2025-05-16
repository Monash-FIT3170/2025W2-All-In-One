import { InvalidDataError } from "/app/server/errors/InvalidDataError";

export function meteorWrappedInvalidDataError(error: InvalidDataError): Meteor.Error {
  return new Meteor.Error(
    InvalidDataError.name,
    error.message
  );
}