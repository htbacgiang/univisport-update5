import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const { id } = action.payload;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    // Dùng để load danh sách từ database vào Redux
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
