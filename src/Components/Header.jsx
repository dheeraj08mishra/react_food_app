import React, { useState, useEffect } from "react";
import logoImage from "../../Assets/image.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };

    const handleOffline = () => {
      setOnline(false);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="container">
      <div>
        <img src={logoImage} alt="logo" />
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
            <li>
              <Link to="/about">About </Link>
            </li>
            <li>
              <Link to="/cart">Cart </Link>
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
