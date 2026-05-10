import { safeLocalStorageGet, safeLocalStorageRemove, safeLocalStorageSet } from "./safeStorage";

/** @deprecated 旧版单张存储，读取后会迁移 */
export const MIRROR_PHOTO_STORAGE_KEY = "gamefit-mirror-photo";

const SNAPSHOTS_KEY = "gamefit-body-photo-snapshots";

/** 防止撑爆 localStorage */
export const MAX_BODY_PHOTO_SNAPSHOTS = 14;

export type BodyPhotoSnapshot = {
  id: string;
  dataUrl: string;
  /** ISO 8601 */
  createdAt: string;
};

function parseSnapshots(raw: string | null): BodyPhotoSnapshot[] | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (!Array.isArray(o)) return null;
    const out: BodyPhotoSnapshot[] = [];
    for (const row of o) {
      if (
        row &&
        typeof row === "object" &&
        typeof (row as BodyPhotoSnapshot).id === "string" &&
        typeof (row as BodyPhotoSnapshot).dataUrl === "string" &&
        typeof (row as BodyPhotoSnapshot).createdAt === "string" &&
        (row as BodyPhotoSnapshot).dataUrl.startsWith("data:image")
      ) {
        out.push(row as BodyPhotoSnapshot);
      }
    }
    return out.length ? out : [];
  } catch {
    return null;
  }
}

function migrateLegacySinglePhoto(): BodyPhotoSnapshot[] {
  const legacy = safeLocalStorageGet(MIRROR_PHOTO_STORAGE_KEY);
  if (!legacy?.startsWith("data:image")) return [];
  const snap: BodyPhotoSnapshot = {
    id: `legacy-${Date.now()}`,
    dataUrl: legacy,
    createdAt: new Date().toISOString(),
  };
  safeLocalStorageRemove(MIRROR_PHOTO_STORAGE_KEY);
  return [snap];
}

function persistSnapshots(snaps: BodyPhotoSnapshot[]): boolean {
  try {
    return safeLocalStorageSet(SNAPSHOTS_KEY, JSON.stringify(snaps));
  } catch {
    return false;
  }
}

/** 读取快照列表（按 createdAt 升序：最早 → 最新） */
export function loadBodyPhotoSnapshots(): BodyPhotoSnapshot[] {
  const parsed = parseSnapshots(safeLocalStorageGet(SNAPSHOTS_KEY));
  if (parsed !== null && parsed.length > 0) {
    return [...parsed].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  if (parsed !== null && parsed.length === 0) {
    const migrated = migrateLegacySinglePhoto();
    if (migrated.length > 0) {
      persistSnapshots(migrated);
      return migrated;
    }
    return [];
  }
  const migrated = migrateLegacySinglePhoto();
  if (migrated.length > 0) {
    persistSnapshots(migrated);
    return migrated;
  }
  return [];
}

export function removeBodyPhotoSnapshot(id: string): void {
  const next = loadBodyPhotoSnapshots().filter((s) => s.id !== id);
  persistSnapshots(next);
}

/** 追加一张快照；超出条数先丢最早；仍写不进去则从最早开始删减直至写入成功（失败则不改动原有存储） */
export function appendBodyPhotoSnapshot(dataUrl: string): {
  ok: boolean;
  snapshots: BodyPhotoSnapshot[];
  error?: string;
} {
  const before = loadBodyPhotoSnapshots();

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const nextSnap: BodyPhotoSnapshot = {
    id,
    dataUrl,
    createdAt: new Date().toISOString(),
  };

  let trial = [...before, nextSnap];
  while (trial.length > MAX_BODY_PHOTO_SNAPSHOTS) {
    trial.shift();
  }

  while (!persistSnapshots(trial)) {
    if (trial.length <= 1) {
      return {
        ok: false,
        snapshots: before,
        error: "浏览器存储失败（图片过大或超出配额）",
      };
    }
    trial = trial.slice(1);
  }

  return { ok: true, snapshots: trial };
}

/** 清空全部体态快照 */
export function clearAllBodyPhotoSnapshots(): void {
  safeLocalStorageRemove(SNAPSHOTS_KEY);
  safeLocalStorageRemove(MIRROR_PHOTO_STORAGE_KEY);
}

/** 展示用时间戳（本地时区） */
export function formatSnapshotDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}
