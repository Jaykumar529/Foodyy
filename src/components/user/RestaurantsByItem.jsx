import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { toast, Toaster } from "react-hot-toast";

const RestaurantsByItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("name");

  useEffect(() => {
    if (!productName) return;
    fetch(`http://127.0.0.1:8080/getRestaurantByProduct?name=${productName}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          toast.error(`No restaurants found for "${productName}"`);
        }
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch restaurant data!");
      });
  }, [productName]);

  const openRestaurantDetails = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <TiArrowBack size={22} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center flex-1">
            Restaurants Serving{" "}
            <span className="text-red-500">{productName}</span>
          </h1>
        </div>

        {restaurants.length === 0 ? (
          <p className="text-center text-gray-500 text-base py-10">
            No restaurants found 🍽️
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 p-5 flex flex-col items-center text-center"
              >
                <img
                  src={restaurant.dishImage}
                  alt={restaurant.name}
                  className="w-24 h-24 object-cover rounded-full shadow-md mb-4"
                />
                <h2 className="text-md font-semibold text-gray-800 mb-1">
                  {restaurant.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {restaurant.location}
                </p>
                <button
                  onClick={() => openRestaurantDetails(restaurant._id)}
                  className="bg-orange-400 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition"
                >
                  View Menu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsByItem;
