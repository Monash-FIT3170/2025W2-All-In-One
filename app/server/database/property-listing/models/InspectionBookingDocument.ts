export type InspectionBookingDocument = {
  _id: string;
  propertyId: string;
  tenantId: string;
  inspectionIndex: number; // Index of the inspection in the property's inspection array
  inspectionDate: Date;
  inspectionStartTime: Date;
  inspectionEndTime: Date;
  createdAt: Date;
  updatedAt: Date;
};
