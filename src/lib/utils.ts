// src/lib/utils.ts

/**
 * Converts a string into a URL-friendly slug and appends a short unique identifier
 * to prevent collisions between duplicate product names.
 */
export function generateSlug(text: string): string {
  const cleanText = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text

  // Append a random 4-character hex string to isolate URLs safely
  const shortId = Math.random().toString(36).substring(2, 6);
  
  return cleanText ? `${cleanText}-${shortId}` : shortId;
}
