import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { Divider } from "/app/client/ui-modules/theming/components/Divider";
import { CalendarIcon } from "/app/client/ui-modules/theming/icons/CalendarIcon";
import { twMerge } from "tailwind-merge";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";
import { Role } from "/app/shared/user-role-identifier";
import { bookPropertyInspectionAsync } from "../state/reducers/property-listing-slice";

export type InspectionBookingListUiState = {
  _id: string;
  date: string;
  startingTime: string;
  endingTime: string;
  tenant_ids: string[];
};

export function PropertyInspections({
  bookingUiStateList,
  onBook,
  userRole,
  tenantId,
  className = "",
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (inspectionId: string) => void; // <-- FIXED
  userRole?: Role;
  tenantId?: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col w-[520px]", className)}>
      <SubHeading text="Upcoming Inspections" className="mb-2" />
      <InspectionBookingList
        bookingUiStateList={bookingUiStateList}
        onBook={onBook}
        userRole={userRole}
        tenantId={tenantId}
      />
    </div>
  );
}

export function PropertyInspectionsContainer({
  initialBookingUiStateList,
  userRole,
  tenantId,
  propertyId,
}: {
  initialBookingUiStateList: InspectionBookingListUiState[];
  userRole?: Role;
  tenantId?: string;
  propertyId: string;
}) {
  const [bookingList, setBookingList] = React.useState(
    initialBookingUiStateList
  );

  const handleBook = (inspectionId: string) => {
    if (!tenantId) return;

    // Optimistically update the local state
    setBookingList((prev) =>
      prev.map((insp) =>
        insp._id === inspectionId
          ? { ...insp, tenant_ids: [...insp.tenant_ids, tenantId] } // add tenantId
          : insp
      )
    );

    // Then call the async function (optional, for server sync)
    bookPropertyInspectionAsync({ inspectionId, tenantId, propertyId });
  };

  return (
    <PropertyInspections
      bookingUiStateList={bookingList}
      onBook={handleBook}
      userRole={userRole}
      tenantId={tenantId}
    />
  );
}

function InspectionBookingList({
  bookingUiStateList,
  onBook,
  userRole,
  tenantId,
  className,
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (inspectionId: string) => void;
  userRole?: Role;
  tenantId?: string;
  className?: string;
}): React.JSX.Element {
  const tenantHasBooking =
    !!tenantId &&
    bookingUiStateList.some((insp) => insp.tenant_ids.includes(tenantId));

  return (
    <div
      className={twMerge(
        "flex flex-col border-[1.5px] rounded-lg py-3 px-4",
        className
      )}
      style={{ borderColor: "var(--divider-color)" }}
    >
      {bookingUiStateList.map((state, i) => {
        return (
          <BookingEntry
            key={state._id}
            bookingState={state}
            shouldDisplayDivider={i !== 0}
            onBook={() => onBook(state._id)}
            userRole={userRole}
            tenantId={tenantId}
            tenantHasBooking={tenantHasBooking}
          />
        );
      })}
    </div>
  );
}

function BookingEntry({
  bookingState,
  shouldDisplayDivider,
  onBook,
  userRole,
  tenantId,
  tenantHasBooking,
  className = "",
}: {
  bookingState: InspectionBookingListUiState;
  shouldDisplayDivider: boolean;
  onBook: (inspectionId: string) => void;
  userRole?: Role;
  tenantId?: string;
  tenantHasBooking: boolean;
  className?: string;
}): React.JSX.Element {
  const canBook = userRole === Role.TENANT;
  const isBooked = tenantId
    ? bookingState.tenant_ids.includes(tenantId)
    : false;
  const isThisInspectionBooked =
    tenantId && bookingState.tenant_ids.includes(tenantId);

  console.log("isBooked:", isBooked, "for tenantId:", tenantId);
  return (
    <div className={twMerge("flex flex-col", className)}>
      {shouldDisplayDivider ? <Divider /> : null}
      {shouldDisplayDivider ? <Divider /> : null}

      <div className="flex flex-row items-center">
        <BookingDateTime
          date={bookingState.date}
          startingTime={bookingState.startingTime}
          endingTime={bookingState.endingTime}
          className="mr-auto"
        />
        <CalendarIcon className="w-[22px] h-[20px] mr-6" />
        {isThisInspectionBooked ? (
          <BookingButton
            inspectionId={bookingState._id}
            onClick={() => onBook(bookingState._id)}
            isBooked={true}
          />
        ) : canBook && !tenantHasBooking ? (
          <BookingButton
            inspectionId={bookingState._id}
            onClick={() => onBook(bookingState._id)}
            isBooked={false}
          />
        ) : (
          <div className="text-sm text-gray-500 italic">
            {userRole === Role.AGENT
              ? "Agents cannot book inspections"
              : userRole === Role.LANDLORD
                ? "Landlords cannot book inspections"
                : tenantHasBooking
                  ? "You have already booked an inspection for this property"
                  : "Login as tenant to book"}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingDateTime({
  date,
  startingTime,
  endingTime,
  className = "",
}: {
  date: string;
  startingTime: string;
  endingTime: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={className}>
      <span className="geist-medium block">{date}</span>
      <span className="geist-regular">{`${startingTime} - ${endingTime}`}</span>
    </div>
  );
}

function BookingButton({
  inspectionId,
  onClick,
  isBooked = false,
  className = "",
}: {
  inspectionId: string;
  onClick: () => void;
  isBooked?: boolean;
  className?: string;
}): React.JSX.Element {
  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={() => {
        if (!isBooked) {
          onClick();
        }
      }}
      className={twMerge(
        "w-[117px] h-[36px]",
        isBooked ? "bg-gray-400 text-white cursor-not-allowed" : "",
        className
      )}
    >
      {isBooked ? "Booked" : "Book"}
    </ThemedButton>
  );
}
