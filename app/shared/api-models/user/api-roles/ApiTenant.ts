import { ApiProfileData } from "./ApiProfileData";

export type ApiTenant = {
    tenantId: string; // pk
    userAccountId: string; // id for the user account - used for auth/admin purposes only
    tasks: string[]; // array of task ids
    createdAt: Date;
    profileDataId: string;
};
