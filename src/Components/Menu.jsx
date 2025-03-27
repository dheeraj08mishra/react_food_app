import { CDN_image_url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementFromCart, clearCart } from "../utils/cartSlice";
import Dialog from "./Dialog";
import { useState } from "react";

const Menu = ({ items, restaurantDetailsMenu, restaurantId }) => {
  const {
    name,
    imageId,
    description,
    price,
    defaultPrice,
    ratings,
    id,
    itemAttribute,
  } = items.card.info;

  const dispatch = useDispatch();
  const quantity = useSelector(
    (state) => state.cart.items.find((item) => item.id === id)?.quantity || 0
  );

  let cartRestaurantId = useSelector((state) => state.cart.restaurantId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const handleIncrement = () => {
    if (cartRestaurantId !== restaurantId && cartRestaurantId !== null) {
      setPendingItem(id);
      setIsDialogOpen(true);
      return;
    }

    addItemToCart();
  };

  const addItemToCart = () => {
    let updatedItem = restaurantDetailsMenu.flatMap((item) => {
      if (item?.card?.card?.itemCards?.length) {
        return item.card.card.itemCards.filter(
          (item) => item.card.info.id === id
        );
      }
      if (item?.card?.card?.categories?.length) {
        return item.card.card.categories.flatMap((category) =>
          category?.itemCards?.filter((item) => item.card.info.id === id)
        );
      }
      return [];
    });

    const uniqueItems = [
      ...new Map(updatedItem.map((item) => [item.card.info.id, item])).values(),
    ];

    let actionForAddToCart = {
      itemId: id,
      uniqueItemAdded: uniqueItems,
      restaurantId: restaurantId,
      restaurantDetailsMenu: restaurantDetailsMenu,
    };

    dispatch(addToCart(actionForAddToCart));
  };

  const handleDecrement = () => {
    dispatch(decrementFromCart({ itemId: id }));
  };

  const handleClearCartAndAddItem = () => {
    dispatch(clearCart());
    setIsDialogOpen(false);
    if (pendingItem === id) {
      addItemToCart();
      setPendingItem(null);
    }
  };

  return (
    <>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Cart Conflict"
      >
        <p>
          Your cart contains items from a different restaurant. Do you want to
          clear the cart and add this item?
        </p>
        <button onClick={handleClearCartAndAddItem}>Yes</button>
        <button onClick={() => setIsDialogOpen(false)}>No</button>
      </Dialog>

      <div className="recommended-item">
        <div key={id} className="recommended-item-content">
          <h2>{name}</h2>
          <p>{description}</p>
          {/* <span>
            {itemAttribute.vegClassifier.toUpperCase() === "NONVEG" ? (
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Indian_non-vegetarian_mark.svg/1024px-Indian_non-vegetarian_mark.svg.png" />
            ) : (
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1024px-Veg_symbol.svg.png" />
            )}
          </span> */}
          <div className="price-rating">
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
          </div>
        </div>
        <div className="menu-card-image">
          {imageId ? <img src={CDN_image_url + imageId} alt={name} /> : <></>}

          <div className="quantity-control">
            <button onClick={handleDecrement} className="decrement">
              -
            </button>
            <span>{quantity}</span>
            <button onClick={handleIncrement} className="increment">
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
