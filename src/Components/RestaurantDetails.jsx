import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import AccordionItem from "./AccordionItem";
import { CDN_url } from "../utils/constants";
import "./RestaurantDetails.css";

function RestaurantDetails() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch(
        "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=18.61610&lng=73.72860&restaurantId=" +
          id
      );
      const data = await response.json();
      setMenu(data?.data?.cards || []);
    };

    fetchMenu();
  }, [id]);

  if (menu.length === 0) {
    return <Shimmer />;
  }

  const recommended = menu[4]?.groupedCard?.cardGroupMap?.REGULAR.cards.filter(
    (cardsData) => {
      return (
        cardsData.card.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
      );
    }
  );

  const completeListToShow =
    menu[4]?.groupedCard?.cardGroupMap?.REGULAR.cards.filter((cardsData) => {
      return (
        cardsData.card.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.NestedItemCategory"
      );
    });

  const handleClickShow = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle accordion
  };

  return (
    <>
      <div className="recommended-container">
        {recommended.map((data, index) => (
          <AccordionItem
            key={index}
            title={`${data?.card?.card?.title} (${data?.card?.card?.itemCards.length})`}
            content={data?.card?.card?.itemCards?.map((current) => {
              const {
                name,
                imageId,
                description,
                price,
                defaultPrice,
                ratings,
                id,
              } = current.card.info;
              return (
                <li key={id} className="recommended-item">
                  <div className="recommended-item-content">
                    <h2>{name}</h2>
                    <p>{description}</p>
                    <h4 className="price">
                      Price:{" "}
                      <span className="price-value">
                        ₹{price / 100 || defaultPrice / 100}
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
                    <button className="addButton">Add</button>
                  </div>

                  {imageId ? (
                    <img src={CDN_url + imageId} alt={name} />
                  ) : (
                    <div></div>
                  )}
                </li>
              );
            })}
            index={index}
            activeIndex={activeIndex}
            onClick={handleClickShow}
          />
        ))}
      </div>

      <div className="complete-list-container">
        {completeListToShow.map((data, index) => (
          <AccordionItem
            key={index}
            title={data?.card?.card?.title}
            content={data.card.card.categories.map((category, catIndex) => (
              <React.Fragment key={catIndex}>
                <h3>
                  {category.title} ({category.itemCards.length})
                </h3>
                <ul>
                  {category.itemCards?.map((item, itemIndex) => {
                    const {
                      name,
                      imageId,
                      description,
                      price,
                      defaultPrice,
                      ratings,
                    } = item.card.info;
                    return (
                      <li key={itemIndex} className="recommended-item">
                        <div className="recommended-item-content">
                          <h2>{name}</h2>
                          <p>{description}</p>
                          <h4 className="price">
                            Price:{" "}
                            <span className="price-value">
                              ₹{price / 100 || defaultPrice / 100}
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
                          <button className="addButton">Add</button>
                        </div>
                        {imageId ? (
                          <img src={CDN_url + imageId} alt={name} />
                        ) : (
                          <div></div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </React.Fragment>
            ))}
            index={index + recommended.length} // To prevent index conflicts
            activeIndex={activeIndex}
            onClick={handleClickShow}
          />
        ))}
      </div>
    </>
  );
}

export default RestaurantDetails;
