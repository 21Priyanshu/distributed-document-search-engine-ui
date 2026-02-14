import { Download, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import type { DocumentDto } from "../../types/documents";
import { StatusBadge } from "./StatusBadge";
import { useDocuments } from "../../hooks/useDocuments";
import { deleteDocument } from "../../api/documents.api";
import { useAuth } from "../common/AuthContext";

interface DocumentTableProps {
  refreshKey: number;
  searchQuery: string;
  onDeleted: () => void;
}

export const DocumentTable = ({ refreshKey, searchQuery, onDeleted }: DocumentTableProps) => {
  const { documents: docs, loading, error } = useDocuments(refreshKey, searchQuery);
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (doc: DocumentDto) => {
    if (!doc.id) {
      alert("Document id is missing");
      return;
    }

    if (!token) {
      alert("You must be logged in to delete documents");
      return;
    }

    const confirmed = window.confirm(`Delete "${doc.title}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(doc.id);
      await deleteDocument(doc.id, token);
      onDeleted();
    } catch (err) {
      alert(`Delete failed: ${(err as Error).message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>{error}</p>;

  if (docs.length === 0) {
    return <p>No documents found</p>;
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Uploaded By</th>
            <th className="px-6 py-3">Upload Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {docs.map((doc: DocumentDto) => (
            <tr
              key={doc.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Name */}
              <td className="px-6 py-4 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="font-medium">{doc.title}</span>
              </td>

              {/* Description */}
              <td className="px-6 py-4 text-gray-600">
                {doc.description}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <StatusBadge status={doc.status} />
              </td>

              {/* Uploaded By */}
              <td className="px-6 py-4">YOU</td>

              {/* Upload Date */}
              <td className="px-6 py-4 text-gray-600">
                {doc.createdAt
                  ? new Date(doc.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right space-x-3">
                <button className="text-gray-600 hover:text-black">
                  <Download size={16} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  onClick={() => handleDelete(doc)}
                  disabled={deletingId === doc.id}
                  title={deletingId === doc.id ? "Deleting..." : "Delete"}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
