import React, { useRef, useState } from "react";
import { DocumentTable } from "../components/documents/DocumentTable";
import type { Document } from "../types/documents";
import { uploadDocument } from "../api/documents.api";
import { useAuth } from "../hooks/useAuth";

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Annual Report 2023.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "COMPLETED",
    uploadedBy: "John Doe",
    uploadDate: "1/15/2024",
  },
  {
    id: "2",
    name: "Project Proposal.docx",
    type: "Word",
    size: "1.8 MB",
    status: "COMPLETED",
    uploadedBy: "Jane Smith",
    uploadDate: "1/20/2024",
  },
  {
    id: "3",
    name: "Budget_Q1.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "PROCESSING",
    uploadedBy: "Mike Johnson",
    uploadDate: "1/22/2024",
  },
  {
    id: "4",
    name: "Presentation_Final.pptx",
    type: "PowerPoint",
    size: "5.2 MB",
    status: "PENDING",
    uploadedBy: "Sarah Wilson",
    uploadDate: "1/25/2024",
  },
];

export const Documents = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token, login, logout } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  const onUploadClick = () => fileRef.current?.click();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prompt for title/description quickly — replace with proper UI later
    const title = window.prompt("Title", file.name) || file.name;
    const description = window.prompt("Description", "") || "";

    setUploading(true);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : `key-${Date.now()}`;

      // ensure token exists or prompt to get one
      let t = token;
      if (!t) {
        const userId = window.prompt("UserId for token (e.g. Priyanshu)", "");
        if (userId) {
          t = await login(userId);
        }
      }

      const resp = await uploadDocument(file, {
        title,
        description,
        idempotencyKey,
        token: t || undefined,
      });

      const newDoc: Document = {
        id: resp.documentId,
        name: file.name,
        type: file.name.split(".").pop() || "File",
        size: formatBytes(file.size),
        status: resp.status === "UPLOADED" ? "COMPLETED" : (resp.status as any),
        uploadedBy: "You",
        uploadDate: new Date().toLocaleDateString(),
      };

      setDocuments((d) => [newDoc, ...d]);
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
          className="bg-black text-white px-4 py-2 rounded-lg"
          onClick={onUploadClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      <DocumentTable documents={documents} />
    </>
  );
};
