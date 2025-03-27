import { createSlice, current } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    restaurantId: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { itemId, uniqueItemAdded, restaurantId, restaurantDetailsMenu } =
        action.payload;
      state.restaurantId = restaurantId;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({
          id: itemId,
          quantity: 1,
          uniqueItemAdded,
          restaurantDetailsMenu,
          restaurantId,
        });
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
    },
    decrementFromCart: (state, action) => {
      const { itemId } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity -= 1;
        if (state.items[itemIndex].quantity === 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
    },
  },
});

export const { addToCart, clearCart, decrementFromCart } = cartSlice.actions;
export const selectTotalPrice = (state) => {
  return state
    .reduce((total, item) => {
      return (
        total +
        ((item.uniqueItemAdded[0].card.info.price ||
          item.uniqueItemAdded[0].card.info.defaultPrice ||
          0) /
          100) *
          item.quantity
      );
    }, 0)
    .toFixed(2);
};
export const selectRestaurantId = (state) => state.cart.restaurantId;
export default cartSlice.reducer;
