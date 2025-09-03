import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { uploadAgentDocument, selectIsUploading, selectUploadProgress } from "../state/agent-documents-slice";
import { selectCurrentUser } from "../../../user-authentication/state/reducers/current-user-slice";
import { FileUploader, FileInput } from "../../../theming-shadcn/FileUpload";
import { Button } from "../../../theming-shadcn/Button";
import { Label } from "../../../theming-shadcn/Label";
import { Calendar } from "../../../theming-shadcn/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../theming-shadcn/Popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../theming-shadcn/Select";
import { CalendarIcon, Upload, FileText, AlertCircle, Building, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../../utils";
import { isValidBlobContentType } from "/app/shared/azure/blob-models";
import { getPropertyByAgentId } from "../../../../library-modules/domain-models/property/repositories/property-repository";
import { Property } from "../../../../library-modules/domain-models/property/Property";

interface AgentDocumentUploadProps {
  onUploadSuccess?: () => void;
}

export function AgentDocumentUpload({ onUploadSuccess }: AgentDocumentUploadProps) {
  const dispatch = useAppDispatch();
  const isUploading = useAppSelector(selectIsUploading);
  const uploadProgress = useAppSelector(selectUploadProgress);
  const currentUser = useAppSelector(selectCurrentUser);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validUntil, setValidUntil] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load properties managed by the agent
  useEffect(() => {
    const loadProperties = async () => {
      if (!currentUser || !('agentId' in currentUser)) return;
      
      setIsLoadingProperties(true);
      try {
        const agentProperties = await getPropertyByAgentId(currentUser.agentId);
        setProperties(Array.isArray(agentProperties) ? agentProperties : [agentProperties].filter(Boolean));
      } catch (error) {
        setError("Failed to load properties");
      } finally {
        setIsLoadingProperties(false);
      }
    };

    loadProperties();
  }, [currentUser]);

  const handleFileSelect = (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!isValidBlobContentType(file.type)) {
        setError("Invalid file type. Please upload a PDF, image, or text file.");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large. Please upload a file smaller than 10MB.");
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !validUntil || !selectedPropertyId || !currentUser || !('agentId' in currentUser)) {
      setError("Please select a file, set a valid until date, and choose a property.");
      return;
    }

    try {
      await dispatch(uploadAgentDocument({
        file: selectedFile,
        propertyId: selectedPropertyId,
        agentId: currentUser.agentId,
        validUntil,
      })).unwrap();
      
      // Reset form
      setSelectedFile(null);
      setValidUntil(undefined);
      setSelectedPropertyId("");
      setError(null);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const canUpload = selectedFile && validUntil && selectedPropertyId && !isUploading && currentUser && 'agentId' in currentUser;
  const selectedProperty = properties.find(p => p.propertyId === selectedPropertyId);

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Upload Document for Property</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Property Selection */}
        <div className="space-y-2">
          <Label htmlFor="property-select">Select Property</Label>
          <Select 
            value={selectedPropertyId} 
            onValueChange={setSelectedPropertyId}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Choose a property to upload document for" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {isLoadingProperties ? (
                <SelectItem value="loading" disabled>
                  Loading properties...
                </SelectItem>
              ) : properties.length === 0 ? (
                <SelectItem value="no-properties" disabled>
                  No properties found
                </SelectItem>
              ) : (
                properties.map((property) => (
                  <SelectItem key={property.propertyId} value={property.propertyId}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>
                        {property.streetnumber} {property.streetname}, {property.suburb}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {selectedProperty && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <User className="w-4 h-4" />
                <span>
                  <strong>Tenant:</strong> {selectedProperty.tenantId && selectedProperty.tenantId.trim() !== "" ? (
                    "Tenant"
                  ) : (
                    "No tenant assigned"
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Document File</Label>
          <FileUploader
            value={selectedFile ? [selectedFile] : null}
            onValueChange={handleFileSelect}
            dropzoneOptions={{
              accept: {
                'application/pdf': ['.pdf'],
                'image/*': ['.jpg', '.jpeg', '.png'],
                'text/plain': ['.txt']
              },
              maxFiles: 1,
              maxSize: 10 * 1024 * 1024,
              multiple: false
            }}
          >
            <FileInput className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Drop your document here or click to browse"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, images, or text files up to 10MB
                </p>
              </div>
            </FileInput>
          </FileUploader>
        </div>

        {/* Valid Until Date */}
        <div className="space-y-2">
          <Label htmlFor="valid-until">Valid Until</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !validUntil && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {validUntil ? format(validUntil, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={validUntil}
                onSelect={(date) => {
                  setValidUntil(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!canUpload}
          className="w-full"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </div>
          )}
        </Button>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
