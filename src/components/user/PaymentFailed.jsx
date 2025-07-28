import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect user to the cart after 5 seconds
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-black">
      <h1>Payment Failed ❌</h1>
      <p>Oops! Something went wrong with your payment.</p>
      <p>Redirecting you to the cart page...</p>
    </div>
  );
};

export default PaymentFailed;
