import { InspectionBookingListUiState } from '../../property-listing-page/components/PropertyInspections';
import { UserAccount } from '/app/client/library-modules/domain-models/user/UserAccount';

export type InspectionBooking = {
  id: string;
  propertyId: string;
  tenantId: string;
  inspectionIndex: number;
  inspectionDate: Date;
  inspectionStartTime: Date;
  inspectionEndTime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type InspectionBookingCreateData = {
  propertyId: string;
  tenantId: string;
  inspectionIndex: number;
  inspectionDate: Date;
  inspectionStartTime: Date;
  inspectionEndTime: Date;
  inspectionData?: InspectionBookingListUiState[];
  authUser?: UserAccount | null;
};
