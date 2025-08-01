import { useState, useRef } from "react";
import { FaFileUpload } from "react-icons/fa";

function UploadBox({ onFileSelect }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (fileOrEvent) => {
    const file = fileOrEvent.target?.files?.[0] || fileOrEvent;
    if (file) {
      onFileSelect(file);
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center border-2 border-dashed ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } p-6 rounded-lg bg-white shadow w-full max-w-lg`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="fileInput"
        className="flex flex-col items-center gap-3 cursor-pointer"
      >
        <FaFileUpload className="text-4xl text-blue-600" />
        <span className="text-gray-700 font-semibold text-center">
          Click or Drag & Drop to Upload Invoice
        </span>
        <input
          type="file"
          accept=".jpg,.png,.pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="fileInput"
        />
      </label>

      {fileName && (
        <p className="mt-4 text-sm text-gray-600 truncate w-full text-center">
          Selected File: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 object-contain rounded border"
          />
        </div>
      )}

      <p className="text-gray-500 text-xs mt-4">
        Supported: JPG, PNG, PDF (max 10MB)
      </p>
    </div>
  );
}

export default UploadBox;
