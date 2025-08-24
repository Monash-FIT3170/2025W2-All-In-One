import { Inspection } from "/app/client/library-modules/domain-models/inspection/Inspection";
import { ApiInspection } from "/app/shared/api-models/inspection/ApiInspection";

export function mapApiInspectionToInspection(apiInspection: ApiInspection): Inspection {
  return {
    id: apiInspection.id,
    propertyId: apiInspection.propertyId,
    tenantId: apiInspection.tenantId,
    inspectionIndex: apiInspection.inspectionIndex,
    inspectionDate: apiInspection.inspectionDate,
    inspectionStartTime: apiInspection.inspectionStartTime,
    inspectionEndTime: apiInspection.inspectionEndTime,
    createdAt: apiInspection.createdAt,
    updatedAt: apiInspection.updatedAt,
  }
}
