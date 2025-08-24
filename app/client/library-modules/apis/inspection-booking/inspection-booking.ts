import { Meteor } from 'meteor/meteor';
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';
import { InspectionBookingDocument } from '/app/server/database/property-listing/models/InspectionBookingDocument';

export async function apiInsertInspectionBooking(bookingData: {
  propertyId: string;
  tenantId: string;
  inspectionIndex: number;
  inspectionDate: Date;
  inspectionStartTime: Date;
  inspectionEndTime: Date;
}): Promise<string> {
  try {
    const result = await Meteor.callAsync(MeteorMethodIdentifier.INSPECTION_BOOKING_INSERT, bookingData);
    return result;
  } catch (error) {
    console.error('Failed to insert inspection booking:', error);
    throw error;
  }
}

export async function apiGetInspectionBookingsByPropertyAndTenant(
  propertyId: string,
  tenantId: string
): Promise<InspectionBookingDocument[]> {
  try {
    const result = await Meteor.callAsync(
      MeteorMethodIdentifier.INSPECTION_BOOKING_GET_BY_PROPERTY_AND_TENANT,
      propertyId,
      tenantId
    );
    return result;
  } catch (error) {
    console.error('Failed to get inspection bookings:', error);
    throw error;
  }
}

export async function apiDeleteInspectionBooking(bookingId: string): Promise<void> {
  try {
    await Meteor.callAsync(MeteorMethodIdentifier.INSPECTION_BOOKING_DELETE, bookingId);
  } catch (error) {
    console.error('Failed to delete inspection booking:', error);
    throw error;
  }
}
