// File Attachment Service
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useFileAttachment = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const { toast } = useToast();

  const resetAttachment = () => {
    setFile(null);
    setFileName("");
    setFileSize(0);
    setFileType("");
    setUploading(false);
    setUploadComplete(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      attachFile(files[0]);
    }
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      attachFile(files[0]);
    }
  };

  const attachFile = (file) => {
    // Validate file type if needed
    const acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      setUploadError(`File type ${fileExtension} is not supported. Please upload PDF, DOC, DOCX, or TXT.`);
      toast({
        title: "Invalid file type",
        description: `Only PDF, DOC, DOCX, and TXT files are supported.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadError(`File is too large. Maximum size is 10MB.`);
      toast({
        title: "File too large",
        description: `Maximum file size is 10MB.`,
        variant: "destructive",
      });
      return;
    }
    
    // Set file information
    setFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);
    setUploadError(null);
    
    // Simulate upload (in a real app, you would upload to server here)
    uploadFile(file);
  };
  
  const uploadFile = (file) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload with progress
    const totalTime = 2000; // 2 seconds for simulation
    const interval = 100; // Update every 100ms
    const steps = totalTime / interval;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.round((currentStep / steps) * 100);
      setUploadProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadComplete(true);
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is being processed.`,
        });
      }
    }, interval);
    
    // In a real application, you would use the Fetch API or axios to upload the file
    // Example with FormData:
    /*
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      },
    })
      .then(response => response.json())
      .then(data => {
        setUploading(false);
        setUploadComplete(true);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is being processed.`,
        });
      })
      .catch(error => {
        setUploading(false);
        setUploadError(error.message);
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      });
    */
  };

  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    file,
    fileName,
    fileSize,
    fileType,
    dragging,
    uploading,
    uploadComplete,
    uploadProgress,
    uploadError,
    formatFileSize,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    attachFile,
    resetAttachment
  };
};