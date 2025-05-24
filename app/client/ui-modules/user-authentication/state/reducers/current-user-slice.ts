import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserState } from "../CurrentUserState";
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getUserAccountById } from "../../../../library-modules/domain-models/user/user-account-repositories/user-account-repository";
import { getAgentById } from "../../../../library-modules/domain-models/user/role-repositories/agent-repository";
import { getTenantById } from "../../../../library-modules/domain-models/user/role-repositories/tenant-repository";
import { getLandlordById } from "../../../../library-modules/domain-models/user/role-repositories/landlord-repository";
import { Role } from "/app/shared/user-role-identifier";
import { AppDispatch, RootState } from "/app/client/store";

type RoleProfile = Agent | Tenant | Landlord;

const initialState: CurrentUserState = {
  authUser: null,
  currentUser: null,
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<UserAccount>) {
      state.authUser = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<RoleProfile>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.authUser = null;
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCurrentUser.fulfilled, (state, action) => {
      state.authUser = action.payload.authUser;
      state.currentUser = action.payload.currentUser;
    });
  },
});

export const loadCurrentUser = createAsyncThunk<
  { authUser: UserAccount; currentUser: RoleProfile },
  string, // input (authenticated userId)
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("currentUser/load", async (userId, { rejectWithValue }) => {
  try {
    const authUser = await getUserAccountById(userId);

    let currentUser: RoleProfile;
    switch (authUser.role) {
      case Role.AGENT:
        currentUser = await getAgentById(userId);
        break;
      case Role.TENANT:
        currentUser = await getTenantById(userId);
        break;
      case Role.LANDLORD:
        currentUser = await getLandlordById(userId);
        break;
      default:
        throw new Error(`Unknown role: ${authUser.role}`);
    }

    // TODO: TO BE REMOVED - JUST FOR TESTING!
    console.log("[CurrentUser Loaded]", {
      authUser,
      currentUser,
    });

    return { authUser, currentUser };
  } catch (err: any) {
    console.error("Failed to load current user:", err);
    return rejectWithValue(err.message || "Failed to load current user.");
  }
});

// Method to logout the current user
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      Meteor.logout((error) => {
        if (error) {
          console.error("Logout failed:", error);
          const errorMessage =
            (error as Meteor.Error)?.reason ||
            error.message ||
            "Logout failed.";
          reject(rejectWithValue(errorMessage));
        } else {
          dispatch(clearCurrentUser());
          resolve();
        }
      });
    });
  }
);

export const { setAuthUser, setCurrentUser, clearCurrentUser } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
