import { useEffect, useRef, useState } from "react";
import { getDocumentStatus, getDocuments } from "../api/documents.api";
import type { DocumentDto, DocumentStatus } from "../types/documents";
import { useAuth } from "../components/common/AuthContext";
import type { PageResponse } from "../types/PageResponse";

const POLL_INTERVAL_MS = 3000;
const TERMINAL_STATUSES: DocumentStatus[] = ["READY", "COMPLETED", "FAILED"];

export function useDocuments(refreshKey: number) {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const documentsRef = useRef<DocumentDto[]>([]);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    let mounted = true;

    async function fetchDocuments() {
      if (!token) {
        setDocuments([]);
        documentsRef.current = [];
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const page: PageResponse<DocumentDto> = await getDocuments(token);

        if (mounted) {
          setDocuments(page.content);
          documentsRef.current = page.content;
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

  useEffect(() => {
    if (!token) return;

    let active = true;

    const pollStatuses = async () => {
      const pendingDocuments = documentsRef.current.filter(
        (doc) => Boolean(doc.id) && !TERMINAL_STATUSES.includes(doc.status)
      );

      if (pendingDocuments.length === 0) return;

      try {
        const statusUpdates = await Promise.all(
          pendingDocuments.map(async (doc) => {
            const response = await getDocumentStatus(doc.id, token);
            return { id: doc.id, status: response.status };
          })
        );

        if (!active) return;

        const updatesById = new Map(
          statusUpdates.map((update) => [update.id, update.status])
        );

        setDocuments((prev) => {
          const next = prev.map((doc) => {
            const nextStatus = updatesById.get(doc.id);
            if (!nextStatus || nextStatus === doc.status) return doc;
            return { ...doc, status: nextStatus };
          });
          documentsRef.current = next;
          return next;
        });
      } catch {
        // Keep current UI state on transient polling errors.
      }
    };

    const intervalId = window.setInterval(pollStatuses, POLL_INTERVAL_MS);
    pollStatuses();

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [token]);

  return { documents, loading, error };
}
