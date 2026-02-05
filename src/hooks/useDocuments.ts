import { useEffect, useState } from "react";
import { getDocuments } from "../api/documents.api";
import type { DocumentDto } from "../types/documents";
import { useAuth } from "../components/common/AuthContext";
import type { PageResponse } from "../types/PageResponse";

export function useDocuments(refreshKey: number) {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchDocuments() {
      if (!token) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const page: PageResponse<DocumentDto> = await getDocuments(token);

        if (mounted) {
          setDocuments(page.content); // ✅ THIS is the fix
        }
      } catch {
        if (mounted) setError("Failed to load documents");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDocuments();

    return () => {
      mounted = false;
    };
  }, [token, refreshKey]);

  return { documents, loading, error };
}
