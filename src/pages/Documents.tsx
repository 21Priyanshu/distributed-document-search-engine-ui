import { useRef, useState } from "react";
import { DocumentTable } from "../components/documents/DocumentTable";
import { uploadDocument } from "../api/documents.api";
import { useAuth } from "../components/common/AuthContext";

export const Documents = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { token } = useAuth();

  const onUploadClick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!token) {
      alert("You must be logged in to upload documents");
      return;
    }

    setUploading(true);

    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `key-${Date.now()}`;

      await uploadDocument(file, {
        title: file.name,
        description: "Uploaded file",
        idempotencyKey,
        token,
      });

      // ✅ trigger refetch
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        onChange={onFileChange}
        className="hidden"
      />

      <div className="flex items-center mb-6">
        <input
          placeholder="Search documents..."
          className="flex-1 mr-4 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
          onClick={onUploadClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {/* ✅ PASS IT HERE */}
      <DocumentTable refreshKey={refreshKey} />
    </>
  );
};
