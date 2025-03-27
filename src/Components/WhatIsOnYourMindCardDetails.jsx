import React, { useEffect, useState, useId } from "react";
import { useParams } from "react-router-dom";
import Restcard from "./Restcard";

const WhatIsOnYourMindCardDetails = () => {
  const { collectionId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.4967245478821&lng=73.75084452331068&collection=" +
            collectionId +
            "&tags=&sortBy=&filters=&type=rcv2&offset=0&page_type=null"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setTitle(result?.data?.cards?.[0]?.card?.card?.title);
        let filteredData = result?.data?.cards.filter((data, index) => {
          return index !== 0 && index !== 1;
        });
        setData(filteredData);
        setDescription(result?.data?.cards?.[0]?.card?.card?.description);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [collectionId]);

  return (
    <div>
      <div className="what-on-mind-container">
        <h1>
          {title}
          {description ? " - " + description : ""}
        </h1>

        <div className="card-container">
          {data &&
            data.map((currentRow) => (
              <Restcard
                key={currentRow?.card?.card?.info.id}
                restaurant={currentRow?.card?.card}
                toApplyCssClass={"card"}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export default WhatIsOnYourMindCardDetails;
