export type ApiResponse<T> =
  | {
      data: T;
      error: null;
      message: string | null;
    }
  | {
      data: null;
      error: string;
      message: string | null;
    };

export type PaginatedData<T> = {
  items: T[];
  meta: {
    total: number;
    nextPage: number | null;
    previousPage: number | null;
    pageCount: number;
  };
  summary?: Record<string, number>;
};
