import { Link } from "react-router-dom";
const WhatIsOnYourMindCard = ({ curatedCard }) => {
  const { imageId, action } = curatedCard;

  const collectionId = action?.link?.split("?")[0].split("/").pop();

  return (
    <div className="mind-card">
      <Link to={`/collections/${collectionId}`} className="card-link">
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/${imageId}`}
          alt={action?.text || "Image"}
        />
      </Link>
    </div>
  );
};

export default WhatIsOnYourMindCard;
