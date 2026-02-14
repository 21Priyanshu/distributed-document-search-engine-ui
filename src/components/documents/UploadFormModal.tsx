import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

interface UploadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList, description: string) => Promise<void>;
  isUploading?: boolean;
}

export function UploadFormModal({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
}: UploadFormModalProps) {
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setDescription("");
    setSelectedFiles(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      setError(null);
    }
  };

  const handleBrowseClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    if (!selectedFiles || isUploading) return;

    const dt = new DataTransfer();
    Array.from(selectedFiles).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });

    setSelectedFiles(dt.files.length > 0 ? dt.files : null);
  };

  const handleSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || isUploading) return;

    try {
      setError(null);
      await onUpload(selectedFiles, description);
      resetForm();
      onClose();
    } catch (err) {
      setError((err as Error).message || "Upload failed");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[500px] rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-lg font-semibold text-gray-900">
          Upload Documents
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Add files and an optional description for your documents.
        </p>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-800">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Enter a description for these documents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isUploading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Files</label>
            <div
              onClick={handleBrowseClick}
              className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-black hover:bg-slate-50"
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-500" />
              <p className="mb-1 text-sm text-gray-700">
                Click to browse or drag and drop files
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, Word, Excel, PowerPoint and more
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Selected Files ({selectedFiles.length})
              </label>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {Array.from(selectedFiles).map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md bg-slate-50 p-2"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="truncate text-sm">{file.name}</span>
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isUploading}
                      className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {isUploading
                ? "Uploading..."
                : `Upload${selectedFiles && selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
