export interface ApiLandlordDashboard {
    totalPropertyCount: number;
    propertyStatusCounts: {
        occupied:number;
        vacant: number;
    };
    totalIncome: {
        weekly: number;
        monthly: number;
    };
    occupancyRate: number;
    averageRent: {
        occupiedCount: number;
        rent: number;
    };
}