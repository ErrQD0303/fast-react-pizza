import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Reduxjs/toolkit creating a thunk function
export const fetchAddress = createAsyncThunk(
  // action type's name
  "user/fetchAddress",
  // actual thunk function
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    // Payload of the FULFILLED state
    return { position, address };
  },
);

const initialState = {
  username: "",
  // Use status convention: 'loading', 'idle', 'error' respectively the result of pending, fulfilled, error state of the async thunk
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  // addCase(<async thunk>.<current state>, reducer) -> builder(fluent interface)
  // Use extraReducers to handle newly created async thunk 3 states: pending, fulfilled, rejected
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        // the result of pending state handling is 'loading'
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        // the result of fulfilled state handling is 'idle'
        // action.payload is the return of the async thunk
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        // action.error is the error which is throw when executing the async thunk function
        state.error =
          "There was a problem getting your address. Make sure to fill this field!";
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

export const getUser = (state) => state.user;
