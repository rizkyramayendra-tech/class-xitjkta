import { describe, expect, test } from "bun:test";
import { isPublishedAsset, parseStorageRef, type PublishedAssetReader } from "./storage-access";

const reader = (published: Record<string, string[]> = {}, documents: unknown[] = []): PublishedAssetReader => ({
  hasPublishedReference: async (table, _column, ref) => (published[table] ?? []).includes(ref),
  siteDocuments: async () => documents,
});

describe("Published visitor asset authorization", () => {
  test("published learning materials remain accessible to visitors", async () => {
    expect(await isPublishedAsset("files/materi/public.pdf", reader({ resources: ["files/materi/public.pdf"] }))).toBe(true);
  });
  test("unpublished or unreferenced materials cannot receive a public link", async () => {
    expect(await isPublishedAsset("files/materi/draft.pdf", reader({ resources: ["files/materi/public.pdf"] }))).toBe(false);
  });
  test("published photos and site identity images remain accessible", async () => {
    expect(await isPublishedAsset("media/galeri/public.jpg", reader({ gallery: ["media/galeri/public.jpg"] }))).toBe(true);
    expect(await isPublishedAsset("media/logo/class.png", reader({}, [{ logo_url: "media/logo/class.png" }]))).toBe(true);
  });
  test("private photos and near-match names cannot receive a public link", async () => {
    expect(await isPublishedAsset("media/galeri/private.jpg", reader({ gallery: ["media/galeri/public.jpg"] }))).toBe(false);
    expect(await isPublishedAsset("media/logo/class.png.extra", reader({}, [{ logo_url: "media/logo/class.png" }]))).toBe(false);
  });
  test("path traversal and unknown buckets are rejected", () => {
    for (const ref of ["media/../private.jpg", "files/%2e%2e/private.pdf", "other/public.pdf", "media//photo.jpg"]) {
      expect(parseStorageRef(ref)).toBeNull();
    }
  });
  test("a failed publication check does not authorize signing", async () => {
    await expect(isPublishedAsset("files/private.pdf", {
      ...reader(), hasPublishedReference: async () => { throw new Error("Unavailable"); },
    })).rejects.toThrow("Unavailable");
  });
});