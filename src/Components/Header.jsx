import React from "react";
import logoImage from "../../Assets/image.png";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const Header = () => {
  const cartItem = useSelector((state) => state.cart.items);
  const quantity = cartItem.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container">
      <div className="navBar">
        <nav>
          <ul>
            <li>
              <Link to="/">
                <img src={logoImage} alt="Food Logo" />
              </Link>
            </li>
            <li>
              <Sidebar />
            </li>
          </ul>
        </nav>
      </div>
      <div className="navBar">
        <nav>
          <ul>
            <li>
              <Link to="/User">{"Contact Us"}</Link>
            </li>
            <li>
              <Link to="/cart" className="cart-link">
                <FaShoppingCart
                  className={`cart-icon ${quantity > 0 ? "cart-bounce" : ""}`}
                />
                {quantity > 0 && <span className="cart-count">{quantity}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
