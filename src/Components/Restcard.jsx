import { Link } from "react-router-dom";
const Restcard = ({ restaurant, toApplyCssClass }) => {
  const { cloudinaryImageId, name, sla, avgRating, cuisines, costForTwo, id } =
    restaurant.info;

  const extractNumericValue = (costString) => {
    const match = costString.match(/(\d+)/);
    return match ? Number(match[1]) : NaN;
  };

  const numericCostForTwo = extractNumericValue(costForTwo);
  return (
    <div className={toApplyCssClass}>
      <Link to={`/restaurant/${id}`} className="card-link">
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/${cloudinaryImageId}`}
          alt={name}
        />
      </Link>
      <div className="card-content">
        <h3>{name}</h3>
        <h4>{cuisines.join(",")}</h4>
      </div>
      <div className="card-footer">
        <div className="rating">
          <span className="rating-icon">⭐</span>
          <h4>{avgRating}</h4>
        </div>

        <div className="cost">
          <span className="cost-icon">₹</span>
          <h4>{numericCostForTwo} for two</h4>
        </div>
        <h4>{sla?.deliveryTime} min</h4>
      </div>
    </div>
  );
};
export default Restcard;
