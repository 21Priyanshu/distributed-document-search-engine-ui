import type { DocumentDto, DocumentStatus } from "../types/documents";

type SearchResultItem = {
  id?: string;
  documentId?: string;
  title: string;
  description: string;
  createdAt: string;
  status?: DocumentStatus;
};

type SearchResponse = {
  total: number;
  results: SearchResultItem[];
};

function normalizeSearchResult(item: SearchResultItem): DocumentDto {
  return {
    id: item.id ?? item.documentId ?? "",
    title: item.title,
    description: item.description,
    createdAt: item.createdAt,
    status: item.status ?? "UPLOADED",
  };
}

export async function searchDocuments(
  query: string,
  token: string
): Promise<DocumentDto[]> {
  const url = new URL("http://localhost:8080/search");
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to search documents: ${response.status}`);
  }

  const payload = (await response.json()) as SearchResponse;
  return payload.results.map(normalizeSearchResult).filter((doc) => Boolean(doc.id));
}
