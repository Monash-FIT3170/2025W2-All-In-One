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

export type InspectionBookingListUiState = {
  date: string;
  startingTime: string;
  endingTime: string;
   isBooked?: boolean;
};

export function PropertyInspections({
  bookingUiStateList,
  onBook,
  userRole,
  bookedPropertyListingInspections,
  className = "",
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  userRole?: Role;
  bookedPropertyListingInspections?: number[];
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col w-[520px]", className)}>
      <SubHeading text="Upcoming Inspections" className="mb-2" />
      <InspectionBookingList
        bookingUiStateList={bookingUiStateList}
        onBook={onBook}
        userRole={userRole}
        bookedPropertyListingInspections={bookedPropertyListingInspections}
      />
    </div>
  );
}

function InspectionBookingList({
  bookingUiStateList,
  onBook,
  userRole,
  bookedPropertyListingInspections,
  className,
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  userRole?: Role;
  bookedPropertyListingInspections?: number[];
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={twMerge(
        "flex flex-col border-[1.5px] border-(--divider-color) rounded-lg py-3 px-4",
        className
      )}
    >
      {bookingUiStateList.map((state, i) => {
        const isBooked = bookedPropertyListingInspections?.includes(i) || false;
        return (
          <BookingEntry
            key={`${state.date}${state.startingTime}`}
            bookingState={{ ...state, isBooked }}
            shouldDisplayDivider={i != 0}
            index={i}
            onBook={onBook}
            userRole={userRole}
            bookedPropertyListingInspections={bookedPropertyListingInspections}
          />
        );
      })}
    </div>
  );
}

function BookingEntry({
  bookingState,
  shouldDisplayDivider,
  index,
  onBook,
  userRole,
  bookedPropertyListingInspections,
  className = "",
}: {
  bookingState: InspectionBookingListUiState;
  shouldDisplayDivider: boolean;
  index: number;
  onBook: (index: number) => void;
  userRole?: Role;
  bookedPropertyListingInspections?: number[];
  className?: string;
}): React.JSX.Element {
  // Only tenants can book inspections
  const canBookPropertyListingInspection = userRole === Role.TENANT;
  const isBooked = bookingState.isBooked || false;
  const hasAnyBooking = bookedPropertyListingInspections && bookedPropertyListingInspections.length > 0;

  return (
    <div className={twMerge("flex flex-col", className)}>
      {shouldDisplayDivider ? <Divider /> : ""}

      <div className="flex flex-row items-center">
        <BookingDateTime
          date={bookingState.date}
          startingTime={bookingState.startingTime}
          endingTime={bookingState.endingTime}
          className="mr-auto"
        />
        <CalendarIcon className="w-[22px] h-[20px] mr-6" />
        {isBooked ? (
          // Show booked state regardless of user role
          <BookingButton index={index} onClick={onBook} isBooked={true} />
        ) : canBookPropertyListingInspection ? (
          hasAnyBooking ? (
            // Hide button for unbooked property listing inspections when any property listing inspection is booked
            null
          ) : (
            <BookingButton index={index} onClick={onBook} isBooked={false} />
          )
        ) : (
          <div className="text-sm text-gray-500 italic">
            {userRole === Role.AGENT ? "Agents cannot book inspections" :
             userRole === Role.LANDLORD ? "Landlords cannot book inspections" :
             "Login as tenant to book"}
             {/* Will remove this later */}
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
  index,
  onClick,
  isBooked,
  className = "",
}: {
  index: number;
  onClick: (index: number) => void;
  isBooked: boolean;
  className?: string;
}): React.JSX.Element {
  if (isBooked) {
    return (
      <ThemedButton
        variant={ThemedButtonVariant.TERTIARY}
        onClick={() => {}} // No-op function for booked state
        className={twMerge("w-[117px] h-[36px] opacity-50 cursor-not-allowed", className)}
      >
        Booked
      </ThemedButton>
    );
  }

  return (
    <ThemedButton
      variant={ThemedButtonVariant.TERTIARY}
      onClick={() => {
        onClick(index);
      }}
      className={twMerge("w-[117px] h-[36px]", className)}
    >
      Book
    </ThemedButton>
  );
}
