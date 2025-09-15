import React from "react";
import { useAppSelector } from "../../../../store";
import {
  selectAgentDocuments,
  selectAgentDocumentsLoading,
  selectDocumentsByProperty,
} from "../state/agent-documents-slice";
import { Button } from "../../../theming-shadcn/Button";
import { SignButton } from "../../../common/SignButton";
import {
  FileText,
  Download,
  Trash2,
  CalendarIcon,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

interface AgentDocumentListProps {
  propertyId?: string;
  onDeleteDocument?: (documentId: string) => void;
}

export function AgentDocumentList({
  propertyId,
  onDeleteDocument,
}: AgentDocumentListProps) {
  const documents = useAppSelector(
    propertyId
      ? (state) => selectDocumentsByProperty(state, propertyId)
      : selectAgentDocuments
  );

  // is used to determine if the documents are still loading
  const isLoading = useAppSelector(selectAgentDocumentsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-gray-600">Loading documents...</span>
      </div>
    );
  }

  // if agent has no current documents, display a message
  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No documents found</p>
        <p className="text-sm">{"No documents have been uploaded yet."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {propertyId ? "Property Documents" : "All Documents"}
      </h3>

      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {document.title || "Untitled Document"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        {/* <User className="w-3 h-3" />
												<span>
													{document.tenantName || "No tenant assigned"} TODO: I want to add this but need more time - touch up on m
												</span> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span className="truncate">
                      {document.propertyAddress || "Property"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>
                      Valid until {format(document.validUntil, "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Uploaded on{" "}
                  {format(document.uploadedDate, "MMM dd, yyyy 'at' h:mm a")}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {document.documentUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(document.documentUrl, "_blank")}
                    className="h-8 px-3"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                )}

                {onDeleteDocument && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDocument(document._id)}
                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4 border-t pt-3 text-sm text-gray-700">
              {/* Sign button */}
              <div className="mb-2">
                <SignButton
                  documentId={document._id}
                  isSigned={document.agentSigned ?? false}
                  onSign={(documentId) => {
                    console.log("Agent Signing document", documentId);
                    Meteor.callAsync(MeteorMethodIdentifier.SIGN_DOCUMENT, documentId, "agent");
                  }}
                />
              </div>

              {/* Signature statuses */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium">Tenant: </span>
                  {document.tenantSigned ? (
                    <span className="text-green-600">Signed</span>
                  ) : (
                    <span className="text-red-500">Still to Sign</span>
                  )}
                </div>
                <div>
                  <span className="font-medium">Landlord: </span>
                  {document.landlordSigned ? (
                    <span className="text-green-600">Signed</span>
                  ) : (
                    <span className="text-red-500">Still to Sign</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
