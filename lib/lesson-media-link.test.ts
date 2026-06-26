import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  buildLegacyToContentIdMap,
  buildLinkedResourceAttributes,
  extractLessonSaveArtifacts,
  findMediaItemByLinkedId,
  getLinkedResourceIdFromTarget,
  repairLegacyLinkedMediaHtml,
} from "./lesson-media-link";

test("newly saved linked content uses data-content-id", () => {
  const attrs = buildLinkedResourceAttributes(12);

  assert.deepEqual(attrs, {
    "data-content-id": "12",
  });
  assert.equal("data-media-id" in attrs, false);
});

test("linked targets resolve modern and legacy ids", () => {
  const modernTarget = {
    dataset: { contentId: "13" },
  };

  const legacyTarget = {
    dataset: { mediaId: "14" },
  };

  assert.equal(getLinkedResourceIdFromTarget(modernTarget), 13);
  assert.equal(getLinkedResourceIdFromTarget(legacyTarget), 14);
});

test("legacy media ids can be repaired to persisted backend ids", () => {
  const legacyHtml =
    '<p><span data-media-id="1">First</span> <span data-media-id="2">Second</span></p>';
  const map = new Map<number, number>([
    [1, 12],
    [2, 13],
  ]);

  assert.equal(
    repairLegacyLinkedMediaHtml(legacyHtml, map),
    '<p><span data-content-id="12">First</span> <span data-content-id="13">Second</span></p>'
  );
});

test("lesson save responses expose lesson and resource ids", () => {
  const artifacts = extractLessonSaveArtifacts({
    data: {
      lesson: { id: 99 },
      resources: [{ id: 12 }, { id: 13 }],
    },
  });

  assert.deepEqual(artifacts, {
    lessonId: 99,
    resourceIds: [12, 13],
  });
});

test("click resolution prefers persisted resource ids over draft ids", () => {
  const mediaItems = [
    { id: 1, title: "Draft 1", resourceId: 12 },
    { id: 2, title: "Draft 2", resourceId: 13 },
  ];

  assert.equal(findMediaItemByLinkedId(mediaItems, 12)?.title, "Draft 1");
  assert.equal(findMediaItemByLinkedId(mediaItems, 2)?.title, "Draft 2");
  assert.equal(findMediaItemByLinkedId(mediaItems, 999), null);
});

test("legacy ids can be mapped from draft order to persisted ids", () => {
  const map = buildLegacyToContentIdMap(
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    [12, 13, 14]
  );

  assert.equal(map.get(1), 12);
  assert.equal(map.get(2), 13);
  assert.equal(map.get(3), 14);
});
