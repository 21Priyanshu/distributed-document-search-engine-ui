export type DocumentStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface DocumentDto {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  createdAt: string; // ISO timestamp from backend
}
