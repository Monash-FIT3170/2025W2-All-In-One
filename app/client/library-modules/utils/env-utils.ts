
export function getEnvOrWarn(identifier: string): string {
  const envValue = process.env[identifier]

  if (!envValue) {
    console.log('Warning: Environment variable ([%s]) is not defined.', identifier)
  }

  return envValue ?? ""
}
