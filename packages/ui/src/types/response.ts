export type responseType = {
  data: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
  loading: boolean;
};
