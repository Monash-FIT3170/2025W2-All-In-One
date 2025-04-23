import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { homePageSlice } from "./ui-modules/home-example/state/reducers/home-page-slice";
import { tenantDashboardSlice } from "./ui-modules/tenant-dashboard/state/tenant-dashboard-slice";
export const store = configureStore({
  reducer: {
    exampleHomePage: homePageSlice.reducer,
    tenantDashboard: tenantDashboardSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;



// Add type-safe hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;