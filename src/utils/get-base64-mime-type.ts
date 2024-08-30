export function getBase64MimeType(base64String: string): string | null {
  const match = base64String.match(/^data:(.*);base64,/)
  return match ? match[1] : null
}
