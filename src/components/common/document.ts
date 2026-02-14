export const DOCUMENT_STATUSES = [
  "UPLOADED",
  "PROCESSING",
  "READY",
  "COMPLETED",
  "FAILED"
] as const;

export type Status = typeof DOCUMENT_STATUSES[number];
