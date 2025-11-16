"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, MessageSquare, PanelLeft, PanelRight, PlusCircle, Search, UploadCloud, Loader2, File as FileIcon, Folder, AlertTriangle, Send, Trash2, Pencil, Save, User, FolderOpen, ChevronRight, Home, Eye } from "lucide-react";
import { ModelMasterIcon } from "@/components/ui/model-master-icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadFilesToAzureBlob, listBlobs, deleteBlob, renameBlob, getBlobPreview } from "@/app/actions/azureBlobActions";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px" {...props}>
    <path fill="#4285F4" d="M24 9.5c3.13 0 5.9 1.08 7.96 3.04L37 7.46C33.37 4.25 28.93 2.5 24 2.5 15.53 2.5 8.42 7.75 5.75 15.04L11.8 19.3c1.3-3.86 4.86-6.8 9.2-6.8H24V9.5z" />
    <path fill="#34A853" d="M43.25 24c0-1.6-0.15-3.15-0.42-4.65H24v8.8h11.3c-0.48 2.85-1.92 5.25-4.18 6.95v5.3h6.8c3.96-3.65 6.25-9.05 6.25-15.45z" />
    <path fill="#FBBC05" d="M10.83 28.62c-0.43-1.3-0.68-2.7-0.68-4.12s0.25-2.82 0.68-4.12L4.78 15.3C3.18 18.25 2.25 21.5 2.25 25c0 3.5 0.93 6.75 2.53 9.7L10.83 28.62z" />
    <path fill="#EA4335" d="M24 45.5c4.93 0 9.1-1.65 12.15-4.45l-6.8-5.3c-1.63 1.1-3.7 1.75-6.15 1.75-4.34 0-7.9-2.94-9.2-6.8L5.75 34.96C8.42 42.25 15.53 45.5 24 45.5z" />
  </svg>
);

const AzureIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.23 2.062L6.11 14.153l-5.667.63L7.23 22l11.435-4.19-2.482-10.287L13.23 2.062zm-8.72 13.9l3.56-7.59 2.33 9.63-5.89-2.04z" />
  </svg>
);

