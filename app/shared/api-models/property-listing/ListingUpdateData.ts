export type ListingUpdateData = {
  propertyId: string;
  leaseTerm: string;
  inspectionTimes: { start_time: Date, end_time: Date }[];
};
