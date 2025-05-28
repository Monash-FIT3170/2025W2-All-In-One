import { apiPropertyInsertPrice } from "../../apis/property-price/price-api";

export const insertPropertyPrice = async (
    propertyId: string,
    price: number
): Promise<string> => {
    return await apiPropertyInsertPrice(propertyId, price);
};