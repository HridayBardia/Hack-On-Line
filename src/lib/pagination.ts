/**
 * Safe Bounded Pagination Utility
 * Protects database against unbounded table scans (e.g. SELECT * without LIMIT)
 * which can bring down servers during 10,000+ user traffic spikes.
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextCursor?: string | null;
  };
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50; // Hard limit to prevent memory spikes

export function parsePagination(params: URLSearchParams): { limit: number; offset: number; page: number } {
  const rawPage = parseInt(params.get("page") || "1", 10);
  const rawPageSize = parseInt(params.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10);

  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, isNaN(rawPageSize) ? DEFAULT_PAGE_SIZE : rawPageSize));
  const offset = (page - 1) * limit;

  return { limit, offset, page };
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  nextCursor?: string | null
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data: items,
    pagination: {
      page,
      pageSize: limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextCursor: nextCursor || null,
    },
  };
}
