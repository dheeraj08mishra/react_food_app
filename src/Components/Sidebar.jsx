import { useEffect, useState, useContext } from "react";
import LocationContext from "../utils/LocationContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationOfGps, setLocationOfGps] = useState("Select Location");
  const { lat, lng, setLocation } = useContext(LocationContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSearchValue("");
    setSearchResults([]);
    setIsOpen((prev) => !prev);
  };

  // Handle Search Input Change
  const autoCompleteSearch = (e) => {
    setSearchValue(e.target.value);
  };

  // Close Sidebar on Escape Key Press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch Search Suggestions (AutoComplete API)
  useEffect(() => {
    if (searchValue.length > 3) {
      setLoading(true);
      setError("");

      const timeoutId = setTimeout(() => {
        fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=pk.b68c2554caa228b0114602c1b5b12649&q=${searchValue}&limit=20`
        )
          .then((response) => response.json())
          .then((data) => {
            setSearchResults(Array.isArray(data) ? data : []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching location:", error);
            setError("Failed to fetch location suggestions.");
            setSearchResults([]);
            setLoading(false);
          });
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  // Fetch Current Location Address using Lat & Lng
  useEffect(() => {
    if (lat && lng) {
      fetch(
        `https://www.swiggy.com/dapi/misc/address-recommend?latlng=${lat},${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.data?.length > 0) {
            const formattedAddress = data.data[0].formatted_address;
            setLocationOfGps(formattedAddress);
            setSearchValue(formattedAddress);
            setSearchResults([]);
            setIsOpen(false);
          } else {
            setLocationOfGps("Location not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
          setError("Failed to fetch current location.");
          setSearchResults([]);
        });
    }
  }, [lat, lng]);

  // Get Current Location using GPS
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to retrieve location. Please try again.");
      }
    );
  };

  // Handle Search Result Selection
  const handleSelectResult = (result) => {
    setLocation({
      lat: result.lat,
      lng: result.lon,
    });
    setSearchValue(result.display_name);
    setLocationOfGps(result.display_name);
    setSearchResults([]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="text-button" onClick={toggleSidebar}>
        {locationOfGps} ⬇︎
      </button>

      {/* Sidebar Component */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Close Button */}
        <button className="close-btn" onClick={toggleSidebar}>
          ✖
        </button>

        {/* Search Input */}
        <div className="sidebar-content">
          <input
            type="text"
            placeholder="Search for places..."
            value={searchValue}
            onChange={autoCompleteSearch}
          />
        </div>

        {/* Search Results */}
        <div className="search-results">
          <ul>
            {loading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && searchResults.length > 0
              ? searchResults.map((result) => (
                  <li
                    key={result.osm_id}
                    onClick={() => handleSelectResult(result)}
                  >
                    {result.display_name}
                  </li>
                ))
              : searchValue.length > 3 && <p></p>}
          </ul>
        </div>

        {/* GPS Location Button */}
        <div className="gps-info">
          <button onClick={getLocation}>Get Current Location using GPS</button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
