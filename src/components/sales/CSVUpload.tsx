"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useUploadCSV } from "@/lib/mutations/salesMutations";

export default function CSVUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const uploadMutation = useUploadCSV();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Invalid File Type", "Please select a CSV file.");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File Too Large", "File size must be less than 10MB.");
      return;
    }

    uploadFile(file);
  };

  const uploadFile = (file: File) => {
    setIsUploading(true);
    
    uploadMutation.mutate(file, {
      onSuccess: (response) => {
        toast.success("Upload Successful", 
          `Successfully uploaded ${response.recordsProcessed} sales records from ${response.fileName}`
        );
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        toast.error("Upload Failed", errorMessage);
      },
      onSettled: () => {
        setIsUploading(false);
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload Sales Data</h3>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Uploading and processing sales data...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-sm text-gray-600">
                Maximum file size: 10MB. Only CSV files are accepted.
              </p>
            </div>
            
            <Button 
              onClick={handleBrowseClick}
              className="mb-4"
            >
              Browse Files
            </Button>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* CSV Format Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements</h4>
        <p className="text-sm text-gray-600 mb-3">
          Your CSV file should contain the following columns (headers are flexible):
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Transaction Date:</strong> Date of the sale (YYYY-MM-DD format)</li>
          <li>• <strong>Transaction ID:</strong> Unique identifier for the transaction</li>
          <li>• <strong>Item Name:</strong> Name of the sold item</li>
          <li>• <strong>Category:</strong> Product category</li>
          <li>• <strong>Quantity:</strong> Number of items sold</li>
          <li>• <strong>Unit Price:</strong> Price per unit</li>
          <li>• <strong>Total Amount:</strong> Total transaction amount</li>
          <li>• <strong>Payment Method:</strong> Cash, Card, Digital, etc.</li>
          <li>• <strong>Customer Type:</strong> Regular, VIP, etc.</li>
        </ul>
        
        <div className="mt-3 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Column headers are flexible - the system will attempt to map 
            common variations automatically (e.g., &quot;Item&quot;, &quot;Product Name&quot;, &quot;Item Name&quot;).
          </p>
        </div>
      </div>
    </div>
  );
}