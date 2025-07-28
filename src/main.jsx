import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import D_Home from "./admin/D_Home";
import Dashboard from "./admin/Dashboard";
import Items from "./admin/Item";
import ItemTab from "./admin/ItemTab";
import Order from "./admin/Order";
import Restaurent from "./admin/Restaurent";
import User from "./admin/User";
import Agents from "./admin/Agents";

import AgentDashboard from "./Agent/AgentDashboard";
import DeliveryLayout from "./Agent/DeliveryLayout";
import Login from "./Agent/Login";
import Register from "./Agent/Register";

import App from "./App";
import FoodDetails from "./components/admin/FoodDetails";
import Cart from "./components/user/Cart";
import { CartProvider } from "./components/user/CartContext"; // Import the provider
import PaymentFailed from "./components/user/PaymentFailed";
import PaymentSuccess from "./components/user/PaymentSuccess";
import Resdetails from "./components/user/Resdetails";
import RestaurantsByItem from "./components/user/RestaurantsByItem";
import "./index.css";
import Profile from "./pages/Profile";
import Home from "./User/Home";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        children: [
          { path: "/", element: <Home /> },
          { path: "/cart", element: <Cart /> },
          { path: "/profile", element: <Profile /> },
          { path: "/:id", element: <Resdetails /> },
          { path: "/restaurants", element: <RestaurantsByItem /> },
          { path: "/payment-success", element: <PaymentSuccess /> },
          { path: "/payment-failed", element: <PaymentFailed /> },
        ],
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { path: "/dashboard/d_home", element: <D_Home /> },
          { path: "/dashboard/restaurent", element: <Restaurent /> },
          { path: "/dashboard/restaurent/:id", element: <FoodDetails /> },
          { path: "/dashboard/orders", element: <Order /> },
          { path: "/dashboard/items", element: <Items /> },
          { path: "/dashboard/user", element: <User /> },
          { path: "/dashboard/agents", element: <Agents /> },
          { path: "/dashboard/itemtab", element: <ItemTab /> },
        ],
      },
      {
        path: "/delivery",
        children: [
          { path: "/delivery", element: <DeliveryLayout /> },
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
          { path: "dashboard", element: <AgentDashboard /> }, // Main Dashboard
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
  // </StrictMode>
);
