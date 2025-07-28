import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/Navbar";

const Dashboard = () => {

  return (
    <div
      className="rounded-lg "
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <div className="flex bg-[#f19924] ">
        <h1 className="text-4xl ml-8 pt-2 pb-2 font-bold text-center">
          <span className="text-orange-700">Food</span>
          <span className="text-white">yy</span>
        </h1>
      </div>
      <div className="flex w-full h-[6.66in] ">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};


export default Dashboard;
