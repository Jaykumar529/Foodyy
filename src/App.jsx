import React, {useState} from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/user/Navbar"; 

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard"); // Hide navbar for dashboard
  const hide = location.pathname.startsWith("/delivery"); // Hide navbar for dashboard

  return (
    <>
        {!hideNavbar && !hide &&(
          <Navbar />
        )}
        <Outlet />
    </>
  );
};

export default App;
