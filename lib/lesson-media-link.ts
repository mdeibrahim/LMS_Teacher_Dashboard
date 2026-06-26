export const LINK_ATTR = "data-content-id" as const;
export const LEGACY_LINK_ATTR = "data-media-id" as const;
const LINK_SELECTOR = `[${LINK_ATTR}], [${LEGACY_LINK_ATTR}]`;

type LinkedElementLike = {
  dataset?: {
    contentId?: string;
    mediaId?: string;
  };
  closest?: (selector: string) => LinkedElementLike | null;
  parentElement?: LinkedElementLike | null;
};

type ResourceLike = {
  id?: number | string | null;
  lesson_id?: number | string | null;
  lessonId?: number | string | null;
  resource_id?: number | string | null;
  resourceId?: number | string | null;
  pk?: number | string | null;
  resources?: unknown;
};

export function parsePositiveId(
  value: number | string | null | undefined
) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

export function buildLinkedResourceAttributes(resourceId: number) {
  const parsedId = parsePositiveId(resourceId);
  if (!parsedId) {
    return {};
  }

  return {
    [LINK_ATTR]: String(parsedId),
  };
}

export function getLinkedResourceIdFromTarget(
  target: EventTarget | LinkedElementLike | null
) {
  if (!target || typeof target !== "object") {
    return null;
  }

  const elementLike = target as LinkedElementLike;
  const fallbackElement = elementLike.parentElement ?? null;

  const element =
    typeof elementLike.closest === "function"
      ? elementLike.closest(LINK_SELECTOR)
      : fallbackElement ?? elementLike;

  if (!element || typeof element !== "object") {
    return null;
  }

  const dataset = element.dataset ?? {};
  return (
    parsePositiveId(dataset.contentId) ??
    parsePositiveId(dataset.mediaId)
  );
}

export function findMediaItemByLinkedId<
  T extends { id: number; resourceId?: number | null }
>(mediaItems: T[], linkedId: number | string | null | undefined) {
  const parsedId = parsePositiveId(linkedId);
  if (!parsedId) {
    return null;
  }

  return (
    mediaItems.find(
      (item) =>
        parsePositiveId(item.resourceId) === parsedId ||
        parsePositiveId(item.id) === parsedId
    ) ?? null
  );
}

function unwrapApiPayload(value: unknown): unknown {
  let current = value;
  let guard = 0;

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    guard < 6
  ) {
    const next = (current as Record<string, unknown>).data;
    const result = (current as Record<string, unknown>).result;
    const payload = (current as Record<string, unknown>).payload;
    const candidate = next ?? result ?? payload ?? null;

    if (!candidate || candidate === current) {
      break;
    }

    current = candidate;
    guard += 1;
  }

  return current;
}

function extractNumericId(candidate: unknown) {
  if (!candidate) {
    return null;
  }

  if (typeof candidate === "number" || typeof candidate === "string") {
    return parsePositiveId(candidate);
  }

  if (typeof candidate === "object") {
    const record = candidate as ResourceLike;
    return (
      parsePositiveId(record.id) ??
      parsePositiveId(record.lesson_id) ??
      parsePositiveId(record.lessonId) ??
      parsePositiveId(record.resource_id) ??
      parsePositiveId(record.resourceId) ??
      parsePositiveId(record.pk)
    );
  }

  return null;
}

export function extractLessonSaveArtifacts(responseData: unknown) {
  const root = unwrapApiPayload(responseData);
  const rootRecord =
    root && typeof root === "object" && !Array.isArray(root)
      ? (root as Record<string, unknown>)
      : null;

  const lessonCandidate =
    rootRecord?.lesson && typeof rootRecord.lesson === "object"
      ? (rootRecord.lesson as ResourceLike)
      : null;

  const lessonId =
    extractNumericId(lessonCandidate) ??
    extractNumericId(rootRecord?.lesson_id) ??
    extractNumericId(rootRecord?.lessonId) ??
    extractNumericId(rootRecord?.id);

  const resourceSource = Array.isArray(rootRecord?.resources)
    ? rootRecord.resources
    : lessonCandidate && Array.isArray(lessonCandidate.resources)
      ? lessonCandidate.resources
      : [];

  const resourceIds = resourceSource
    .map((entry) => extractNumericId(entry))
    .filter((value): value is number => value !== null);

  return {
    lessonId,
    resourceIds,
  };
}

export function buildLegacyToContentIdMap(
  mediaItems: Array<{ id: number }>,
  resourceIds: Array<number | null | undefined>
) {
  const map = new Map<number, number>();

  mediaItems.forEach((item, index) => {
    const sourceId = parsePositiveId(item?.id);
    const targetId = parsePositiveId(resourceIds[index]);

    if (sourceId && targetId) {
      map.set(sourceId, targetId);
    }
  });

  return map;
}

export function repairLegacyLinkedMediaHtml(
  html: string,
  legacyToContentIdMap: Map<number, number> | Record<number, number> = new Map()
) {
  if (!html) {
    return html;
  }

  const map =
    legacyToContentIdMap instanceof Map
      ? legacyToContentIdMap
      : new Map(
          Object.entries(legacyToContentIdMap)
            .map(([key, value]) => [
              parsePositiveId(key),
              parsePositiveId(value),
            ])
            .filter(
              (
                entry
              ): entry is [number, number] => entry[0] !== null && entry[1] !== null
            )
        );

  const replaceId = (rawId: string) => {
    const parsedId = parsePositiveId(rawId);
    if (!parsedId) {
      return rawId;
    }

    return String(map.get(parsedId) ?? parsedId);
  };

  const repairedLegacyAttrs = html.replace(
    /\bdata-media-id=(["'])(\d+)\1/gi,
    (match, quote, legacyId) => {
      const parsedLegacyId = parsePositiveId(legacyId);
      const mappedId = parsedLegacyId ? map.get(parsedLegacyId) : null;

      if (!mappedId) {
        return match;
      }

      return `data-content-id=${quote}${mappedId}${quote}`;
    }
  );

  return repairedLegacyAttrs.replace(
    /\bdata-content-id=(["'])(\d+)\1/gi,
    (_match, quote, contentId) => {
      const replacedId = replaceId(contentId);
      return `data-content-id=${quote}${replacedId}${quote}`;
    }
  );
}
