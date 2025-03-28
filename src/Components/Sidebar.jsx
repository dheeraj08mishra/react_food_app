import { useEffect, useState, useContext } from "react";
import LocationContext from "../utils/LocationContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationOfGps, setLocationOfGps] = useState("");
  const { lat, lng, setLocation } = useContext(LocationContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setSearchValue("");
    setSearchResults([]);
    setIsOpen(!isOpen);
  };

  const autoCompleteSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchValue.length > 3) {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=pk.b68c2554caa228b0114602c1b5b12649&q=${searchValue}&limit=20`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setSearchResults(Array.isArray(data) ? data : []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching location:", error);
            setSearchResults([]); // Ensure fallback is an empty array
            setLoading(false);
          });
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  useEffect(() => {
    if (lat && lng) {
      fetch(
        `https://www.swiggy.com/dapi/misc/address-recommend?latlng=${lat},${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.data?.length > 0) {
            setLocationOfGps(data.data[0].formatted_address);
          } else {
            setLocationOfGps("Location not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching location)", error);
          setSearchResults([]); // Clear results on error
          alert("Failed to fetch locations. Please try again.");
        });
    }
  }, [lat, lng]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prevLocation) => ({
            ...prevLocation,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

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
      <button className="text-button" onClick={toggleSidebar}>
        {locationOfGps}⬇︎
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ✖
        </button>

        <div className="sidebar-content">
          <input
            type="text"
            placeholder="Search for restaurants"
            value={searchValue}
            onChange={autoCompleteSearch}
          />
        </div>

        {/* Search results dropdown */}
        <div className="search-results">
          <ul>
            {loading ? (
              <p>Loading...</p>
            ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li
                  key={result.osm_id}
                  onClick={() => handleSelectResult(result)}
                >
                  {result.display_name}
                </li>
              ))
            ) : (
              searchValue.length > 3 && <p>No results found</p>
            )}
          </ul>
        </div>

        <div className="gps-info">
          <button onClick={getLocation}>Get Current Location using GPS</button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
