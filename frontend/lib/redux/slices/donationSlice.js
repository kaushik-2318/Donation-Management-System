import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"



const initialState = {
  donations: [],
  loading: false,
  error: null,
}

export const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    setDonations: (state, action) => {
      state.donations = action.payload
      state.loading = false
      state.error = null
    },
    addDonation: (state, action) => {
      state.donations.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setDonations, addDonation, setLoading, setError } = donationSlice.actions

export const selectDonations = (state) => state.donation.donations
export const selectDonationLoading = (state) => state.donation.loading
export const selectDonationError = (state) => state.donation.error

export default donationSlice.reducer

