export function base64DecodeWithSecret(encodedData, secretKey) {
  const decodedData = atob(encodedData);
  const originalData = decodedData.slice(0, -secretKey.length);
  return JSON.parse(originalData);
}
