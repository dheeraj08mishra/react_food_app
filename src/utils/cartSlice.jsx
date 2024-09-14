import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    restaurantId: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, restaurantId } = action.payload;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        // Clear cart if different restaurant
        state.items = [];
        state.restaurantId = restaurantId;
      } else if (!state.restaurantId) {
        state.restaurantId = restaurantId;
      }

      // Add or update item in cart
      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // New item, add to cart
        state.items.push(action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item from cart if quantity is 1
          state.items.splice(itemIndex, 1);
          if (state.items.length === 0) {
            state.restaurantId = null;
          }
        }
      }
    },
  },
});

export const { addToCart, clearCart, incrementQuantity, decrementQuantity } =
  cartSlice.actions;
export const selectItems = (state) => state.cart.items;
export const selectRestaurantId = (state) => state.cart.restaurantId;
export const selectTotal = (state) =>
  state.cart.items.reduce(
    (total, item) =>
      total + (item.price || item.defaultPrice || 0) * item.quantity,
    0
  );

export default cartSlice.reducer;
