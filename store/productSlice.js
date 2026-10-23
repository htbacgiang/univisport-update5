import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorIndex: 0,
  size: null,
  quantity: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setColorIndex: (state, action) => {
      state.colorIndex = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    incrementQuantity: (state) => {
      state.quantity += 1;
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) state.quantity -= 1;
    },
    resetSelection: (state) => {
      state.colorIndex = 0;
      state.size = null;
      state.quantity = 1;
    },
  },
});

export const {
  setColorIndex,
  setSize,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  resetSelection,
} = productSlice.actions;

export default productSlice.reducer;
