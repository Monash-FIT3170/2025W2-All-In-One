import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { InspectionBookingUiState } from "../InspectionBookingUiState";
import { getInspectionBookingsUseCase } from "/app/client/library-modules/use-cases/inspection-booking/GetInspectionBookingsUseCase";
import { BookInspectionUseCase } from "/app/client/library-modules/use-cases/inspection-booking/BookInspectionUseCase";
import { cancelInspectionBookingUseCase } from "/app/client/library-modules/use-cases/inspection-booking/CancelInspectionBookingUseCase";
import { InspectionBookingCreateData } from "../../types/InspectionBooking";

const initialState: InspectionBookingUiState = {
  bookingsByProperty: {},
  isLoading: false,
  isLoadingBookings: false,
  error: null,
};

// Load inspection bookings for a specific property and tenant
export const loadInspectionBookingsAsync = createAsyncThunk(
  "inspectionBooking/loadInspectionBookings",
  async ({ propertyId, tenantId }: { propertyId: string; tenantId: string }) => {
    const bookings = await getInspectionBookingsUseCase(propertyId, tenantId);
    const bookedIndices = bookings.map(booking => booking.inspectionIndex);
    return { propertyId, bookedIndices };
  }
);

// Book an inspection
export const bookInspectionAsync = createAsyncThunk(
  "inspectionBooking/bookInspection",
  async (bookingData: InspectionBookingCreateData) => {
    const useCase = new BookInspectionUseCase();
    const bookingId = await useCase.execute({
      propertyId: bookingData.propertyId,
      tenantId: bookingData.tenantId,
      inspectionIndex: bookingData.inspectionIndex,
      inspectionData: [], // This will be provided by the hook
    }, null); // authUser will be provided by the hook
    return {
      bookingId,
      propertyId: bookingData.propertyId,
      inspectionIndex: bookingData.inspectionIndex
    };
  }
);

// Cancel an inspection booking
export const cancelInspectionBookingAsync = createAsyncThunk(
  "inspectionBooking/cancelInspectionBooking",
  async ({ bookingId, propertyId, inspectionIndex }: {
    bookingId: string;
    propertyId: string;
    inspectionIndex: number;
  }) => {
    await cancelInspectionBookingUseCase(bookingId, propertyId, inspectionIndex);
    return { propertyId, inspectionIndex };
  }
);

export const inspectionBookingSlice = createSlice({
  name: "inspectionBooking",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBookingsForProperty: (state, action) => {
      const propertyId = action.payload;
      delete state.bookingsByProperty[propertyId];
    },
  },
  extraReducers: (builder) => {
    // Load inspection bookings
    builder
      .addCase(loadInspectionBookingsAsync.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(loadInspectionBookingsAsync.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        const { propertyId, bookedIndices } = action.payload;
        state.bookingsByProperty[propertyId] = new Set(bookedIndices);
      })
      .addCase(loadInspectionBookingsAsync.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to load inspection bookings';
      })

    // Book inspection
    .addCase(bookInspectionAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(bookInspectionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      const { propertyId, inspectionIndex } = action.payload;

      // Initialize the set if it doesn't exist
      if (!state.bookingsByProperty[propertyId]) {
        state.bookingsByProperty[propertyId] = new Set();
      }

      // Add the booked inspection index
      state.bookingsByProperty[propertyId].add(inspectionIndex);
    })
    .addCase(bookInspectionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to book inspection';
    })

    // Cancel inspection booking
    .addCase(cancelInspectionBookingAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(cancelInspectionBookingAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      const { propertyId, inspectionIndex } = action.payload;

      // Remove the booking from the set
      if (state.bookingsByProperty[propertyId]) {
        state.bookingsByProperty[propertyId].delete(inspectionIndex);

        // Clean up empty sets
        if (state.bookingsByProperty[propertyId].size === 0) {
          delete state.bookingsByProperty[propertyId];
        }
      }
    })
    .addCase(cancelInspectionBookingAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to cancel inspection booking';
    });
  },
});

// Selectors
export const selectInspectionBookingState = (state: RootState) => state.inspectionBooking;

export const selectBookedInspectionsForProperty = createSelector(
  [selectInspectionBookingState, (state: RootState, propertyId: string) => propertyId],
  (inspectionBookingState, propertyId) =>
    inspectionBookingState.bookingsByProperty[propertyId] || new Set<number>()
);

export const selectHasBookedInspections = createSelector(
  [selectInspectionBookingState, (state: RootState, propertyId: string) => propertyId],
  (inspectionBookingState, propertyId) => {
    const bookings = inspectionBookingState.bookingsByProperty[propertyId];
    return bookings ? bookings.size > 0 : false;
  }
);

export const selectIsInspectionBooked = createSelector(
  [
    selectInspectionBookingState,
    (state: RootState, propertyId: string, inspectionIndex: number) => ({ propertyId, inspectionIndex })
  ],
  (inspectionBookingState, { propertyId, inspectionIndex }) => {
    const bookings = inspectionBookingState.bookingsByProperty[propertyId];
    return bookings ? bookings.has(inspectionIndex) : false;
  }
);

export const selectIsLoadingInspectionBookings = createSelector(
  [selectInspectionBookingState],
  (inspectionBookingState) => inspectionBookingState.isLoadingBookings
);

export const selectIsBookingInspection = createSelector(
  [selectInspectionBookingState],
  (inspectionBookingState) => inspectionBookingState.isLoading
);

export const selectInspectionBookingError = createSelector(
  [selectInspectionBookingState],
  (inspectionBookingState) => inspectionBookingState.error
);

// Actions
export const { clearError, clearBookingsForProperty } = inspectionBookingSlice.actions;

export default inspectionBookingSlice.reducer;
