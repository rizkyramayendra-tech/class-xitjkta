import { useMemo, Fragment } from "react";
import { parseTextWithUrls, isValidHttpUrl } from "@/lib/url-parser";

interface RichTextProps {
  text?: string | null;
  className?: string;
  preserveLineBreaks?: boolean;
}

/**
 * RichText component
 * Renders plain text with auto-detected HTTP/HTTPS URLs as clickable links
 * Preserves whitespace and line breaks
 * Opens external URLs in new tab with security attributes
 *
 * Usage:
 * <RichText text="Visit https://example.com for more info" />
 */
export function RichText({
  text,
  className = "",
  preserveLineBreaks = true,
}: RichTextProps) {
  const segments = useMemo(() => {
    if (!text) return [];
    return parseTextWithUrls(text);
  }, [text]);

  if (!segments.length) {
    return null;
  }

  return (
    <span className={className}>
      {segments.map((segment, idx) => {
        if (segment.type === "url") {
          const url = segment.content;
          if (!isValidHttpUrl(url)) {
            return <Fragment key={idx}>{url}</Fragment>;
          }
          return (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-primary underline hover:text-primary/80 transition-colors"
            >
              {url}
            </a>
          );
        }

        // Handle text segments
        let textContent = segment.content;

        // Preserve line breaks if enabled
        if (preserveLineBreaks) {
          const lines = textContent.split("\n");
          if (lines.length > 1) {
            return (
              <Fragment key={idx}>
                {lines.map((line, lineIdx) => (
                  <Fragment key={lineIdx}>
                    {line}
                    {lineIdx < lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </Fragment>
            );
          }
        }

        return <Fragment key={idx}>{textContent}</Fragment>;
      })}
    </span>
  );
}
