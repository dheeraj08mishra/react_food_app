import { useEffect, useState, useContext } from "react";
import LocationContext from "../utils/LocationContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationOfGps, setLocationOfGps] = useState("");
  const { lat, lng, setLocation } = useContext(LocationContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
        .catch((error) => console.error("Error fetching location:", error));
    }
  }, [lat, lng]); // ✅ Use lat & lng separately in the dependency array

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

  return (
    <>
      <button onClick={toggleSidebar}>☰</button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ✖
        </button>
        <div className="gps-info">
          <button onClick={getLocation}>Get Current Location using GPS</button>
        </div>
        <div>
          <input type="text" placeholder={locationOfGps} readOnly />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
