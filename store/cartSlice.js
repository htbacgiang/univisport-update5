import { createSlice } from "@reduxjs/toolkit";

// Key duy nhất cho mỗi variant sản phẩm
const variantKey = (item) =>
  `${item.product}__${item.color || ""}__${item.size || ""}`;

const recalcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const initialState = {
  cartItems: [],
  cartTotal: 0,
  coupon: "",
  discount: 0,
  totalAfterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (!Array.isArray(state.cartItems)) state.cartItems = [];
      const key = variantKey(action.payload);
      const idx = state.cartItems.findIndex((i) => variantKey(i) === key);
      if (idx >= 0) {
        state.cartItems[idx].quantity += action.payload.quantity;
      } else {
        state.cartItems.push({ ...action.payload });
      }
      state.cartTotal = recalcTotal(state.cartItems);
    },

    removeFromCart: (state, action) => {
      if (!Array.isArray(state.cartItems)) return;
      const key = variantKey(action.payload);
      state.cartItems = state.cartItems.filter((i) => variantKey(i) !== key);
      state.cartTotal = recalcTotal(state.cartItems);
    },

    increaseQuantity: (state, action) => {
      if (!Array.isArray(state.cartItems)) return;
      const key = variantKey(action.payload);
      const idx = state.cartItems.findIndex((i) => variantKey(i) === key);
      if (idx >= 0) {
        state.cartItems[idx].quantity += 1;
        state.cartTotal += state.cartItems[idx].price;
      }
    },

    decreaseQuantity: (state, action) => {
      if (!Array.isArray(state.cartItems)) return;
      const key = variantKey(action.payload);
      const idx = state.cartItems.findIndex((i) => variantKey(i) === key);
      if (idx >= 0) {
        if (state.cartItems[idx].quantity > 1) {
          state.cartItems[idx].quantity -= 1;
          state.cartTotal -= state.cartItems[idx].price;
        } else {
          state.cartItems.splice(idx, 1);
          state.cartTotal = recalcTotal(state.cartItems);
        }
      }
    },

    setCart: (state, action) => {
      state.cartItems = action.payload.products ?? [];
      state.cartTotal = action.payload.cartTotal ?? 0;
      state.coupon = action.payload.coupon ?? "";
      state.discount = action.payload.discount ?? 0;
      state.totalAfterDiscount =
        action.payload.totalAfterDiscount ?? state.cartTotal;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotal = 0;
      state.coupon = "";
      state.discount = 0;
      state.totalAfterDiscount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
