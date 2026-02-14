import { useEffect, useState } from "react";
import { DocumentTable } from "../components/documents/DocumentTable";
import { uploadDocument } from "../api/documents.api";
import { useAuth } from "../components/common/AuthContext";
import { UploadFormModal } from "../components/documents/UploadFormModal";

export const Documents = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { token } = useAuth();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleUpload = async (files: FileList, description: string) => {
    if (!token) {
      throw new Error("You must be logged in to upload documents");
    }

    setUploading(true);

    try {
      const docs = Array.from(files);
      const normalizedDescription = description.trim() || "Uploaded file";

      const results = await Promise.allSettled(
        docs.map(async (file) => {
          const idempotencyKey =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `key-${Date.now()}-${file.name}`;

          return uploadDocument(file, {
            title: file.name,
            description: normalizedDescription,
            idempotencyKey,
            token,
          });
        })
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        const firstError = failed[0] as PromiseRejectedResult;
        throw new Error(
          `${failed.length} of ${docs.length} uploads failed. ${(firstError.reason as Error)?.message ?? ""}`.trim()
        );
      }

      // trigger refetch
      setRefreshKey((k) => k + 1);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <UploadFormModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        isUploading={uploading}
      />

      <div className="flex items-center mb-6">
        <input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 mr-4 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
          onClick={() => setUploadModalOpen(true)}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {/*PASS IT HERE */}
      <DocumentTable
        refreshKey={refreshKey}
        searchQuery={debouncedSearchQuery}
        onDeleted={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
};
