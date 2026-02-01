export type DocumentStatus =
  | "COMPLETED"
  | "PROCESSING"
  | "PENDING"
  | "FAILED";

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: DocumentStatus;
  uploadedBy: string;
  uploadDate: string;
};
