/**
 * URL detection and parsing utility
 * Detects valid HTTP/HTTPS URLs in plain text
 * Returns parsed segments: text nodes and URL objects
 */

export interface ParsedSegment {
  type: 'text' | 'url';
  content: string;
}

/**
 * Detects valid HTTP/HTTPS URLs in text
 * Pattern matches:
 * - http:// or https:// protocol
 * - domain name with TLD
 * - optional path, query params, fragments
 * - stops at common punctuation that typically ends a sentence
 */
const URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

/**
 * Parses text and returns segments of plain text and detected URLs
 * Handles multiple URLs in the same text
 * Preserves all text exactly as-is
 */
export function parseTextWithUrls(text: string): ParsedSegment[] {
  if (!text) return [];

  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    // Add the URL
    segments.push({
      type: 'url',
      content: match[0],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last URL
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  // If no URLs were found, return the entire text as a single segment
  if (segments.length === 0) {
    return [{ type: 'text', content: text }];
  }

  return segments;
}

/**
 * Validates a URL is safe to use as href
 * Only allows http:// and https://
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
