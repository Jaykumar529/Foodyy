import axios from "axios";
import { useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [otp, setOtp] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(); // fetch every 5 seconds
    }, 5000); // 5000ms = 5s, you can reduce if needed

    return () => clearInterval(interval); // clear interval on unmount
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAcceptOrder = async (order) => {
    const loggedInAgent = JSON.parse(localStorage.getItem("agentData"));

    if (!loggedInAgent) {
      alert("Agent not logged in!");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8080/orders/${order._id}`, {
        OrderStatus: "Pending", // mark it as taken but not shipped
        agentDetails: {
          name: loggedInAgent.agentName,
          agentId: loggedInAgent._id,
        },
      });

      // Update state locally without full refresh
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === order._id
            ? {
                ...o,
                OrderStatus: "Pending",
                agentDetails: {
                  name: loggedInAgent.agentName,
                  agentId: loggedInAgent._id,
                },
              }
            : o
        )
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleGenerateOtp = async (orderId) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/orders/${orderId}/ship`
      );
      alert(response.data.message);
      setSelectedOrderId(orderId); // open OTP input modal
      fetchOrders();
    } catch (error) {
      console.error("Error generating OTP:", error);
      alert("Failed to generate OTP");
    }
  };



  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/orders/verify", {
        orderId: selectedOrderId,
        otp: otp.trim(),
      });
      console.log("response", response);

      alert(response.data.message);
      setOtp("");
      console.log("setOtp:", setOtp);

      setSelectedOrderId(null);
      fetchOrders(); // Refresh order list
    } catch (error) {
      alert(error.response?.data?.error || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">
        Agent Dashboard
        <span
          className="text-black cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <TiArrowBack size={25} />
        </span>
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Order ID: {order._id}
              </h2>
              <p className="text-gray-600">
                <strong>Customer:</strong> {order.userName}
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> {order.Address}
              </p>
              <p className="mt-2 text-black">
                <strong>Restaurant:</strong> {order.restaurantName} (
                {order.restaurantLocation})
              </p>
              <p className="text-gray-700">
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <div className="mt-2">
                <h3 className="font-semibold text-black">Ordered Items:</h3>
                {order.OrderedItems.map((item, index) => (
                  <p key={index} className="text-gray-600">
                    {item.name} - {item.quantity} x ₹{item.price}
                  </p>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                {order.OrderStatus === "New" && (
                  <>
                    <button
                      className="bg-green-500 text-whitex px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => handleAcceptOrder(order)}
                    >
                      Take Order
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() =>
                        console.log(`Rejected order: ${order._id}`)
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {order.OrderStatus === "Pending" &&
                  order.agentDetails?.agentId ===
                    JSON.parse(localStorage.getItem("agentData"))?._id && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      onClick={() => handleGenerateOtp(order._id)}
                    >
                      Ship Order & Generate OTP
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No new orders available</p>
        )}
      </div>

      {/* OTP Verification Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Enter Delivery OTP
            </h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full text-gray-700"
              placeholder="Enter OTP"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setSelectedOrderId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;

