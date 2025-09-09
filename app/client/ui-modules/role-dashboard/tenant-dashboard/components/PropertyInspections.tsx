import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { Divider } from "/app/client/ui-modules/theming/components/Divider";
import { CalendarIcon } from "/app/client/ui-modules/theming/icons/CalendarIcon";
import { twMerge } from "tailwind-merge";
import { SubHeading } from "/app/client/ui-modules/theming/components/SubHeading";

export type InspectionBookingListUiState = {
  _id : string;
  date: string;
  startingTime: string;
  endingTime: string;
  tenant_ids: string[]; // array of tenant ids who have booked this inspection
};

export function PropertyInspections({
  bookingUiStateList,
  onBook,
  className = "",
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge("flex flex-col w-[520px]", className)}>
      <SubHeading text="Upcoming Annual Inspections" className="mb-2" />
      <InspectionBookingList
        bookingUiStateList={bookingUiStateList}
        onBook={onBook}
      />
    </div>
  );
}

function InspectionBookingList({
  bookingUiStateList,
  onBook,
  className,
}: {
  bookingUiStateList: InspectionBookingListUiState[];
  onBook: (index: number) => void;
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
  className = "",
}: {
  bookingState: InspectionBookingListUiState;
  shouldDisplayDivider: boolean;
  index: number;
  onBook: (index: number) => void;
  className?: string;
}): React.JSX.Element {
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
        <BookingButton index={index} onClick={onBook} />
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
