import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, selectTotalPrice } from "../utils/cartSlice";
import Menu from "./Menu";
import { Link } from "react-router-dom";

function Cart() {
  const cardItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const checkoutMethod = () => {
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  return (
    <>
      {orderPlaced ? (
        <div className="order-confirmation">
          <h2>🎉 Order Placed Successfully! 🎉</h2>
          <p>Thank you for your order. Your delicious food is on its way! 🚀</p>
          <Link to="/">
            <button>Go to Home</button>
          </Link>
        </div>
      ) : cardItems.length === 0 ? (
        <div className="recommended-container">
          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" />
          <h2>Your Cart is Empty</h2>
          <Link to="/">
            <button> Browse Restaurants Near You </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="recommended-container">
            {cardItems.map((data) => (
              <Menu
                key={data.id}
                items={data.uniqueItemAdded[0]}
                restaurantDetailsMenu={data.restaurantDetailsMenu}
                restaurantId={data.restaurantId}
              />
            ))}
          </div>
          {cardItems.length > 0 && (
            <div className="total-price">
              <h3>Total Price: ₹{selectTotalPrice(cardItems)}</h3>
              <button className="checkout" onClick={checkoutMethod}>
                Checkout
              </button>
              <button className="clear-cart" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Cart;
