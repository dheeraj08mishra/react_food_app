import React, { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import UserContext from "../utils/UserContext";

function User() {
  const [userData, setUserData] = useState(null); // use null initially to handle the Shimmer correctly
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/" + loggedInUser
        );
        const data = await response.json();
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!userData) return <Shimmer />;

  const { name, avatar_url, login, location, company, public_repos } = userData;

  return (
    <div className="card-container">
      <div className="card">
        <img src={avatar_url} alt={name} />
        <div className="card-content">
          <h3>Name: {name}</h3>
          <h3>UserId: {login}</h3>
        </div>
        <div className="card-footer">
          <div className="rating">
            <h4>Company: {company || "N/A"}</h4>
          </div>
          <div className="cost">
            <h4>Location: {location || "N/A"}</h4>
          </div>
          <div>
            <h4>Repositories:{public_repos}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
