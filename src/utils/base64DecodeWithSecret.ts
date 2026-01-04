export function base64DecodeWithSecret(
  encodedData: string,
  secretKey: string
): any {
  const decodedData = atob(encodedData);
  const originalData = decodedData.slice(0, -secretKey.length);
  return JSON.parse(originalData);
}
