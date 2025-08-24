import {
  apiInsertInspectionBooking,
  apiGetInspectionBookingsByPropertyAndTenant,
  apiDeleteInspectionBooking
} from "/app/client/library-modules/apis/inspection-booking/inspection-booking";
import { Inspection } from "/app/client/library-modules/domain-models/inspection/Inspection";
import { mapApiInspectionToInspection } from "./mappers/inspection-mapper";
import { ApiInspection } from "/app/shared/api-models/inspection/ApiInspection";
import { InspectionBookingDocument } from "/app/server/database/property-listing/models/InspectionBookingDocument";

/**
 * Map InspectionBookingDocument to ApiInspection
 * @param document - The MongoDB document
 * @returns ApiInspection object
 */
function mapDocumentToApiInspection(document: InspectionBookingDocument): ApiInspection {
  return {
    id: document._id,
    propertyId: document.propertyId,
    tenantId: document.tenantId,
    inspectionIndex: document.inspectionIndex,
    inspectionDate: document.inspectionDate,
    inspectionStartTime: document.inspectionStartTime,
    inspectionEndTime: document.inspectionEndTime,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

/**
 * Get inspection bookings for a specific property and tenant
 * @param propertyId - The property ID
 * @param tenantId - The tenant ID
 * @returns Promise that resolves to an array of inspections
 */
export async function getInspectionBookingsByPropertyAndTenant(
  propertyId: string,
  tenantId: string
): Promise<Inspection[]> {
  const documents = await apiGetInspectionBookingsByPropertyAndTenant(propertyId, tenantId);
  const apiInspections = documents.map(mapDocumentToApiInspection);
  const mappedInspections = apiInspections.map(mapApiInspectionToInspection);

  return mappedInspections;
}

/**
 * Insert a new inspection booking
 * @param bookingData - The booking data
 * @returns Promise that resolves to the booking ID
 */
export async function insertInspectionBooking(bookingData: {
  propertyId: string;
  tenantId: string;
  inspectionIndex: number;
  inspectionDate: Date;
  inspectionStartTime: Date;
  inspectionEndTime: Date;
}): Promise<string> {
  return await apiInsertInspectionBooking(bookingData);
}

/**
 * Delete an inspection booking
 * @param bookingId - The booking ID to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteInspectionBooking(bookingId: string): Promise<void> {
  await apiDeleteInspectionBooking(bookingId);
}
