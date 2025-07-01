
import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  className?: string;
}

export default function FileUpload({
  onFileUpload,
  acceptedTypes = "image/*",
  maxFiles = 5,
  maxSizePerFile = 5,
  className = ""
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > maxSizePerFile * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${maxSizePerFile}MB`,
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.match(acceptedTypes.replace('*', '.*'))) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
        return;
      }

      validFiles.push(file);
    });

    // Check total files count
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card 
        className={`relative border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-hednor-gold bg-hednor-gold/5' 
            : 'border-gray-300 hover:border-hednor-gold'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleChange}
            className="hidden"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Support for {acceptedTypes} files up to {maxSizePerFile}MB each
            </p>
            <p className="text-xs text-gray-400">
              Maximum {maxFiles} files allowed
            </p>
          </div>

          <Button 
            type="button"
            onClick={onButtonClick}
            className="mt-4 bg-hednor-gold hover:bg-yellow-500 text-hednor-dark"
          >
            Select Files
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center space-x-3">
                  {isImage(file) ? (
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <File className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
