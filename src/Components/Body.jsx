import CardDetails from "./CardDetails";
import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useStatus from "./useStatus";
import useResponse from "./useResponse";

const Body = () => {
  // State to manage the data to be displayed (filtered or full)
  const [dataToShow, setDataToShow] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, toggleStatus] = useStatus(); // Custom hook to toggle login/logout status

  // Fetch the initial data using custom hook
  const { data } = useResponse();

  // Update dataToShow with the full dataset when data changes
  useEffect(() => {
    setDataToShow(data); // Populate dataToShow with the fetched data initially
  }, [data]);

  // Function to filter top-rated restaurants (rating > 4.4)
  const showTopRated = () => {
    const filteredData = data.filter((current) => current.avgRating > 4.4);
    setDataToShow(filteredData);
  };

  // Restore initial state of the data by resetting search value and data
  const restoreData = () => {
    setSearchValue("");
    setDataToShow(data); // Reset to full dataset
  };

  // Handle search input changes
  const inputValueForFetch = (event) => {
    setSearchValue(event.target.value);
  };

  // Filter restaurants by search input (restaurant name)
  const searchUpdatedClick = () => {
    const filteredData = data.filter((currentRow) =>
      currentRow.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDataToShow(filteredData);
  };

  return (
    <>
      {/* Search input and buttons */}
      <input
        type="text"
        placeholder="Search...."
        onChange={inputValueForFetch}
        value={searchValue}
      />
      <button onClick={searchUpdatedClick}>Search</button>
      <button onClick={showTopRated}>Top Rated</button>
      <button onClick={restoreData}>Reset</button>
      <button onClick={toggleStatus}>{status}</button>{" "}
      {/* Toggle login/logout status */}
      {/* Display shimmer or card data */}
      <div
        className={`card-container ${
          dataToShow.length < data.length ? "filtered" : ""
        }`}
      >
        {dataToShow.length === 0 ? (
          <Shimmer />
        ) : (
          dataToShow.map((currentRow) => (
            <Link key={currentRow.id} to={"/restaurant/" + currentRow.id}>
              <CardDetails data={currentRow} />
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default Body;
