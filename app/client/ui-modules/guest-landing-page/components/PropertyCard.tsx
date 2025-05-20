import React from "react";
import { CardWidget } from "../../role-dashboard/components/CardWidget";
import { ApiProperty } from "../../../../shared/api-models/property/ApiProperty";

export function PropertyCard({
    propertyId,
    streetnumber,
    streetname,
    suburb,
    province,
    postcode,
    pricePerMonth,
    propertyStatus,
    description,
    bathrooms,
    bedrooms,
    parking,
    features,
    area,
}: ApiProperty) {
    const address = `${streetnumber} ${streetname}, ${suburb}`;
    return (
        <CardWidget
            title={address}
            value={`$${pricePerMonth} / month`}
            className="w-full max-w-sm overflow-hidden"
        >
            <img
                src={`/images/properties/${propertyId}.jpg`}
                alt={address}
                className="h-48 w-full object-cover rounded-t-lg"
            />
            <p className="text-sm text-gray-600 mt-2">
                {bedrooms} bed • {bathrooms} bath • {propertyStatus}
            </p>
            <ul className="text-sm text-gray-500 mt-1">
                <li><strong>Parking:</strong> {parking}</li>
                <li><strong>Features:</strong> {features.join(", ")}</li>
                <li><strong>Area:</strong> {area} sqft</li>
            </ul>
        </CardWidget>
    );
}
