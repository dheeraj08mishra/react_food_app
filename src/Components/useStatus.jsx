import { useState } from "react";

const useStatus = () => {
  const [currentState, setCurrentState] = useState("Login");
  const toggle = () => {
    setCurrentState((prevState) => {
      if (prevState === "Login") {
        return "Logout";
      } else {
        return "Login";
      }
    });
  };
  return [currentState, toggle];
};

export default useStatus;
