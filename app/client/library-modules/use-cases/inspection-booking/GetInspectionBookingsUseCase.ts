import { getInspectionBookingsByPropertyAndTenant } from "/app/client/library-modules/domain-models/inspection/repositories/inspection-repository";
import { Inspection } from "/app/client/library-modules/domain-models/inspection/Inspection";

export interface GetInspectionBookingsRequest {
  propertyId: string;
  tenantId: string;
}

/**
 * Use case for getting inspection bookings for a property and tenant
 *
 * This encapsulates the business logic for retrieving inspection bookings,
 * following the same pattern as other use cases in the system.
 */
export class GetInspectionBookingsUseCase {
  /**
   * Executes the get inspection bookings use case
   * @param request - The request data containing propertyId and tenantId
   * @returns Promise that resolves to an array of inspections
   */
  async execute(request: GetInspectionBookingsRequest): Promise<Inspection[]> {
    return await getInspectionBookingsByPropertyAndTenant(
      request.propertyId,
      request.tenantId
    );
  }
}

/**
 * Convenience function for getting inspection bookings
 * @param propertyId - The property ID
 * @param tenantId - The tenant ID
 * @returns Promise that resolves to an array of inspections
 */
export async function getInspectionBookingsUseCase(
  propertyId: string,
  tenantId: string
): Promise<Inspection[]> {
  const useCase = new GetInspectionBookingsUseCase();
  return await useCase.execute({ propertyId, tenantId });
}
