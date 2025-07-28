import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "./CartContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [userEmail, setUserEmail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!sessionId || hasFetched) return;

    setHasFetched(true);
    const controller = new AbortController();

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8080/check-payment-status?session_id=${sessionId}`,
          { withCredentials: true, signal: controller.signal }
        );

        if (response.data.status === "paid") {
          setPaymentStatus("paid");
          clearCart();

          const sessionResponse = await axios.get(
            `http://127.0.0.1:8080/get-session-details?session_id=${sessionId}`,
            { withCredentials: true, signal: controller.signal }
          );

          const { customer_email, line_items, metadata } = sessionResponse.data;
          setUserEmail(customer_email);
          // console.log("Customer Email:", customer_email); // Debugging

          const existingOrdersResponse = await axios.get(
            `http://127.0.0.1:8080/getOrders/${customer_email}`,
            { signal: controller.signal }
          );

          const existingOrders = existingOrdersResponse.data;
          // console.log("Fetched Existing Orders:", existingOrders); // Debugging

          // ✅ Prevent duplicate order creation using localStorage
          const processedSessions =
            JSON.parse(localStorage.getItem("processedSessions")) || [];
          if (processedSessions.includes(sessionId)) {
            setOrders(existingOrders); // If already processed, just set existing orders
            return;
          }
          processedSessions.push(sessionId);
          localStorage.setItem(
            "processedSessions",
            JSON.stringify(processedSessions)
          );

          // ✅ Check if the order already exists in the backend
          if (!existingOrders.some((order) => order.OrderId === sessionId)) {
            const newOrder = {
              OrderId: sessionId,
              userName: metadata.userName,
              mailId: customer_email,
              Address: metadata.address,
              OrderedItems: line_items.map((item) => ({
                name: item.description || "Unknown Item",
                price: item.price?.unit_amount
                  ? item.price.unit_amount / 100
                  : 0,
                quantity: item.quantity ?? 1,
              })),
              totalAmount: line_items.reduce(
                (acc, item) =>
                  acc +
                  ((item.price?.unit_amount ?? 0) / 100) * (item.quantity ?? 1),
                0
              ),
              PaymentStatus: "paid",
              OrderStatus: "processing",
              action: "pending",
              restaurantName: metadata.restaurantName,
              restaurantLocation: metadata.restaurantLocation,
            };

            await axios.post("http://127.0.0.1:8080/createOrder", newOrder, {
              withCredentials: true,
              signal: controller.signal,
            });

            await axios.post(
              "http://127.0.0.1:8080/send-payment-success-email",
              { sessionId },
              { withCredentials: true, signal: controller.signal }
            );

            // ✅ Ensure new order is reflected
            setOrders([...existingOrders, newOrder]);
          } else {
            setOrders(existingOrders);
          }
        } else {
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error.message);
        setPaymentStatus("failed");
      }
    };

    checkPaymentStatus();

    return () => {
      controller.abort();
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {paymentStatus === "pending" && (
          <p className="text-lg text-gray-700 text-center">
            Checking payment status...
          </p>
        )}

        {paymentStatus === "paid" && (
          <>
            <h1 className="text-3xl font-bold text-green-600 text-center">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-600 text-center">
              A confirmation email has been sent to
              <span className="font-semibold"> {userEmail}</span>.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              Your Orders
            </h2>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4"
                >
                  <h3 className="text-lg text-gray-800">
                    <strong className="font-semibold text-xl">
                      {" "}
                      Order ID:
                    </strong>{" "}
                    {order.OrderId}
                  </h3>
                  <p className="text-gray-600">User: {order.userName}</p>
                  {/* <p className="text-black">Action: {order.action}</p> */}
                  <p className="text-gray-600">
                    Restaurant: {order.restaurantName} (
                    {order.restaurantLocation})
                  </p>
                  <p className="text-gray-600">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-4">No orders found.</p>
            )}

            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Go Back to Home
            </button>
          </>
        )}

        {paymentStatus === "failed" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
            <p className="text-gray-600">Please try again.</p>
            <button
              onClick={() => navigate("/cart")}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Retry Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
