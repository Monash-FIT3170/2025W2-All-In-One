import React from "react";
import { BedDouble, Bath, DoorOpen, CalendarDays } from "lucide-react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import { ApiProperty } from "../../../../shared/api-models/property/ApiProperty";
import { ApiInspection } from "../../../../shared/api-models/property/ApiInspection";
import { prepareForLoad } from "../../property-listing-page/state/reducers/property-listing-slice";
import { useAppDispatch } from "../../../store";
import { useNavigate } from "react-router";
import { getFormattedDateStringFromDate } from "../../../library-modules/utils/date-utils";

function getNextInspectionDateString(inspections?: ApiInspection[]): string {
    if (!inspections || inspections.length === 0) {
        return "No upcoming inspections";
    }

    const now = new Date();
    const upcomingInspections = inspections
        .map(inspection_item => ({
            ...inspection_item,
            start_time: new Date(inspection_item.start_time),
        }))
        .filter(inspection_item => !isNaN(inspection_item.start_time.getTime()) && inspection_item.start_time > now)
        .sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

    if (upcomingInspections.length === 0) {
        return "No upcoming inspections";
    }

    const nextInspection = upcomingInspections[0];
    return getFormattedDateStringFromDate(nextInspection.start_time);
}

export function PropertyCard({
    propertyId,
    streetnumber,
    streetname,
    suburb,
    pricePerMonth,
    propertyStatus,
    bathrooms,
    bedrooms,
    imageUrls,
    inspections,
}: ApiProperty) {
    const address = `${streetnumber} ${streetname}`; 
    const weeklyPrice = (pricePerMonth / 4).toFixed(0);
    const displayImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/images/default-property-image.jpg";
    const nextInspectionDateString = getNextInspectionDateString(inspections);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClick = () => {
        if (propertyId) { 
            dispatch(prepareForLoad(propertyId));
            navigate(`/property-listing?propertyId=${propertyId}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer block hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg"
        >
            <CardWidget
                className="w-full max-w-sm overflow-hidden h-full flex flex-col text-center"
                title=""
                value=""
            >
                <img
                    src={displayImage}
                    alt={`Property at ${address}`}
                    className="h-48 w-full object-cover"
                />
                <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold truncate" title={address}>
                        {address}
                    </h2>

                    <p className="text-sm text-gray-600">{suburb}, 4000</p>

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
                            <span>{nextInspectionDateString}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <DoorOpen className="w-4 h-4" />
                            <span>{propertyStatus}</span>
                        </div>
                    </div>

                    <p className="text-md font-semibold mt-3">
                        ${weeklyPrice} per week
                    </p>
                </div>
            </CardWidget>
        </div>
    );
}
