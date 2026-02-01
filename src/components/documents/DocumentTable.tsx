import { Download, Trash2, FileText } from "lucide-react";
import type { Document } from "../../types/documents";
import { StatusBadge } from "./StatusBadge";

type Props = {
  documents: Document[];
};

export const DocumentTable = ({ documents }: Props) => {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Size</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Uploaded By</th>
            <th className="px-6 py-3">Upload Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Name */}
              <td className="px-6 py-4 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="font-medium">{doc.name}</span>
              </td>

              {/* Type */}
              <td className="px-6 py-4 text-gray-600">{doc.type}</td>

              {/* Size */}
              <td className="px-6 py-4 text-gray-600">{doc.size}</td>

              {/* Status */}
              <td className="px-6 py-4">
                <StatusBadge status={doc.status} />
              </td>

              {/* Uploaded By */}
              <td className="px-6 py-4">{doc.uploadedBy}</td>

              {/* Upload Date */}
              <td className="px-6 py-4 text-gray-600">
                {doc.uploadDate}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right space-x-3">
                <button className="text-gray-600 hover:text-black">
                  <Download size={16} />
                </button>
                <button className="text-red-500 hover:text-red-700">
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
