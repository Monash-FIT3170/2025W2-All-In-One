export type InspectionBookingUiState = {
  // Bookings organized by property ID -> Set of booked inspection indices
  bookingsByProperty: Record<string, Set<number>>;

  // Loading states
  isLoading: boolean;
  isLoadingBookings: boolean;

  // Error handling
  error: string | null;
};
