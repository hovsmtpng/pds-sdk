export function base64DecodeWithSecret<T = unknown>(
  encodedData: string,
  secretKey: string
): T {
  const decodedData = atob(encodedData);
  const originalData = decodedData.slice(0, -secretKey.length);
  return JSON.parse(originalData) as T;
}
