import { Meteor } from 'meteor/meteor';
import { InspectionBookingCollection } from '../../database/property-listing/listing-collections';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { InspectionBookingDocument } from '../../database/property-listing/models/InspectionBookingDocument';

// INSERT INSPECTION BOOKING
const inspectionBookingInsertMethod = {
  [MeteorMethodIdentifier.INSPECTION_BOOKING_INSERT]: async (
    bookingData: {
      propertyId: string;
      tenantId: string;
      inspectionIndex: number;
      inspectionDate: Date;
      inspectionStartTime: Date;
      inspectionEndTime: Date;
    }
  ): Promise<string> => {
    const now = new Date();
    const bookingDoc: Omit<InspectionBookingDocument, '_id'> = {
      propertyId: bookingData.propertyId,
      tenantId: bookingData.tenantId,
      inspectionIndex: bookingData.inspectionIndex,
      inspectionDate: bookingData.inspectionDate,
      inspectionStartTime: bookingData.inspectionStartTime,
      inspectionEndTime: bookingData.inspectionEndTime,
      createdAt: now,
      updatedAt: now,
    };

    const insertedId = await InspectionBookingCollection.insertAsync(bookingDoc);
    return insertedId;
  },
};

// GET INSPECTION BOOKINGS BY PROPERTY AND TENANT
const inspectionBookingGetByPropertyAndTenantMethod = {
  [MeteorMethodIdentifier.INSPECTION_BOOKING_GET_BY_PROPERTY_AND_TENANT]: async (
    propertyId: string,
    tenantId: string
  ): Promise<InspectionBookingDocument[]> => {
    const bookings = await InspectionBookingCollection.find({
      propertyId,
      tenantId
    }).fetchAsync();
    return bookings;
  },
};

// DELETE INSPECTION BOOKING
const inspectionBookingDeleteMethod = {
  [MeteorMethodIdentifier.INSPECTION_BOOKING_DELETE]: async (
    bookingId: string
  ): Promise<void> => {
    await InspectionBookingCollection.removeAsync(bookingId);
  },
};

Meteor.methods({
  ...inspectionBookingInsertMethod,
  ...inspectionBookingGetByPropertyAndTenantMethod,
  ...inspectionBookingDeleteMethod,
});
