
import React, { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (image: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
    }
  }, [onImageSelected, toast]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`p-8 relative transition-all duration-300 ease-in-out
      ${dragActive ? 'border-sage-500 bg-sage-50' : 'border-dashed border-2 hover:border-sage-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        {dragActive ? (
          <Upload className="w-12 h-12 text-sage-500 animate-bounce" />
        ) : (
          <ImagePlus className="w-12 h-12 text-sage-400" />
        )}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your image here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to select a file
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={handleButtonClick}
        >
          Select Image
        </Button>
      </div>
    </Card>
  );
};

export default ImageUpload;
