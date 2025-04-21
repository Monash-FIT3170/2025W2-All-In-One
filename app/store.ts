import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { homePageSlice } from "../ui-modules/home-example/state/reducers/home-page-slice";
import aboutPageReducer from "../ui-modules/about/state/reducers/about-page-slice";
export const store = configureStore({
  reducer: {
    homePage: homePageSlice.reducer,
    aboutPage: aboutPageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;