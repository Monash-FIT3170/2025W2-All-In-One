import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { homePageSlice } from "./ui-modules/home-example/state/reducers/home-page-slice";
<<<<<<< HEAD
import { agentDashboardSlice } from "./ui-modules/agent-dashboard/state/agent-dashboard-slice";
export const store = configureStore({
  reducer: {
    exampleHomePage: homePageSlice.reducer,
    agentDashboard: agentDashboardSlice.reducer,
=======
import { guestLandingPageSlice } from "./ui-modules/guest-landing-page/state/reducers/guest-landing-page-slice";
export const store = configureStore({
  reducer: {
    guestLandingPage: guestLandingPageSlice.reducer,
    exampleHomePage: homePageSlice.reducer,
>>>>>>> 281d9377111a8f3fc64bbb6487ee9ebb9ac1151c
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
<<<<<<< HEAD
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;



// Add type-safe hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
=======
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
>>>>>>> 281d9377111a8f3fc64bbb6487ee9ebb9ac1151c
