import React from "react";
import { BedDouble, Bath, DoorOpen, CalendarDays } from "lucide-react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import { useNavigate } from "react-router";

import { PropertyWithListingData } from "../../../library-modules/use-cases/property-listing/models/PropertyWithListingData";

function getNextInspectionDateString(inspections?: { start_time: string }[]): string {
    if (!inspections || inspections.length === 0) {
        return "No upcoming inspections";
    }

    const now = new Date();
    const futureInspections = inspections
        .filter(inspection => {
            const inspectionDate = new Date(inspection.start_time);
            return inspectionDate > now;
        })
        .sort((a, b) => {
            const dateA = new Date(a.start_time);
            const dateB = new Date(b.start_time);
            return dateA.getTime() - dateB.getTime();
        });

    if (futureInspections.length === 0) {
        return "No upcoming inspections";
    }

    // Extract date part from ISO string (format "YYYY-MM-DDTHH:MM:SS.sssZ")
    const dateString = futureInspections[0].start_time.split('T')[0];
    return dateString;
}

export function PropertyCard(props: PropertyWithListingData) {
    const {
        propertyId,
        streetnumber,
        streetname,
        suburb,
        postcode,
        pricePerMonth,
        propertyStatus,
        bathrooms,
        bedrooms,
        image_urls,
        inspections,
    } = props;

    const address = `${streetnumber} ${streetname}`;
    const weeklyPrice = ((pricePerMonth) / 4).toFixed(0);
    const navigate = useNavigate();

    const displayImageUrl = image_urls?.[0];

    const nextInspectionDate = getNextInspectionDateString(inspections);

    const handleClick = () => {
        if (propertyId) {
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
                    src={displayImageUrl}
                    alt={`Property at ${address}`}
                    className="h-48 w-full object-cover"
                />
                <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold truncate" title={address}>
                        {address}
                    </h2>

                    <p className="text-sm text-gray-600">{suburb}, {postcode} </p>

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
                            <span>{nextInspectionDate}</span>
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
