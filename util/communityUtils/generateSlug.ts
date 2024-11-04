/**
 * Converts a string to a URL-friendly slug.
 * - Lowercases all letters
 * - Removes special characters
 * - Replaces spaces with dashes
 * 
 * @param {string} text - The text to convert to a slug.
 * @returns {string} - The URL-friendly slug.
 */
export function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
      .trim()                         // Remove leading/trailing whitespace
      .replace(/\s+/g, '-');          // Replace spaces with dashes
  }
  