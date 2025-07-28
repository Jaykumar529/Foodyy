import axios from "axios";
import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/orders/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, OrderStatus: newStatus } : order
          )
        );
         fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filterStatus = selectStatus
    ? orders.filter((item) => item.OrderStatus === selectStatus)
    : orders;

  return (
    // overflow-y-scroll
    <div className="w-full p-6 bg-gradient-to-r from-gray-300 via-white to-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📦 Order Management
      </h2>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <p className="text-lg font-semibold text-gray-700">Filter by status:</p>
        {["", "New", "Pending", "Delivered", "Canceled"].map(
          (status, index) => (
            <button
              key={index}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectStatus === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectStatus(status)}
            >
              {status || "All"}
            </button>
          )
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-gray-600 text-lg">🚫 No orders available</div>
      ) : (
        //
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 max-h-[490px]">
          <table className="w-full table-auto text-sm text-gray-200">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Restaurant</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterStatus.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-700 text-black hover:text-white transition"
                >
                  <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 group relative">
                    <span>{item._id.slice(0, 10)}...</span>
                    <span className="absolute z-10 hidden group-hover:block top-full left-0 mt-1 bg-slate-800 border text-xs rounded p-1 shadow">
                      {item._id}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.userName}</td>
                  <td className="px-4 py-3">{item.mailId}</td>
                  <td className="px-4 py-3">{item.Address}</td>
                  <td className="px-4 py-3">{item.restaurantName}</td>
                  <td className="px-4 py-3">{item.restaurantLocation}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    {item.OrderStatus}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.OrderStatus}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
