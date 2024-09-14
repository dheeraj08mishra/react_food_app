import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import AccordionItem from "./AccordionItem";
import { CDN_url } from "../utils/constants";
import "./RestaurantDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, selectRestaurantId } from "../utils/cartSlice";

function RestaurantDetails() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // const cartRestaurantId = useSelector(selectRestaurantId); // Get the restaurantId from the Redux store
  const dispatch = useDispatch();
  let cartRestaurantId = useSelector((state) => state.cart.restaurantId);
  console.log(
    "Current cart state:",
    useSelector((state) => state.cart)
  );

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
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleAddItems = (item, clickedId) => {
    console.log("Item added to cart by dispatching action");

    // Extract the item that matches the clicked ID
    let itemData = item.card.card.itemCards.filter((currentRecord) => {
      const { id } = currentRecord.card.info;
      return clickedId === id;
    });

    const selectedItem = itemData[0]; // Assuming only one matching item
    const itemToAdd = {
      ...selectedItem.card.info,
      restaurantId: id, // Store the restaurantId to compare for cart items
      quantity: 1, // Initialize with quantity 1
    };

    // Get current cart restaurant ID from the store

    // Check for items from a different restaurant
    if (cartRestaurantId && cartRestaurantId !== id) {
      if (
        window.confirm(
          "Your cart contains items from another restaurant. Do you want to clear the cart and add items from this restaurant?"
        )
      ) {
        // Clear the cart and add the new item
        dispatch(clearCart());
        dispatch(addToCart(itemToAdd));
      }
    } else {
      // Check if the cart is empty and add the item with the new restaurant ID if necessary
      if (cartRestaurantId === null || cartRestaurantId === id) {
        dispatch(addToCart(itemToAdd));
      } else {
        // If cart is not empty but restaurant ID is different, clear the cart first
        dispatch(clearCart());
        dispatch(addToCart(itemToAdd));
      }
    }
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
                    <button
                      className="addButton"
                      onClick={() => handleAddItems(data, id)}
                    >
                      Add
                    </button>
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
                          <button
                            className="addButton"
                            onClick={() => handleAddItems(item, id)}
                          >
                            Add
                          </button>
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
