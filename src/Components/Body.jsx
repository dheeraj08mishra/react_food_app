import React, { useEffect, useState, useContext } from "react";
import Restcard from "./Restcard";
import WhatIsOnYourMindCard from "./WhatIsOnYourMindCard";
import Shimmer from "./Shimmer";
import UserContext from "../utils/UserContext";
import LocationContext from "../utils/LocationContext";
const Body = () => {
  const [data, setData] = useState(null);
  const [dataforFilter, setDataforFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [whatIsOnYourMindData, setWhatIsOnYourMindData] = useState(null);
  const [topRestaurantChainData, setTopRestaurantChainData] = useState(null);
  const [topRestaurantChainDataHeading, setTopRestaurantChainDataHeading] =
    useState("Top Restaurant Chain");
  const [onlineDeliveryRestaurantHeading, setOnlineDeliveryRestaurantHeading] =
    useState("Restaurants with online food delivery");

  const { userName } = useContext(UserContext);
  const { lat, lng } = useContext(LocationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(
          result?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants
        );
        setDataforFilter(
          result?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants
        );

        setWhatIsOnYourMindData(
          result?.data?.cards[0]?.card?.card?.imageGridCards?.info
        );
        setTopRestaurantChainData(
          result?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants
        );
        setTopRestaurantChainDataHeading(
          result?.data?.cards[1]?.card?.card?.header?.title
        );
        setOnlineDeliveryRestaurantHeading(
          result?.data?.cards[2]?.card?.card?.title
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lng]);

  const filterTopRated = () => {
    const topRated = dataforFilter.filter(
      (restaurant) => restaurant.info.avgRating > 3.5
    );
    setData(topRated);
  };
  const resetFilter = () => {
    setData(dataforFilter);
    setSearchValue("");
  };
  const loadMore = async () => {
    try {
      const response = await import("../utils/Response.json");
      const moreRestaurants =
        response[0].card.card.gridElements.infoWithStyle.restaurants;
      setData((prevData) => [...prevData, ...moreRestaurants]);
      setDataforFilter((prevData) => [...prevData, ...moreRestaurants]);
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  };

  const inputValueForFetch = (event) => {
    setSearchValue(event.target.value);
  };
  const searchUpdatedClick = () => {
    const filteredData = data.filter((currentRow) =>
      currentRow.info.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setData(filteredData);
  };

  return !data ? (
    <Shimmer />
  ) : (
    <>
      <input
        type="text"
        placeholder="Search...."
        onChange={inputValueForFetch}
        value={searchValue}
      />
      <button onClick={searchUpdatedClick}>Search</button>
      <button className="btn" onClick={filterTopRated}>
        Top Rated
      </button>
      <button className="btn" onClick={resetFilter}>
        Reset
      </button>
      <div className="what-on-mind-container">
        <h2>{userName} What's on your mind?</h2>
        <div className="what-on-mind-list">
          {whatIsOnYourMindData &&
            whatIsOnYourMindData.map((currentRow) => (
              <WhatIsOnYourMindCard
                key={currentRow.id}
                curatedCard={currentRow}
              />
            ))}
        </div>
      </div>
      <hr></hr>

      <h2>{topRestaurantChainDataHeading}</h2>
      <div className="what-on-mind-container">
        <div className="topCard-container">
          {topRestaurantChainData &&
            topRestaurantChainData.map((currentRow) => (
              <Restcard
                key={currentRow.info.id}
                restaurant={currentRow}
                toApplyCssClass={"topCard"}
              />
            ))}
        </div>
      </div>
      <hr></hr>
      <h2>{onlineDeliveryRestaurantHeading}</h2>
      <div className="card-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {data &&
          data.map((restaurantsData) => (
            <Restcard
              key={restaurantsData.info.id}
              restaurant={restaurantsData}
              toApplyCssClass={"card"}
            />
          ))}
      </div>
      <div>
        <button className="btn" onClick={loadMore}>
          Load More
        </button>
      </div>
    </>
  );
};

export default Body;
