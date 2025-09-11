export type PropertyListingInspectionDocument = {
    _id: string;
    tenant_ids: string[]; // array of tenant ids who have booked this inspection
    starttime: Date;
    endtime: Date;
  }