import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onUpload: (fileUrl: string) => void;
}

export const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative glass-panel rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? "scale-105 border-blue-500/50 bg-blue-500/10" : "hover:border-white/30 hover:bg-white/15"}
          ${preview ? "border-transparent" : "border-2 border-dashed border-gray-600"}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <p className="text-white font-semibold">Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-2">
                Upload your photo
              </p>
              <p className="text-gray-400">
                {isDragActive
                  ? "Drop it like it's hot!"
                  : "Drag & drop or click to browse"}
              </p>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpload(preview);
            }}
            className="btn-primary text-lg px-12 py-4 shadow-blue-500/30"
          >
            ✨ Start Creating
          </button>
        </div>
      )}
    </div>
  );
};
