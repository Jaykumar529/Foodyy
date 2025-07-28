import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const CustomPrevArrow = ({ onClick }) => {
  return (
    <div
      className="custom-arrow custom-prev cursor-pointer p-2 md:p-3 rounded-full bg-orange-500 shadow-md hover:bg-orange-600 transition-all duration-300 ease-in-out flex items-center justify-center absolute z-10"
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        right: "80px",
        top: "0%",
        transform: "translateY(-50%)",
      }}
    >
      <ArrowLeft className="text-gray-500 hover:text-white" size={24} />
    </div>
  );
};

const CustomNextArrow = ({ onClick }) => {
  return (
    <div
      className="custom-arrow custom-next cursor-pointer p-2 md:p-3 rounded-full bg-orange-500 shadow-md hover:bg-orange-600 transition-all duration-300 ease-in-out flex items-center justify-center absolute z-10"
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        right: "20px",
        top: "0%",
        transform: "translateY(-50%)",
      }}
    >
      <ArrowRight className="text-gray-500 hover:text-white" size={24} />
    </div>
  );
};

const Goslider = () => {

  const settings = {
    centerMode: true,
    dots: true,
    centerPadding: "10px",
    infinite: true,
    speed: 1300,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  const [foodData, setFoodData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8080/getDbItem")
      .then((res) => res.json())
      .then((data) => setFoodData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleItemClick = (productName) => {
    navigate(`/restaurants?name=${productName}`);
  };

  return (
    <div className="w-full h-full pb-16 pt-16 bg-[#f7f7fa]" id="goslider">
      <p className="text-gray-800 text-3xl md:text-5xl lg:text-6xl text-center font-semibold">
        All Dishes
      </p>
      <div className="flex justify-center pt-8 md:pt-16">
        <Slider {...settings} className="w-[90vw]">
          {foodData.map((d, index) => (
            <div
              key={index}
              className="relative h-[400px] md:h-[500px] text-center flex flex-col items-center hover:rotate-1"
            >
              <div
                className="relative shadow-lg bg-white rounded-[20px] md:rounded-[30px] w-[260px] md:w-[320px] h-[260px] md:h-[320px] top-[100px] md:top-[140px] flex justify-center hover:scale-105 hover:shadow-slate-500 hover:shadow-md cursor-pointer "
                onClick={() => handleItemClick(d.name)}
              >
                <div className="absolute shadow-xl shadow-zinc-400 bottom-[140px] md:bottom-[180px] w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-full z-10 flex justify-center items-center">
                  <img
                    src={d.imageURL}
                    alt={d.name}
                    className="w-full h-full object-cover absolute rounded-full"
                  />
                </div>
                <div className="absolute bottom-0 w-full hover:bg-orange-400 hover:rounded-b-[30px] ">
                  <div className="pb-[20px] md:pb-[30px] ">
                    <p className="text-black text-2xl md:text-3xl  md:pb-2 hover:text-white">
                      {d.name}
                    </p>
                    <p className="text-gray-500 text-sm md:text-lg lg:text-xl pb-1 md:pb-2 hover:text-white">
                      {d.category || "Food"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Goslider;

