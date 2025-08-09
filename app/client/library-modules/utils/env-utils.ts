
function getEnv(identifier: string): string {
  return Meteor.settings.public[identifier] ?? ""
}

export function getEnvOrWarn(identifier: string): string {
  const envValue = getEnv(identifier)

  if (!envValue) {
    console.warn('Warning: Environment variable (%s) is not defined.', identifier)
  }

  return envValue ?? ""
}
