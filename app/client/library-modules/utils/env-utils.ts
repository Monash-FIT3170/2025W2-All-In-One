
export function getEnv(identifier: string, warnIfUndefined: boolean = false): string {
  const envValue = process.env[identifier]

  if (!envValue && warnIfUndefined) {
    console.log('Warning: Environment variable ([%s]) is not defined.', identifier)
  }

  return process.env[identifier] ?? ""
}
