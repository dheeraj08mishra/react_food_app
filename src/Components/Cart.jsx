import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CDN_url } from "../utils/constants";
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../utils/cartSlice";

function Cart() {
  const cardItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Calculate total price
  const totalPrice = cardItems.reduce((total, item) => {
    const price = (item.price || item.defaultPrice || 0) / 100; // Default to 0 if price is undefined
    return total + price * item.quantity;
  }, 0);

  const handleClearCart = () => {
    console.log("Cart cleared by dispatching action");
    dispatch(clearCart());
  };

  return (
    <>
      {cardItems.length === 0 && <h2>No items in cart</h2>}
      <button className="clear-cart" onClick={handleClearCart}>
        Clear Cart
      </button>
      <div className="recommended-container">
        {cardItems.map((item) => {
          const { name, imageId, description, ratings, id, quantity } = item;
          return (
            <li key={id} className="recommended-item">
              <div className="recommended-item-content">
                <h2>{name}</h2>
                <p>{description}</p>
                <h4 className="price">
                  Price:{" "}
                  <span className="price-value">
                    ₹{(item.price || item.defaultPrice) / 100}
                  </span>
                </h4>
                <h4 className="rating">
                  {ratings?.aggregatedRating?.rating && (
                    <>
                      <span className="rating-star">★</span>
                      {ratings.aggregatedRating.rating}
                      {` (${ratings.aggregatedRating.ratingCountV2})`}
                    </>
                  )}
                </h4>
                <div className="quantity-control">
                  <button
                    className="decrement"
                    onClick={() => dispatch(decrementQuantity(id))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="increment"
                    onClick={() => dispatch(incrementQuantity(id))}
                  >
                    +
                  </button>
                </div>
              </div>
              {imageId && <img src={CDN_url + imageId} alt={name} />}
            </li>
          );
        })}
      </div>

      {/* Total Price Section */}
      {cardItems.length > 0 && (
        <div className="total-price">
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
        </div>
      )}
    </>
  );
}

export default Cart;
