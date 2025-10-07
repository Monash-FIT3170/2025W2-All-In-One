import React from "react";
import { BedDouble, Bath, DoorOpen, CalendarDays } from "lucide-react";
import { CardWidget } from "../../common/CardWidget";
import { useNavigate } from "react-router";
import { getFormattedDateStringFromDate } from "../../../library-modules/utils/date-utils";
import { PropertyWithListingData } from "../../../library-modules/use-cases/property-listing/models/PropertyWithListingData";

function getNextPropertyListingInspectionDateString(
  propertyListingInspections: { start_time: Date }[] = []
): string {
  if (propertyListingInspections.length === 0) {
    return "No upcoming inspections";
  }

  const now = new Date();
  const futurePropertyListingInspections = propertyListingInspections
    .filter((inspection) => inspection.start_time > now)
    .sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

  if (futurePropertyListingInspections.length === 0) {
    return "No upcoming inspections";
  }

  return getFormattedDateStringFromDate(
    futurePropertyListingInspections[0].start_time
  );
}

export function PropertyCard(props: PropertyWithListingData) {
  const {
    propertyId,
    streetnumber,
    streetname,
    suburb,
    postcode,
    apartment_number,
    pricePerMonth,
    propertyStatus,
    bathrooms,
    bedrooms,
    image_urls,
    propertyListingInspections,
  } = props;

  const address = apartment_number
    ? `${apartment_number} ${streetnumber} ${streetname}`
    : `${streetnumber} ${streetname}`;
  const weeklyPrice = (pricePerMonth / 4).toFixed(0);
  const navigate = useNavigate();

  const displayImageUrl = image_urls?.[0];

  const nextPropertyListingInspectionDate =
    getNextPropertyListingInspectionDateString(propertyListingInspections);

  const handleClick = () => {
    if (propertyId) {
      navigate(`/property-listing?propertyId=${propertyId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full cursor-pointer block hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg"
    >
      <CardWidget
        className="w-full overflow-hidden h-full flex flex-col text-center"
        title=""
        value=""
      >
        <div className="relative">
          <img
            src={displayImageUrl}
            alt={`Property at ${address}`}
            className="h-48 w-full object-cover"
          />
          {/* Status pill */}
          {propertyStatus && (
            <span
              className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md
                                ${propertyStatus === "VACANT" ? "bg-green-600 text-white" : ""}
                                ${propertyStatus === "OCCUPIED" ? "bg-red-500 text-white" : ""}
                            `}
              style={{ zIndex: 2 }}
            >
              {propertyStatus}
            </span>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h2 className="text-lg font-semibold truncate" title={address}>
            {address}
          </h2>

          <p className="text-sm text-gray-600">
            {suburb}, {postcode}{" "}
          </p>

          <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{nextPropertyListingInspectionDate}</span>
            </div>
          </div>

          <p className="text-md font-semibold mt-3">${weeklyPrice} per week</p>
        </div>
      </CardWidget>
    </div>
  );
}
