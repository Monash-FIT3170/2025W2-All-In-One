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
};

export function PropertyInspections({
  bookingUiStateList,
  onBook,
  userRole,
  className = "",
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  userRole?: Role;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col w-[520px]", className)}>
      <SubHeading text="Upcoming Inspections" className="mb-2" />
      <InspectionBookingList
        bookingUiStateList={bookingUiStateList}
        onBook={onBook}
        userRole={userRole}
      />
    </div>
  );
}

function InspectionBookingList({
  bookingUiStateList,
  onBook,
  userRole,
  className,
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  userRole?: Role;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={twMerge(
        "flex flex-col border-[1.5px] border-(--divider-color) rounded-lg py-3 px-4",
        className
      )}
    >
      {bookingUiStateList.map((state, i) => (
        <BookingEntry
          key={`${state.date}${state.startingTime}`}
          bookingState={state}
          shouldDisplayDivider={i != 0}
          index={i}
          onBook={onBook}
          userRole={userRole}
        />
      ))}
    </div>
  );
}

function BookingEntry({
  bookingState,
  shouldDisplayDivider,
  index,
  onBook,
  userRole,
  className = "",
}: {
  bookingState: InspectionBookingListUiState;
  shouldDisplayDivider: boolean;
  index: number;
  onBook: (index: number) => void;
  userRole?: Role;
  className?: string;
}): React.JSX.Element {
  // Only tenants can book inspections
  const canBookInspection = userRole === Role.TENANT;

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
        {canBookInspection ? (
          <BookingButton index={index} onClick={onBook} />
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
  className = "",
}: {
  index: number;
  onClick: (index: number) => void;
  className?: string;
}): React.JSX.Element {
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
