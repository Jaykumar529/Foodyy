import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { TiArrowBack } from "react-icons/ti";
import { toast, Toaster } from "react-hot-toast";

const Resdetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [getdata, setGetdata] = useState(null);
  const [dish, setDish] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/getDbResItem/${id}`)
      .then((res) => res.json())
      .then((data) => setGetdata(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/getDbDishes/${id}`)
      .then((res) => res.json())
      .then((data) => setDish(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  const handleAddToCart = (dishItem) => {
    const cartItem = {
      ...dishItem,
      restaurantName: getdata.name,
      restaurantLocation: getdata.location,
    };
    addToCart(cartItem);
    toast.success(`${dishItem.name} added to cart!`);
  };

  if (!dish || !getdata) {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-500">
        Loading deliciousness...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl bg-white">
        <div className="backdrop-blur-sm bg-white/80 border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <TiArrowBack size={22} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-normal text-gray-800">
            {getdata.name}
          </h1>
        </div>

        <div className="text-center py-6 px-4">
          <p className="text-gray-500 text-2xl font-light italic">
            “Farm-to-table cuisine served with warmth.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {dish.map((dishItem, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="p-5 flex flex-col items-center text-center">
                <img
                  src={dishItem.imageURL}
                  alt={dishItem.name}
                  className="h-28 w-28 object-cover rounded-full shadow-sm"
                />
                <h3 className="text-lg font-semibold mt-4 text-gray-800">
                  {dishItem.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">₹{dishItem.price}</p>
                <span
                  className={`text-xs font-semibold ${
                    dishItem.status === "Available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {dishItem.status}
                </span>
              </div>
              <button
                onClick={() => handleAddToCart(dishItem)}
                className="w-full bg-orange-400 text-white py-4 rounded-b-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition"
              >
                <ShoppingBag size={18} />
                <span className="text-sm">Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resdetails;
