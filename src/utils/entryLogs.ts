export interface LocalEntryLog {
  time: string;
  status: string;
}

const ENTRY_LOGS_KEY = 'entryLogs';
const LEGACY_ENTRIES_KEY = 'entries';

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeLog = (log: any): LocalEntryLog | null => {
  if (!log || typeof log !== 'object') return null;

  const status = typeof log.status === 'string' ? log.status : null;
  const time =
    typeof log.time === 'string'
      ? log.time
      : typeof log.timestamp === 'string'
        ? log.timestamp
        : null;

  if (!status || !time) return null;

  return { status, time };
};

export const getLocalEntryLogs = (): LocalEntryLog[] => {
  const rawLogs = localStorage.getItem(ENTRY_LOGS_KEY);
  if (rawLogs !== null) {
    const logs = safeJsonParse<unknown>(rawLogs, []);
    if (Array.isArray(logs)) {
      return logs.map(normalizeLog).filter((v): v is LocalEntryLog => Boolean(v));
    }

    return [];
  }

  const legacy = safeJsonParse<unknown>(localStorage.getItem(LEGACY_ENTRIES_KEY), []);
  if (!Array.isArray(legacy)) return [];

  const migrated = legacy
    .map(normalizeLog)
    .filter((v): v is LocalEntryLog => Boolean(v));

  if (migrated.length > 0) {
    localStorage.setItem(ENTRY_LOGS_KEY, JSON.stringify(migrated));
  }

  return migrated;
};

export const addLocalEntryLog = (status: string, time: Date = new Date()) => {
  const logs = getLocalEntryLogs();
  logs.push({ status, time: time.toISOString() });
  localStorage.setItem(ENTRY_LOGS_KEY, JSON.stringify(logs));
};
