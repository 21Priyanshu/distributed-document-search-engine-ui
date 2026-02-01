import { DocumentTable } from "../components/documents/DocumentTable";
import type { Document } from "../types/documents";

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
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <input
          placeholder="Search documents..."
          className="w-96 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
        />

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Upload Files
        </button>
      </div>

      <DocumentTable documents={mockDocuments} />
    </>
  );
};
