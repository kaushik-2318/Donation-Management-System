import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import donationReducer from "./slices/donationSlice"
import postReducer from "./slices/postSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donation: donationReducer,
    post: postReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

