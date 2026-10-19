export const PUBLIC_ASSET_TTL_SECONDS = 3600;

export function parseStorageRef(ref: string) {
  const [bucket, ...parts] = ref.split("/");
  if ((bucket !== "media" && bucket !== "files") || !parts.length) return null;
  if (parts.some((part) => !part || part === "." || part === "..") || /[\\%\x00-\x1f]/.test(ref)) return null;
  return { bucket, path: parts.join("/") };
}

type PublishedTable = "resources" | "students" | "announcements" | "events" | "achievements" | "gallery";
export type PublishedAssetReader = {
  hasPublishedReference: (table: PublishedTable, column: "file_url" | "photo_url" | "image_url", ref: string) => Promise<boolean>;
  siteDocuments: () => Promise<unknown[]>;
};

/** Exact references only; unknown objects and failed reads never authorize signing. */
export async function isPublishedAsset(ref: string, reader: PublishedAssetReader): Promise<boolean> {
  const parsed = parseStorageRef(ref);
  if (!parsed) return false;
  if (parsed.bucket === "files") return reader.hasPublishedReference("resources", "file_url", ref);
  const sources = [
    ["students", "photo_url"], ["announcements", "image_url"], ["events", "image_url"],
    ["achievements", "image_url"], ["gallery", "image_url"],
  ] as const;
  for (const [table, column] of sources) {
    if (await reader.hasPublishedReference(table, column, ref)) return true;
  }
  const documents = await reader.siteDocuments();
  return documents.some((document) => document !== null && typeof document === "object"
    && !Array.isArray(document) && Object.values(document).some((value) => value === ref));
}