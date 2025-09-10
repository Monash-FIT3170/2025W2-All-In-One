import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  fetchLandlordDocuments,
  selectDocumentsLoading,
} from "../state/landlord-document-slice";
import { LandlordDocumentList } from "../components/LandlordDocumentList";
import { Button } from "../../../theming-shadcn/Button";
import { RefreshCw, FileText } from "lucide-react";
import { selectPropertyDetails } from "../state/landlord-dashboard-slice";

function landlordDocument() {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectPropertyDetails);
  const isLoading = useAppSelector(selectDocumentsLoading);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>();

  useEffect(() => {
    if (selectedPropertyId) {
      dispatch(fetchLandlordDocuments(selectedPropertyId));
    }
  }, [dispatch, selectedPropertyId]);

  const property = properties?.find((p) => p.propertyId === selectedPropertyId);

  const handleRefresh = () => {
    if (property?.propertyId) {
      dispatch(fetchLandlordDocuments(property.propertyId));
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  No Property Assigned
                </h1>
                <p className="text-gray-600">
                  You need to be assigned to a property before you can view
                  documents.
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Documents
                </h1>

                {/* Property dropdown */}
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="mt-2 border rounded px-2 py-1 text-sm"
                >
                  <option value="">Select a property</option>
                  {properties?.map((p) => (
                    <option key={p.propertyId} value={p.propertyId}>
                      {p.streetnumber} {p.streetname}, {p.suburb}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Documents List */}
            <LandlordDocumentList onRefresh={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default landlordDocument;
