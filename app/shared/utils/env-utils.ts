
function getPublicEnv(identifier: string): string {
  return Meteor.settings.public[identifier] ?? ""
}

export function getPublicEnvOrWarn(identifier: string): string {
  const envValue = getPublicEnv(identifier)

  if (!envValue) {
    console.warn('Warning: Environment variable (%s) is not defined.', identifier)
  }

  return envValue ?? ""
}
