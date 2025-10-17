import React, { useEffect, useState } from "react";
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
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../theming-shadcn/Dialog";
import { apiGetProfileByTenantId } from "/app/client/library-modules/apis/user/user-account-api";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";

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
  onBook: (inspectionId: string) => void; 
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
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [tenantProfiles, setTenantProfiles] = useState<
    { id: string; name: string }[]
  >([]);

  const canBook = userRole === Role.TENANT;
  const isThisInspectionBooked =
    !!tenantId && bookingState.tenant_ids.includes(tenantId);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!isAgentModalOpen || bookingState.tenant_ids.length === 0) return;

      try {
        const profiles = await Promise.all(
          bookingState.tenant_ids.map(async (id) => {
            try {
              const tenant = await getTenantById(id);
              if (!tenant) return null;

              const profile = await apiGetProfileByTenantId(tenant.tenantId);
              if (!profile) return null;

              return {
                id,
                name: `${profile.firstName} ${profile.lastName}`,
              };
            } catch (err) {
              console.warn(`Failed to fetch tenant profile for ${id}`, err);
              return null;
            }
          })
        );

        setTenantProfiles(
          profiles.filter((p): p is { id: string; name: string } => p !== null)
        );
      } catch (err) {
        console.error("Error fetching tenant profiles:", err);
        setTenantProfiles([]);
      }
    };

    fetchProfiles();
  }, [isAgentModalOpen, bookingState.tenant_ids]);

  return (
    <>
      <div
        className={twMerge(
          "flex flex-col",
          className,
          userRole === Role.AGENT ? "cursor-pointer hover:bg-gray-100" : ""
        )}
        onClick={
          userRole === Role.AGENT ? () => setIsAgentModalOpen(true) : undefined
        }
      >
        {shouldDisplayDivider ? <Divider /> : null}

        <div className="flex flex-row items-center">
          <BookingDateTime
            date={bookingState.date}
            startingTime={bookingState.startingTime}
            endingTime={bookingState.endingTime}
            className="mr-auto"
          />
          <CalendarIcon className="w-[22px] h-[20px] mr-6" />

          {/* Tenant booking buttons */}
          {canBook ? (
            isThisInspectionBooked ? (
              <BookingButton
                inspectionId={bookingState._id}
                onClick={() => onBook(bookingState._id)}
                isBooked={true}
              />
            ) : !tenantHasBooking ? (
              <BookingButton
                inspectionId={bookingState._id}
                onClick={() => onBook(bookingState._id)}
                isBooked={false}
              />
            ) : (
              <div className="text-sm text-gray-500 italic">
                You have already booked an inspection for this property
              </div>
            )
          ) : (
            <div className="text-sm text-gray-500 italic">
              {userRole === Role.AGENT
                ? "Click the tile to view applied tenants"
                : userRole === Role.LANDLORD
                  ? "Landlords cannot book inspections"
                  : "Login as tenant to book"}
            </div>
          )}
        </div>
      </div>

      {/* Agent-only tenant list modal */}
      {userRole === Role.AGENT && (
        <Dialog open={isAgentModalOpen} onOpenChange={setIsAgentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Applied Tenants</DialogTitle>
            </DialogHeader>
            <ul className="space-y-2 mt-4">
              {tenantProfiles.length > 0 ? (
                tenantProfiles.map((profile) => (
                  <li
                    key={profile.id}
                    className="p-2 rounded-md bg-gray-50 border border-gray-200"
                  >
                    <div className="text-sm text-gray-700">
                      Tenant Name: {profile.name}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No tenants have booked yet.
                </p>
              )}
            </ul>
          </DialogContent>
        </Dialog>
      )}
    </>
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
