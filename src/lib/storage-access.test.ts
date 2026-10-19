import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isPublishedAsset, parseStorageRef, type PublishedAssetReader } from "./storage-access";

const reader = (published: Record<string, string[]> = {}, documents: unknown[] = []): PublishedAssetReader => ({
  hasPublishedReference: async (table, _column, ref) => (published[table] ?? []).includes(ref),
  siteDocuments: async () => documents,
});

describe("Published visitor asset authorization", () => {
  test("published learning materials remain accessible to visitors", async () => {
    assert.equal(await isPublishedAsset("files/materi/public.pdf", reader({ resources: ["files/materi/public.pdf"] })), true);
  });
  test("unpublished or unreferenced materials cannot receive a public link", async () => {
    assert.equal(await isPublishedAsset("files/materi/draft.pdf", reader({ resources: ["files/materi/public.pdf"] })), false);
  });
  test("published photos and site identity images remain accessible", async () => {
    assert.equal(await isPublishedAsset("media/galeri/public.jpg", reader({ gallery: ["media/galeri/public.jpg"] })), true);
    assert.equal(await isPublishedAsset("media/logo/class.png", reader({}, [{ logo_url: "media/logo/class.png" }])), true);
  });
  test("private photos and near-match names cannot receive a public link", async () => {
    assert.equal(await isPublishedAsset("media/galeri/private.jpg", reader({ gallery: ["media/galeri/public.jpg"] })), false);
    assert.equal(await isPublishedAsset("media/logo/class.png.extra", reader({}, [{ logo_url: "media/logo/class.png" }])), false);
  });
  test("path traversal and unknown buckets are rejected", () => {
    for (const ref of ["media/../private.jpg", "files/%2e%2e/private.pdf", "other/public.pdf", "media//photo.jpg"]) {
      assert.equal(parseStorageRef(ref), null);
    }
  });
  test("a failed publication check does not authorize signing", async () => {
    await assert.rejects(isPublishedAsset("files/private.pdf", {
      ...reader(), hasPublishedReference: async () => { throw new Error("Unavailable"); },
    }), /Unavailable/);
  });
});