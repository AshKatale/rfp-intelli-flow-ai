import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadIcon, X, CheckCircle, FileUp, FilePlus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and is being processed.`,
      });
      
      setTimeout(() => {
        // In a real app, we would redirect to results page
        // history.push('/dashboard');
      }, 2000);
    }, 2000);
  };
  
  const resetUpload = () => {
    setFileName("");
    setUploadComplete(false);
  };
  
  const recentRfps = [
    {
      id: 1,
      name: "Federal IT Services RFP.pdf",
      date: "2023-04-01",
      status: "Analyzed",
    },
    {
      id: 2,
      name: "State Healthcare Contract.docx",
      date: "2023-03-25",
      status: "Analyzed",
    },
    {
      id: 3,
      name: "Local Government Services.pdf",
      date: "2023-03-15",
      status: "In Progress",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 lg:ml-64">
        <DashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Upload RFP</h1>
            <p className="text-muted-foreground">Upload your RFP document for automated analysis</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>
                    Upload your RFP in PDF, DOC, DOCX, or TXT format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!fileName ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragging ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center">
                        <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
                        <p className="text-muted-foreground mb-6">or click to browse your files</p>
                        
                        <input 
                          type="file" 
                          id="file-upload" 
                          accept=".pdf,.doc,.docx,.txt" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload">
                          <Button className="cursor-pointer">
                            Browse Files
                          </Button>
                        </label>
                        
                        <div className="text-xs text-muted-foreground mt-4">
                          Supported formats: PDF, DOC, DOCX, TXT
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted/50 p-2 rounded">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{fileName}</div>
                            <div className="text-sm text-muted-foreground">
                              Uploaded {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={resetUpload}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {uploading ? (
                        <div className="mb-4">
                          <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm font-medium">Uploading...</span>
                            <span className="text-sm text-muted-foreground">50%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      ) : uploadComplete ? (
                        <div className="bg-green-50 border border-green-100 text-green-800 rounded-md p-4 flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="font-medium">Upload Complete</h4>
                            <p className="text-sm text-green-600">
                              Your document is being analyzed. This may take a few minutes.
                            </p>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                        <Button variant="outline" onClick={resetUpload}>
                          Cancel
                        </Button>
                        <Link to="/dashboard">
                          <Button>
                            Continue to Analysis
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent RFPs</CardTitle>
                  <CardDescription>
                    Previously uploaded and analyzed RFPs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {recentRfps.map((rfp) => (
                      <Link 
                        key={rfp.id} 
                        to="/dashboard" 
                        className="py-3 flex items-center gap-3 hover:bg-muted/30 px-2 rounded-md transition-colors"
                      >
                        <div className="bg-muted/50 p-1 rounded">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {rfp.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            {rfp.date}
                          </div>
                        </div>
                        <Badge 
                          className={`${
                            rfp.status === "Analyzed" ? "bg-green-500" : "bg-yellow-500"
                          } text-[10px] px-2`}
                        >
                          {rfp.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      <FilePlus className="h-4 w-4 mr-2" />
                      View All RFPs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadComponent;
