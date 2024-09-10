import { React, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "../App.css";
import Header from "./Components/Header";
// import Body from "./Components/Body";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import About from "./Components/About";
// import Contact from "./Components/Contact";
import Cart from "./Components/Cart";
import ErrorDetails from "./Components/ErrorDetails";
import RestaurantDetails from "./Components/RestaurantDetails";
import Shimmer from "./Components/Shimmer";

const Contact = lazy(() => import("./Components/Contact"));
const Body = lazy(() => import("./Components/Body"));
const AppLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Shimmer />}>
            <Body />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        // element: <Suspense fallback={<Contact />}></Suspense>,
        element: (
          <Suspense fallback={<Shimmer />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/restaurant/:id",
        element: <RestaurantDetails />,
      },
    ],
    errorElement: <ErrorDetails />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
