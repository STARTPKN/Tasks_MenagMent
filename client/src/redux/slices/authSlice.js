import { createSlice } from "@reduxjs/toolkit";
import { user } from "../../assets/data";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : user,

  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const userPayload = action.payload;
      // If we got a direct API response (with data.user and data.token)
      const rawUser = userPayload?.user ? userPayload.user : userPayload;
      const token = userPayload?.token ? userPayload.token : null;
      
      const userWithAdminFlag = {
        ...rawUser,
        isAdmin: rawUser?.role === "ADMIN" || rawUser?.isAdmin || false,
        token: token || rawUser?.token
      };

      state.user = userWithAdminFlag;
      localStorage.setItem("userInfo", JSON.stringify(userWithAdminFlag));
    },
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
