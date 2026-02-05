import type { Status } from "../components/common/document";
import type { DocumentDto } from "../types/documents";

export type UploadResponse = {
	documentId: string;
	status: string;
	message?: string;
};

export type UploadOptions = {
	title?: string;
	description?: string;
	idempotencyKey?: string;
	token?: string;
};

/**
 * Upload a single document file to the backend.
 * Sends `file`, optional `title` and `description` as multipart form-data.
 * Adds optional `Idempotency-Key` and `Authorization: Bearer ...` headers when provided.
 */
export async function uploadDocument(
	file: File,
	opts: UploadOptions = {}
): Promise<UploadResponse> {
	const { title, description, idempotencyKey, token } = opts;

	const form = new FormData();
	form.append("file", file);
	if (title) form.append("title", title);
	if (description) form.append("description", description);

	const headers: Record<string, string> = {};
	if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch("http://localhost:8080/documents/upload", {
		method: "POST",
		body: form,
		headers,
		credentials: "include",
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Upload failed");
	}

	return res.json();
}




export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export async function getDocuments(
  token: string
): Promise<PageResponse<DocumentDto>> {
  const response = await fetch("http://localhost:8080/documents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.status}`);
  }

  return response.json();
}