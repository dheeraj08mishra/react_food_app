import { React, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "../App.css";
import Header from "./Components/Header";
import Body from "./Components/Body";
import ErrorDetails from "./Components/ErrorDetails";
import Shimmer from "./Components/Shimmer";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Cart from "./Components/Cart";
import { LocationProvider } from "./utils/LocationContext";

const UserDetails = lazy(() => import("./Components/User"));
const RestaurantDetails = lazy(() => import("./Components/RestaurantDetails"));
const WhatIsOnYourMindCardDetails = lazy(() =>
  import("./Components/WhatIsOnYourMindCardDetails")
);

const App = () => {
  return (
    <Provider store={appStore}>
      <LocationProvider>
        <div>
          <Header />
          <Outlet />
        </div>
      </LocationProvider>
    </Provider>
  );
};

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Body /> },
      {
        path: "/user",
        element: (
          <Suspense fallback={<Shimmer />}>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "/restaurant/:id",
        element: (
          <Suspense fallback={<Shimmer />}>
            <RestaurantDetails />
          </Suspense>
        ),
      },
      {
        path: "/collections/:collectionId",
        element: (
          <Suspense fallback={<Shimmer />}>
            <WhatIsOnYourMindCardDetails />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<Shimmer />}>
            <Cart />
          </Suspense>
        ),
      },
    ],
    errorElement: <ErrorDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={BrowserRouter} />
);
