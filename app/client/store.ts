import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { homePageSlice } from "./client/ui-modules/home-example/state/reducers/home-page-slice";
import { guestLandingPageSlice } from "./client/ui-modules/guest-landing-page/state/reducers/guest-landing-page-slice";

export const store = configureStore({
  reducer: {
    guestLandingPage: guestLandingPageSlice.reducer,
    exampleHomePage: homePageSlice.reducer,
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
