import React, { useEffect, useState, useId } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";

import AccordionItem from "./AccordionItem";
import Menu from "./Menu";

function RestaurantDetails() {
  const uniqueId = useId();
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
          "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory" ||
        cardsData.card.card?.["@type"] ===
          "type.googleapis.com/swiggy.presentation.food.v2.NestedItemCategory"
      );
    }
  );

  const handleClickShow = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  let indexToPass = 0;

  return (
    <>
      <div className="recommended-container">
        {recommended.map((data, index) =>
          data?.card?.card?.itemCards?.length ? (
            <AccordionItem
              key={index + "_" + uniqueId}
              title={`${data?.card?.card?.title} (${data?.card?.card?.itemCards?.length})`}
              index={indexToPass++}
              activeIndex={activeIndex}
              onClick={handleClickShow}
              content={data?.card?.card?.itemCards?.map((current) => {
                return (
                  <Menu
                    key={current.card.info.id}
                    items={current}
                    className="recommended-item"
                    restaurantDetailsMenu={recommended}
                    restaurantId={id}
                  />
                );
              })}
            />
          ) : (
            data?.card?.card?.categories?.length &&
            data?.card?.card?.categories?.map((category, newIndex) => (
              <AccordionItem
                key={category?.categoryId}
                title={`${category?.title} (${category?.itemCards?.length})`}
                index={indexToPass++}
                activeIndex={activeIndex}
                onClick={handleClickShow}
                content={category?.itemCards?.map((current) => {
                  return (
                    <Menu
                      key={current.card.info.id}
                      items={current}
                      restaurantDetailsMenu={recommended}
                      restaurantId={id}
                    />
                  );
                })}
              />
            ))
          )
        )}
      </div>
    </>
  );
}

export default RestaurantDetails;
