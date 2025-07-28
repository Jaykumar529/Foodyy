import { loadStripe } from "@stripe/stripe-js";
import React, { useContext, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "./CartContext";

const stripePromise = loadStripe(
  "pk_test_51QzBf2FvmFq0yBQzSHZION931WtHIgNHWCXJJwTMtMTo0JFrtZ2pxlTze2ESMNUKFMdRlYvUKEyyKzBnIKSKnJiR00qnqMtYFg"
);

const Cart = () => {
  const [address, setAddress] = useState("");
  const { cart, removeFromCart, updateCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.count),
    0
  );
  const deliveryCharge = totalPrice > 100 ? 0 : 25;
  const grandTotal = totalPrice + deliveryCharge;

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error("Please enter your address before proceeding to checkout.");
      return;
    }

    const token = localStorage.getItem("token");
    const stripe = await stripePromise;

    const selectedRestaurant = {
      name: cart[0].restaurantName,
      location: cart[0].restaurantLocation,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cart: cart.map((item) => ({
              name: item.name,
              price: item.price,
              count: item.count,
            })),
            deliveryCharge,
            address,
            selectedRestaurant,
          }),
        }
      );

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Checkout error:", errorMessage);
        toast.error("Something went wrong during checkout.");
        return;
      }

      const session = await response.json();
      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        toast.error("Failed to initiate payment session. Please try again.");
      }
    } catch (error) {
      console.error("Checkout exception:", error);
      toast.error("Unable to process checkout. Please try again later.");
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-3xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <span className="text-black" onClick={() => navigate(-1)}>
        <TiArrowBack size={25} />
      </span>
      <h1 className="text-3xl text-gray-800 font-bold mb-6 text-center">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          {/* Address Input Field */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Delivery Address:
            </label>
            <textarea
              className="w-full p-2 border rounded-md text-black"
              rows="3"
              placeholder="Enter your address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <table className="w-full text-gray-800 table-auto border-collapse shadow-md border-2">
            <thead>
              <tr className="bg-[#FAE8DC] rounded-xl">
                <th className="px-6 py-3 border border-gray-500">Item Image</th>
                <th
                  className="px-6 py-
                3 border border-gray-500"
                >
                  Name
                </th>
                <th className="px-6 py-3 border border-gray-500">Price</th>
                <th className="px-6 py-3 border border-gray-500">Count</th>
                <th className="px-6 py-3 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all">
                  <td className="px-6 py-4 border border-gray-500">
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 border border-gray-500 font-semibold">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 border border-gray-500 font-semibold">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 border border-gray-500 text-center font-semibold flex justify-center items-center space-x-2">
                    <button
                      onClick={() => updateCartCount(item._id, item.count - 1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="px-4">{item.count}</span>
                    <button
                      onClick={() => updateCartCount(item._id, item.count + 1)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </td>
                  <td className="px-6 py-4 border border-gray-500 text-center">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Price Summary  */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold text-gray-700">
              Price Summary
            </h2>
            <div className="flex justify-between mt-2 text-lg">
              <span>Total Price:</span>
              <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 text-lg">
              <span>Delivery Charge:</span>
              <span className="font-semibold">
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>
            <hr className="my-2 border-gray-300" />
            <div className="flex justify-between text-xl font-bold">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment button toggle if signup/logged in */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-gray-100 flex justify-center">
            <button
              className="bg-[#0c821f] rounded-md h-9 w-24 font-semibold text-lg"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
