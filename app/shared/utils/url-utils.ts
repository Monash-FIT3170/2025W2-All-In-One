
export function addQueryParamsToUrl(
  baseUrl: string, 
  params: Record<string, string | number | boolean>
): string {
  const urlObj = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, String(value));
  });

  return urlObj.toString();
}
