import type { OccupationListItem } from '@/lib/types/occupation-list';

type Scope = {
  country: string;
  state?: string;
  location?: string;
  searchQuery?: string;
  letterFilter?: string;
  limit: number;
};

type FetchPageResult<T> = {
  items: T[];
  nextCursor?: string;
};

type FetchPageFn<T> = (cursor?: string) => Promise<FetchPageResult<T>>;

const cursorRegistry = new Map<string, string>();

function normalisePart(value?: string) {
  return value ? value.toLowerCase().trim() : '';
}

function makeKey(scope: Scope, page: number) {
  return [
    normalisePart(scope.country),
    normalisePart(scope.state),
    normalisePart(scope.location),
    normalisePart(scope.searchQuery),
    normalisePart(scope.letterFilter),
    scope.limit,
    page,
  ].join('|');
}

export interface ResolvedCursor {
  cursor?: string;
  available: boolean;
}

export async function resolveCursorForPage<T = OccupationListItem>(
  scope: Scope,
  page: number,
  fetchPage: FetchPageFn<T>
): Promise<ResolvedCursor> {
  if (page <= 1) {
    return { cursor: undefined, available: true };
  }

  let cursor: string | undefined;

  for (let current = 1; current < page; current++) {
    const key = makeKey(scope, current + 1);
    const cached = cursorRegistry.get(key);
    if (cached) {
      cursor = cached;
      continue;
    }

    const result = await fetchPage(cursor);
    if (!result.nextCursor) {
      return { cursor: undefined, available: false };
    }

    cursor = result.nextCursor;
    cursorRegistry.set(key, cursor);
  }

  return { cursor, available: cursor !== undefined };
}

export function rememberNextCursor(scope: Scope, page: number, nextCursor?: string) {
  const key = makeKey(scope, page + 1);
  if (nextCursor) {
    cursorRegistry.set(key, nextCursor);
  } else {
    cursorRegistry.delete(key);
  }
}

export function clearCursorCache(scope?: Partial<Scope>) {
  if (!scope) {
    cursorRegistry.clear();
    return;
  }

  for (const key of cursorRegistry.keys()) {
    const [country, state, location, searchQuery, letterFilter, limit] = key.split('|');
    if (
      (scope.country && normalisePart(scope.country) !== country) ||
      (scope.state && normalisePart(scope.state) !== state) ||
      (scope.location && normalisePart(scope.location) !== location) ||
      (scope.searchQuery && normalisePart(scope.searchQuery) !== searchQuery) ||
      (scope.letterFilter && normalisePart(scope.letterFilter) !== letterFilter) ||
      (scope.limit && `${scope.limit}` !== limit)
    ) {
      continue;
    }

    cursorRegistry.delete(key);
  }
}

