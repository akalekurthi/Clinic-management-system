import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Upload, X } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [labTestId, setLabTestId] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; testId: string }) => {
      const formData = new FormData();
      formData.append('report', data.file);
      
      const response = await fetch(`/api/lab-tests/${data.testId}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload report");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-tests"] });
      toast({
        title: "Success",
        description: "Lab report uploaded successfully!",
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setSelectedFile(null);
    setLabTestId("");
    setIsDragOver(false);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, JPG, and PNG files are allowed.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !labTestId) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter the lab test ID.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file: selectedFile, testId: labTestId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Lab Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="testId">Lab Test ID</Label>
            <Input
              id="testId"
              value={labTestId}
              onChange={(e) => setLabTestId(e.target.value)}
              placeholder="Enter the lab test ID"
              required
            />
          </div>

          <div>
            <Label>Report File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-300 hover:border-primary'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-green-600" />
                    <X 
                      className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700" 
                      onClick={() => setSelectedFile(null)}
                    />
                  </div>
                  <p className="text-green-600 font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-slate-500">Drop files here or click to upload</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={uploadMutation.isPending || !selectedFile || !labTestId}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Report"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
