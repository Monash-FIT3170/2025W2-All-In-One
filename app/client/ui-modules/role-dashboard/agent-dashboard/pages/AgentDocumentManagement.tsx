import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchAgentDocuments, selectAgentDocumentsLoading, deleteAgentDocument } from "../state/agent-documents-slice";
import { selectCurrentUser } from "../../../user-authentication/state/reducers/current-user-slice";
import { AgentDocumentUpload } from "../components/AgentDocumentUpload";
import { AgentDocumentList } from "../components/AgentDocumentList";
import { Button } from "../../../theming-shadcn/Button";
import { RefreshCw, Upload, FileText } from "lucide-react";

function AgentDocumentManagement() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAgentDocumentsLoading);
  const [showUpload, setShowUpload] = useState(false);

  // Load agent documents on component mount
  useEffect(() => {
    if (currentUser && 'agentId' in currentUser) {
      dispatch(fetchAgentDocuments(currentUser.agentId));
    }
  }, [dispatch, currentUser]);

  const handleRefresh = () => {
    if (currentUser && 'agentId' in currentUser) {
      dispatch(fetchAgentDocuments(currentUser.agentId));
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // Refresh the document list
    handleRefresh();
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await dispatch(deleteAgentDocument(documentId)).unwrap();
      // Document will be automatically removed from state
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  if (!currentUser || !('agentId' in currentUser)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600">
                  You need to be logged in as an agent to access this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
                <p className="text-gray-600 mt-2">
                  Upload and manage documents for your properties
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {showUpload ? 'Hide Upload' : 'Upload Document'}
                </Button>
              </div>
            </div>

            {/* Upload Section */}
            {showUpload && (
              <AgentDocumentUpload onUploadSuccess={handleUploadSuccess} />
            )}

            {/* Documents List */}
            <div className="bg-white rounded-lg border p-6">
              <AgentDocumentList onDeleteDocument={handleDeleteDocument} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDocumentManagement;
