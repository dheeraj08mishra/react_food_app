import { createContext } from "react";
const UserContext = createContext({
  loggedInUser: "dheeraj08mishra",
  userName: "Hello User",
  userLocation: "Pune",
});
export default UserContext;
