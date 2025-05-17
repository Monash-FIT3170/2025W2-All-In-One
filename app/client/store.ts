import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { homePageSlice } from "./ui-modules/home-example/state/reducers/home-page-slice";
import { agentDashboardSlice } from "./ui-modules/role-dashboard/agent-dashboard/state/agent-dashboard-slice";
import { landlordDashboardSlice } from "./ui-modules/role-dashboard/landlord-dashboard/state/landlord-dashboard-slice";
import { guestLandingPageSlice } from "./ui-modules/guest-landing-page/state/reducers/guest-landing-page-slice";
import { settingsPageSlice } from "./ui-modules/settings-page/state/reducers/settings-page-slice";
import { profileSlice } from "./ui-modules/profiles/state/profile-slice";
import { loginFormSlice } from "./ui-modules/user-authentication/state/reducers/login-form-slice";
import { signupFormSlice } from "./ui-modules/user-authentication/state/reducers/signup-form-slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { propertyListingSlice } from "/app/client/ui-modules/property-listing-page/state/reducers/property-listing-slice";
import { tenantDashboardSlice } from "./ui-modules/role-dashboard/tenant-dashboard/state/tenant-dashboard-slice";
import { currentUserSlice } from "./ui-modules/user-authentication/state/reducers/current-user-slice";

export const store = configureStore({
  reducer: {
    exampleHomePage: homePageSlice.reducer,
    agentDashboard: agentDashboardSlice.reducer,
    tenantDashboard: tenantDashboardSlice.reducer,
    guestLandingPage: guestLandingPageSlice.reducer,
    settingsPage: settingsPageSlice.reducer,
    landlordDashboard: landlordDashboardSlice.reducer,
    profile: profileSlice.reducer,
    loginForm: loginFormSlice.reducer,
    propertyListing: propertyListingSlice.reducer,
    signupForm: signupFormSlice.reducer,
    currentUser: currentUserSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

// Add type-safe hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
