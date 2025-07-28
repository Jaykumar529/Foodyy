import React, { useRef, useState } from "react";
import Details from "../components/user/Details";
import Footer from "../components/user/Footer";
import Goslider from "../components/user/Goslider";
import Restaurant_nav from "../components/user/Restaurent_nav";
import { Search } from "lucide-react";
import SplitText from "../../ReactBits/SplitText/SplitText";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const restaurantNavRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      restaurantNavRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div id="home" className="w-full ">
      {/* lg:px-16 */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-16 py-8">
        <div className="lg:w-1/2 text-center lg:text-left">
          <p className="capitalize text-4xl md:text-5xl lg:text-6xl font-bold max-w-lg">
            <span className="text-black">Get Delicious Food</span>
            <span className="text-[#ff9f19]"> Instantly Delivered</span>
          </p>

          <p className="mt-6 text-lg text-gray-700 max-w-md">
            {/* "Savor delicious meals, perfect for every festival and occasion!" */}
            <SplitText
              text="Savor delicious meals, perfect for every festival and occasion!"
              className="text-2xl font-semibold text-left"
              delay={150}
              animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </p>

          {/* Search Bar */}
          <div className="flex justify-center lg:justify-start mt-6">
            <div
              className={`relative flex items-center bg-gradient-to-r from-gray-200 to-gray-100 shadow-lg rounded-full transition-all duration-500 ease-in-out ${
                isFocused ? "w-72" : "w-40 hover:w-52"
              }`}
            >
              <Search className="absolute left-3 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                onBlur={() => setIsFocused(false)}
                className="w-full py-3 pl-10 pr-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 rounded-full"
              />
            </div>
          </div>  
        </div>

        {/* Right Side Image */}
        <div className="lg:w-1/2 flex justify-center ">
          <img
            src="https://res.cloudinary.com/dtcqi6tgn/image/upload/v1742623317/homePage/htautifl5tkbzeiobq9t.png"
            alt="Food Delivery"
            className="w-[80%] md:w-[60%] lg:w-[75%] object-cover pb-5"
          />
        </div>
      </div>

      {/* Slider Section */}
      <Goslider />

      {/* Restaurant Navigation */}
      <div ref={restaurantNavRef}>
        <Restaurant_nav searchTerm={searchTerm} />
      </div>

      {/* Details & Footer */}
      <Details />
      <Footer />
    </div>
  );
};

export default Home;
