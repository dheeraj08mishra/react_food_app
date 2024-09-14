import React, { useState, useEffect } from "react";
import logoImage from "../../Assets/image.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useOnlineStatus from "./useOnlineStatus";

const Header = () => {
  const online = useOnlineStatus();

  const cartItem = useSelector((state) => state.cart.items);
  console.log(cartItem);

  return (
    <div className="container">
      <div>
        <Link to="/">
          {" "}
          <img src={logoImage} alt="logo" />{" "}
        </Link>
      </div>
      <div className="navBar">
        <nav>
          <ul>
            <button
              className={`status-button ${online ? "online" : "offline"}`}
            >
              {online ? "Online" : "Offline"}
            </button>
            <li>
              <Link to="/">Home </Link>
            </li>
            {/* <li>
              <Link to="/about">About </Link>
            </li> */}
            <li>
              <Link to="/cart">Cart({cartItem.length} items) </Link>
            </li>
            <li>
              <Link to="/contact">Contact </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
