import React from "react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import { ApiProperty } from "../../../../shared/api-models/property/ApiProperty";

export function PropertyCard({
    propertyId,
    streetnumber,
    streetname,
    suburb,
    pricePerMonth,
    propertyStatus,
    bathrooms,
    bedrooms,
}: ApiProperty) {
    const address = `${streetnumber} ${streetname}`;
    const availability = propertyStatus === "Available now" ? "Available now" : propertyStatus;

    return (
        <CardWidget
            className="w-full max-w-sm overflow-hidden"
            title={address}
            value={`$${(pricePerMonth / 4).toFixed(0)} per week`}
        >
            <img
                src={`/images/properties/${propertyId}.jpg`}
                alt={address}
                className="h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-4">
                <h2 className="text-lg font-semibold">{address}</h2>
                <p className="text-sm text-gray-600 mt-1">
                    {bedrooms} bed • {bathrooms} bath • {availability}
                </p>
                <p className="text-md font-semibold mt-2">${(pricePerMonth / 4).toFixed(0)} per week</p>
            </div>
        </CardWidget>
    );
}
