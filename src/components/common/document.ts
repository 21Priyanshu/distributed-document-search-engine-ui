export const DOCUMENT_STATUSES = [
  "UPLOADED",
  "PROCESSING",
  "COMPLETED",
  "FAILED"
] as const;

export type Status = typeof DOCUMENT_STATUSES[number];
