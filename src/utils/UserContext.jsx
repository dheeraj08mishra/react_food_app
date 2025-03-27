import { createContext } from "react";
const UserContext = createContext({
  loggedInUser: "dheeraj08mishra",
  userName: "Dheeraj Mishra",
  userLocation: "Pune",
});
export default UserContext;
