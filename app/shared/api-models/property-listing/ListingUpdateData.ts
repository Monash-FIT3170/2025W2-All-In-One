export type ListingUpdateData = {
  propertyId: string;
  startLeaseDate: Date;
  endLeaseDate: Date;
  leaseTerm: string;
  inspectionTimes: { start_time: Date, end_time: Date }[];
};