interface TableData {
  headers: string[];
  rows: Record<string, any>[];
  title?: string;
  assumptions?: string[];
  summary?: string | string[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  tableData?: TableData;
  flowData?: object;
  showAssumptions?: boolean;
}

interface PreviewData {
  headers: string[];
  rows: Record<string, string>[];
}

const TableDisplay: React.FC<{ data: TableData; showAssumptions?: boolean }> = ({ data, showAssumptions }) => (
    <div className="my-2 space-y-4">
      {data.title && <h4 className="font-semibold text-base mb-2">{data.title}</h4>}
      {data.summary && (
        <div className="text-sm space-y-1">
          <p className="font-bold">Summary:</p>
          {Array.isArray(data.summary) ? (
            data.summary.map((s, i) => {
              if (s.toLowerCase().startsWith('relationships:')) {
                return <p key={i}><span className="font-bold">Relationships:</span><br/>{s.substring(14)}</p>
              }
              if (s.toLowerCase().startsWith('assumptions:')) {
                return <p key={i}><span className="font-bold">Assumptions:</span><br/>{s.substring(12)}</p>
              }
              return <p key={i} className="whitespace-pre-wrap">{s}</p>
            })
          ) : (
            <p className="whitespace-pre-wrap">{data.summary}</p>
          )}
        </div>
      )}
      <div className="overflow-auto border rounded-md max-h-96">
        <Table>
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
              {data.headers.map(header => (
                <TableHead key={header} className="font-bold">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {data.headers.map(header => (
                  <TableCell key={`${rowIndex}-${header}`}>
                    {Array.isArray(row[header]) ? (
                      <ul className="list-none space-y-1 p-0">
                        {(row[header] as string[]).map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      String(row[header] ?? '')
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {showAssumptions && data.assumptions && data.assumptions.length > 0 && (
        <div className="text-sm space-y-1">
          <p className="font-bold">Assumptions:</p>
          {data.assumptions.map((a, i) => <p key={i}>{a}</p>)}
        </div>
      )}
    </div>
);


const AZURE_BLOB_ROOT_PREFIX = 'DataQuality/model_automation/';

export default function ModelMasterAiPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [filesToUpload, setFilesToUpload] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [isDataSourceCollapsed, setIsDataSourceCollapsed] = React.useState(false);
  const [savedFiles, setSavedFiles] = React.useState<string[]>([]);

  const [isAzureDialogOpen, setIsAzureDialogOpen] = React.useState(false);
  const [azurePathHistory, setAzurePathHistory] = React.useState<string[]>([AZURE_BLOB_ROOT_PREFIX]);
  const currentAzurePath = azurePathHistory[azurePathHistory.length - 1];

  const [azureBlobs, setAzureBlobs] = React.useState<string[]>([]);
  const [azurePrefixes, setAzurePrefixes] = React.useState<string[]>([]);
  const [isLoadingAzureBlobs, setIsLoadingAzureBlobs] = React.useState(false);
  const [azureBlobsError, setAzureBlobsError] = React.useState<string | null>(null);
  const [selectedBlobs, setSelectedBlobs] = React.useState<Record<string, boolean>>({});

  const [chatInput, setChatInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);

  const [fileToDelete, setFileToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [fileToRename, setFileToRename] = React.useState<string | null>(null);
  const [newFileName, setNewFileName] = React.useState("");
  const [isRenaming, setIsRenaming] = React.useState(false);

  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = React.useState<string | null>(null);

  const chatScrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollToBottom = () => {
      if (chatScrollAreaRef.current) {
        const viewport = chatScrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = { id: `user-${Date.now()}`, text: chatInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    let botMessage: Message = { id: `bot-${Date.now()}`, sender: 'bot' };

    try {
      const response = await fetch('/api/model-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_names: savedFiles, prompt: currentInput }),
      });
      
      console.log("1. Raw response from /api/model-master:", response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("2. Parsed JSON response from API:", responseData);

      let dataToDisplay: any = null;
      let summary: string | string[] | undefined = responseData.summary;
      let assumptions: string[] | undefined = undefined;
      let title: string | undefined = undefined;
      let showAssumptions = false;

      if (responseData.structured_output) {
          console.log("3b. Found structured_output field:", responseData.structured_output);
          dataToDisplay = responseData.structured_output;
           if (dataToDisplay.summary && dataToDisplay.summary.key_insights) {
              summary = dataToDisplay.summary.key_insights;
          } else {
              summary = dataToDisplay.Key_points || dataToDisplay.summary || summary;
          }
          assumptions = dataToDisplay.assumptions;
      } else if (responseData.llm_response) {
          console.log("3a. Found llm_response field.");
          try {
              const llmResponseString = responseData.llm_response.replace(/```json\n?|```/g, '');
              const nestedResponse = JSON.parse(llmResponseString);
              console.log("4a. Parsed nested JSON from llm_response:", nestedResponse);
              dataToDisplay = nestedResponse;
              summary = nestedResponse.Summary || summary;
              assumptions = nestedResponse.Assumptions;
          } catch (e) {
              console.error("Error parsing llm_response JSON, falling back to summary.", e);
              botMessage.text = summary || "Received a response, but could not parse the inner JSON.";
          }
      }

      console.log("5. Data chosen for display processing:", dataToDisplay);

      if (dataToDisplay) {
        if ((dataToDisplay.schema && dataToDisplay.schema.fact_table) || dataToDisplay.fact_table) {
            console.log("6a. Detected ERD schema. Converting to table format.");
            const schema = dataToDisplay.schema || dataToDisplay;
            const factTable = schema.fact_table;
            const dimTables = schema.dimension_tables || [];
            const allTables = [factTable, ...dimTables];

            const tableRows = allTables.map(table => ({
                "Table Name": table.name,
                "Columns": table.columns, 
            }));

            const summaryParts: string[] = [];
            if (summary) {
                summaryParts.push(Array.isArray(summary) ? summary.join(' ') : summary);
            }
            
            const relationshipsText = schema.relationships ? Object.entries(schema.relationships).map(([key, value]) => `${key} → ${value}`).join('\n') : '';
            if (relationshipsText) {
                summaryParts.push('Relationships:', relationshipsText);
            }
            
            const assumptionsText = assumptions ? assumptions.join('\n') : '';
            if (assumptionsText) {
                 summaryParts.push('Assumptions:', assumptionsText);
            }

            botMessage.tableData = {
                title: "Database Schema",
                headers: ["Table Name", "Columns"],
                rows: tableRows,
                summary: summaryParts,
            };

        } else if (dataToDisplay.relationships) {
            console.log("6b. Detected 'relationships' array. Rendering table.");
            title = "Entity Relationships";
            const tableData = Array.isArray(dataToDisplay.relationships) ? dataToDisplay.relationships : [dataToDisplay.relationships];
            const tableResult = { headers: Object.keys(tableData[0] || {}), rows: tableData };
            botMessage.tableData = { ...tableResult, title, summary, assumptions };
            if (currentInput.toLowerCase().includes('analyse the relationship')) {
                showAssumptions = true;
            }
        } else if (dataToDisplay.mapping) {
            console.log("6c. Detected 'mapping' array. Rendering table.");
            title = "Source to Target Mapping";
            const tableData = Array.isArray(dataToDisplay.mapping) ? dataToDisplay.mapping : [dataToDisplay.mapping];
            const tableResult = { headers: Object.keys(tableData[0] || {}), rows: tableData };
            botMessage.tableData = { ...tableResult, title, summary, assumptions };
        } else if (dataToDisplay.table_summaries) {
            console.log("6d. Detected 'table_summaries' object. Rendering as two-column table.");
            title = "Profiling Summary";
            const tableData = Object.entries(dataToDisplay.table_summaries).map(([tableName, summaries]) => ({
                "Table Name": tableName,
                "Column Summaries": Array.isArray(summaries) ? summaries : [summaries],
            }));
            const tableResult = { headers: ["Table Name", "Column Summaries"], rows: tableData };
            botMessage.tableData = { ...tableResult, title, summary, assumptions: undefined };
        } else if (summary) {
           botMessage.text = Array.isArray(summary) ? summary.join('\n') : summary;
        }
      }
      
      console.log("7. Final check before setting bot message:", { botMessage, showAssumptions });

      if (!botMessage.tableData && !botMessage.flowData && !botMessage.text) {
          console.log("8. No specific renderer matched. Falling back to summary text.");
          botMessage.text = summary?.toString() || "Could not render the response. Please check the format.";
      }
      
      if(botMessage.tableData){
        botMessage.showAssumptions = showAssumptions;
      }

      setMessages(prev => [...prev, botMessage]);

    } catch (error: any) {
      console.error("Outer catch block error in handleSendMessage:", error);
      let errorMessage = "An unknown error occurred.";
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.error) {
          errorMessage = parsedError.error;
        }
      } catch (_) {
        if (error.message && !error.message.toLowerCase().includes("<!doctype html>")) {
          errorMessage = error.message;
        } else if (error.message) {
          errorMessage = "The API endpoint was not found or returned an invalid response (e.g., HTML page). Please check the server."
        }
      }
      botMessage.text = `Sorry, I encountered an error: ${errorMessage}`;
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFilesToUpload(Array.from(event.target.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      setFilesToUpload(Array.from(event.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    const uploadedFileNames = filesToUpload.map(file => file.name);
    filesToUpload.forEach(file => {
      formData.append('files', file);
    });

    const result = await uploadFilesToAzureBlob(formData);

    if (result.success) {
      toast({
        title: "Upload Successful",
        description: `${result.fileCount} file(s) have been uploaded successfully.`,
        variant: "job-complete",
      });
      setSavedFiles(prev => [...new Set([...prev, ...uploadedFileNames])]);
      setFilesToUpload([]);
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Upload Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsUploading(false);
  };

  const fetchAzureBlobs = React.useCallback(async (path: string) => {
    setIsLoadingAzureBlobs(true);
    setAzureBlobsError(null);
    try {
      const result = await listBlobs('datagovernance', path);
      if (result.success) {
        setAzureBlobs(result.blobs || []);
        setAzurePrefixes(result.prefixes || []);
      } else {
        throw new Error(result.message || "Failed to list Azure blobs.");
      }
    } catch (e: any) {
      setAzureBlobsError(e.message);
    } finally {
      setIsLoadingAzureBlobs(false);
    }
  }, []);

  const handleOpenAzureDialog = React.useCallback(() => {
    setIsAzureDialogOpen(true);
    fetchAzureBlobs(currentAzurePath);
  }, [currentAzurePath, fetchAzureBlobs]);

  const handleAzureFolderClick = (folderName: string) => {
    const newPath = `${currentAzurePath}${folderName}/`;
    setAzurePathHistory(prev => [...prev, newPath]);
    fetchAzureBlobs(newPath);
  };

  const handleAzureBreadcrumbClick = (pathIndex: number) => {
    const newHistory = azurePathHistory.slice(0, pathIndex + 1);
    setAzurePathHistory(newHistory);
    fetchAzureBlobs(newHistory[newHistory.length - 1]);
  };

  const handleAddAzureBlobs = () => {
    const blobsToAdd = Object.keys(selectedBlobs).filter(blob => selectedBlobs[blob]);
    setSavedFiles(prev => [...new Set([...prev, ...blobsToAdd])]);
    setIsAzureDialogOpen(false);
    setIsDialogOpen(false);
    setSelectedBlobs({});
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    const containerName = "datagovernance";
    let blobName;
    if (fileToDelete.toLowerCase().includes("_profile") || fileToDelete.toLowerCase().includes("profiles")) {
      blobName = `DataQuality/model_automation/Profilling_files/${fileToDelete}`;
    } else {
      blobName = `DataQuality/model_automation/Local_Files/${fileToDelete}`;
    }

    try {
      const result = await deleteBlob(containerName, blobName);
      if (result.success) {
        toast({
          title: "File Deleted",
          description: `"${fileToDelete}" was successfully deleted.`,
          variant: "default",
        });
        setSavedFiles(prev => prev.filter(f => f !== fileToDelete));
      } else {
        throw new Error(result.message);
      }
    } catch (e: any) {
      toast({
        title: "Deletion Failed",
        description: `Could not delete file: ${e.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  const openRenameDialog = (fileName: string) => {
    setFileToRename(fileName);
    setNewFileName(fileName);
  };

  const handleRenameFile = async () => {
    if (!fileToRename || !newFileName || fileToRename === newFileName) {
      setFileToRename(null);
      return;
    }

    setIsRenaming(true);
    const containerName = "datagovernance";
    let oldBlobName;
    let newBlobName;

    const oldNameLower = fileToRename.toLowerCase();
    const newNameLower = newFileName.toLowerCase();

    if (oldNameLower.includes("_profile") || oldNameLower.includes("profiles")) {
      oldBlobName = `DataQuality/model_automation/Profilling_files/${fileToRename}`;
    } else {
      oldBlobName = `DataQuality/model_automation/Local_Files/${fileToRename}`;
    }

    if (newNameLower.includes("_profile") || newNameLower.includes("profiles")) {
      newBlobName = `DataQuality/model_automation/Profilling_files/${newFileName}`;
    } else {
      newBlobName = `DataQuality/model_automation/Local_Files/${newFileName}`;
    }

    try {
      const result = await renameBlob(containerName, oldBlobName, newBlobName);
      if (result.success) {
        toast({
          title: "File Renamed",
          description: `"${fileToRename}" was renamed to "${newFileName}".`,
        });
        setSavedFiles(prev => prev.map(f => (f === fileToRename ? newFileName : f)));
      } else {
        throw new Error(result.message);
      }
    } catch (e: any) {
      toast({
        title: "Rename Failed",
        description: `Could not rename file: ${e.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRenaming(false);
      setFileToRename(null);
    }
  };

  const handlePreviewFile = async (fileName: string) => {
    setPreviewFileName(fileName);
    setIsPreviewDialogOpen(true);
    setIsPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);

    const containerName = "datagovernance";
    let blobName;
    const fileNameLower = fileName.toLowerCase();
    if (fileNameLower.includes("_profile") || fileNameLower.includes("profiles")) {
      blobName = `DataQuality/model_automation/Profilling_files/${fileName}`;
    } else {
      blobName = `DataQuality/model_automation/Local_Files/${fileName}`;
    }

    try {
      const result = await getBlobPreview(containerName, blobName);
      if (result.success && result.data) {
        setPreviewData(result.data);
      } else {
        throw new Error(result.message || "Failed to get file preview.");
      }
    } catch (e: any) {
      setPreviewError(e.message);
    } finally {
      setIsPreviewLoading(false);
    }
  };


  const selectedSourceCount = filesToUpload.length + Object.values(selectedBlobs).filter(Boolean).length;
  const maxSources = 100;

  const breadcrumbParts = React.useMemo(() => {
    const parts = currentAzurePath.substring(AZURE_BLOB_ROOT_PREFIX.length).split('/').filter(Boolean);
    return ['model_automation', ...parts];
  }, [currentAzurePath]);

  const showSelectAll = currentAzurePath.endsWith('Profilling_files/');
  const allInDirSelected = azureBlobs.length > 0 && azureBlobs.every(b => selectedBlobs[b]);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedBlobs = { ...selectedBlobs };
    azureBlobs.forEach(blobName => {
      newSelectedBlobs[blobName] = checked;
    });
    setSelectedBlobs(newSelectedBlobs);
  };


  return (
    <>
      <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-background overflow-hidden">
        <div className="flex items-center gap-3">
          <ModelMasterIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold">ModelMaster AI</h1>
        </div>

        <div className={cn("grid flex-1 grid-cols-1 md:grid-cols-3 gap-6")}>
          <div className={cn("md:col-span-1 transition-all duration-300", isDataSourceCollapsed ? "hidden" : "block")}>
            <Card className="shadow-lg flex flex-col" style={{ height: '575px' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Source
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsDataSourceCollapsed(true)}>
                    <PanelLeft className="h-4 w-4" />
                    <span className="sr-only">Collapse</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col min-h-0">
                <Separator className="mb-4" />
                <div className="flex space-x-2">
                  <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setFilesToUpload([]); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 hover:bg-primary hover:text-primary-foreground">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                      <ScrollArea className="max-h-[70vh] pr-6 pl-1 py-4">
                        <div className="space-y-4">
                          <DialogHeader className="flex flex-row items-center gap-2">
                            <ModelMasterIcon className="h-6 w-6 text-primary" />
                            <DialogTitle>ModelMaster AI</DialogTitle>
                          </DialogHeader>
                          <Separator />
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium">Add Sources</span>
                            <Button variant="secondary" className="rounded-full">
                              <Search className="mr-2 h-4 w-4" />
                              Discovery Sources
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            Sources let ModelMaster AI base its responses on the information that matters most to you. (Examples: claims data, insurance policies, customer demographics, risk assessments, underwriting guidelines etc)
                          </div>

                          <div
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/50 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors space-y-2"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          >
                            <UploadCloud className="h-12 w-12 text-blue-500" />
                            <p className="font-semibold text-foreground">Upload Sources</p>
                            <p className="text-sm text-muted-foreground">
                              Drag & drop or <span className="text-blue-500 font-semibold">choose file</span> to upload
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Card className="!mt-4">
                              <CardContent className="p-2">
                                <p className="text-xs text-muted-foreground">
                                  Supported file types: Csv, Xlxs, Json etc.
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          {filesToUpload.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Selected local files for upload:</p>
                              <ScrollArea className="max-h-32">
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {filesToUpload.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                  ))}
                                </ul>
                              </ScrollArea>
                            </div>
                          )}

                          <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Card className="flex flex-col items-center justify-center p-4">
                                <GoogleIcon className="w-8 h-8" />
                                <p className="text-sm font-semibold mt-2">Google Workplaces</p>
                                <Button variant="link" className="text-blue-600 h-auto p-1 mt-2" asChild>
                                  <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer">
                                    <Folder className="mr-2 h-4 w-4" />
                                    Google drive
                                  </a>
                                </Button>
                              </Card>
                              <Card className="flex flex-col items-center justify-center p-4">
                                <AzureIcon className="w-8 h-8 text-blue-500" />
                                <p className="text-sm font-semibold mt-2">Azure Blob Storage</p>
                                <Button variant="link" className="text-blue-600 h-auto p-1 mt-2" onClick={handleOpenAzureDialog}>
                                  <FileIcon className="mr-2 h-4 w-4" />
                                  File system
                                </Button>
                              </Card>
                              <Card className="flex flex-col items-center justify-center p-4 bg-muted/50">
                                <p className="text-sm font-semibold">Other Source</p>
                                <p className="text-xs text-muted-foreground mt-1 text-center">Placeholder for another integration.</p>
                              </Card>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3 pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Database className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Source Limit</span>
                              <Progress value={(selectedSourceCount / maxSources) * 100} max={100} className="flex-1" />
                              <span className="text-sm font-mono text-muted-foreground">{selectedSourceCount}/{maxSources}</span>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>

                      <DialogFooter className="pt-6">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={isUploading || filesToUpload.length === 0}>
                          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                          Upload
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="flex-1 hover:bg-primary hover:text-primary-foreground">
                    <Search className="mr-2 h-4 w-4" /> Discovery
                  </Button>
                </div>
                <ScrollArea className="mt-4 flex-grow border-t pt-4">
                  {savedFiles.length > 0 ? (
                    <ul className="space-y-1">
                      {savedFiles.map((fileName, index) => (
                        <li key={index} className="flex items-center justify-between gap-2 text-sm p-1 rounded-md hover:bg-muted/50">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="truncate font-normal" title={fileName}>
                              {fileName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePreviewFile(fileName)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openRenameDialog(fileName)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFileToDelete(fileName)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground text-sm p-4 h-full flex flex-col justify-center items-center">
                      <p>Saved sources will appear here.</p>
                      <p>Click Add source above to add CSV, EXCEL and JSON files. Or import a file directly from Local System, Google Drive.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className={cn("transition-all duration-300 h-full", isDataSourceCollapsed ? "md:col-span-3" : "md:col-span-2")}>
            <Card className="shadow-lg flex flex-col" style={{ height: '575px' }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {isDataSourceCollapsed && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsDataSourceCollapsed(false)}>
                      <PanelRight className="h-4 w-4" />
                      <span className="sr-only">Expand Data Source</span>
                    </Button>
                  )}
                  <CardTitle>Chat</CardTitle>
                </div>
              </CardHeader>
              <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1" ref={chatScrollAreaRef}>
                  <CardContent className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-muted-foreground p-8 text-center">
                        <p>{savedFiles.length > 0 ? "You can ask me anything about your data, like 'perform data profiling'." : "Add a data source to begin."}</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div
                          key={message.id}
                          className={cn(
                            'flex items-start gap-3',
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.sender === 'bot' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback><ModelMasterIcon className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              'rounded-lg p-3 text-sm',
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted',
                              'max-w-[85%]'
                            )}
                          >
                            {message.text ? (
                              <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.text.replace(/\\n/g, '<br />').replace(/```json\n/g, '<pre class="bg-gray-800 text-white p-2 rounded-md overflow-x-auto"><code>').replace(/\n```/g, '</code></pre>') }} />
                            ) : message.tableData ? (
                              <TableDisplay data={message.tableData} showAssumptions={message.showAssumptions} />
                            ) : message.flowData ? (
                              <p className="text-destructive">ERD Diagram rendering is not available. Displaying as table instead.</p>
                            ) : null}
                          </div>
                          {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback><User size={20} /></AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                    {isChatLoading && (
                      <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><ModelMasterIcon className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
                <CardFooter className="border-t pt-4">
                  <div className="relative w-full flex items-center gap-2">
                    <Textarea
                      placeholder={savedFiles.length > 0 ? "Ask a question about your data sources..." : "Add a data source to begin..."}
                      className="min-h-[40px] max-h-36 rounded-md resize-none pr-12"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isChatLoading || savedFiles.length === 0}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={isChatLoading || !chatInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </CardFooter>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isAzureDialogOpen} onOpenChange={setIsAzureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Items from Azure Blob Storage</DialogTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAzureBreadcrumbClick(0)}><Home className="h-4 w-4" /></Button>
              <ChevronRight className="h-4 w-4" />
              {breadcrumbParts.map((part, index) => (
                <React.Fragment key={part}>
                  <Button
                    variant="link"
                    className={cn("h-auto p-0 text-sm", index === breadcrumbParts.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground")}
                    onClick={() => handleAzureBreadcrumbClick(index)}
                  >
                    {part}
                  </Button>
                  {index < breadcrumbParts.length - 1 && <ChevronRight className="h-4 w-4" />}
                </React.Fragment>
              ))}
            </div>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto border rounded-md p-2">
            {isLoadingAzureBlobs ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p>Loading items...</p>
              </div>
            ) : azureBlobsError ? (
              <div className="flex flex-col items-center justify-center p-8 text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5 mb-2" />
                <p className="font-semibold">Error loading items</p>
                <p className="text-sm">{azureBlobsError}</p>
              </div>
            ) : (azureBlobs.length > 0 || azurePrefixes.length > 0) ? (
              <ScrollArea className="h-72">
                <div className="p-4 space-y-2">
                  {showSelectAll && azureBlobs.length > 0 && (
                    <div className="flex items-center space-x-2 p-2 border-b">
                      <Checkbox
                        id="select-all-profiling"
                        checked={allInDirSelected}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      />
                      <Label htmlFor="select-all-profiling" className="text-sm font-semibold">
                        Select All
                      </Label>
                    </div>
                  )}
                  {azurePrefixes.map(prefix => (
                    <div key={prefix} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FolderOpen className="h-4 w-4" />
                      <Button variant="link" className="p-0 h-auto text-sm" onClick={() => handleAzureFolderClick(prefix)}>{prefix}</Button>
                    </div>
                  ))}
                  {azureBlobs.map(blobName => (
                    <div key={blobName} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blob-${blobName}`}
                        checked={!!selectedBlobs[blobName]}
                        onCheckedChange={(checked) => setSelectedBlobs(prev => ({ ...prev, [blobName]: !!checked }))}
                      />
                      <Label htmlFor={`blob-${blobName}`} className="text-sm font-normal">
                        {blobName}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center p-8">
                <p>No files or folders found in this directory.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAzureDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAzureBlobs} disabled={Object.values(selectedBlobs).every(v => !v)}>Add Selected Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file <span className="font-semibold text-foreground">{fileToDelete}</span> from Azure Blob Storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={handleDeleteFile}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!fileToRename} onOpenChange={(open) => !open && setFileToRename(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for the file: <span className="font-semibold text-foreground">{fileToRename}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-file-name" className="text-right">
                New Name
              </Label>
              <Input
                id="new-file-name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFileToRename(null)} disabled={isRenaming}>Cancel</Button>
            <Button onClick={handleRenameFile} disabled={isRenaming || !newFileName || newFileName === fileToRename}>
              {isRenaming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isRenaming ? "Renaming..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Preview: {previewFileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6 pb-6">
            <div className="relative h-full">
              {isPreviewLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Loading preview...</span>
                </div>
              ) : previewError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 text-destructive text-center p-4">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading preview</p>
                  <p className="text-sm mt-1">{previewError}</p>
                </div>
              ) : previewData && previewData.rows.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="overflow-auto flex-1 border rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted z-10">
                        <TableRow>
                          {previewData.headers.map(header => (
                            <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {previewData.headers.map(header => (
                              <TableCell key={`${rowIndex}-${header}`} className="whitespace-nowrap">{row[header]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <p>No data to preview or the file is empty.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
