import { createContext, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ lat: 18.6161, lng: 73.7286 });

  return (
    <LocationContext.Provider value={{ ...location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
