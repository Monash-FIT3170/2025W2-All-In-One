export type LandlordDocument = {
    _id: string; // landlord id - primary key
    userAccountId: string; // id for the user account - used for auth/admin purposes only
    task_ids: string[]; // array of task ids
    createdAt: Date;
    profileDataId: string;
};
