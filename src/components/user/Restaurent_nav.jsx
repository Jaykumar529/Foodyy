import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "https://cdn.lordicon.com/lordicon.js";

const Restaurent_nav = ({ searchTerm }) => {
  const navigate = useNavigate();
  const [getdata, setGetdata] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/getDbResItem")
      .then((res) => res.json())
      .then((data) => setGetdata(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const openpage = (d) => {
    navigate(`/${d._id}`);
  };

  const filterData = getdata.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-[20px] right-16 z-50 cursor-pointer p-2 rounded-full hover:bg-orange-600 transition-colors bg-orange-400"
        // top-[40px]
        onClick={onClick}
      >
        <GoArrowLeft size={24} />
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-[20px] right-4 z-10 cursor-pointer p-2 rounded-full hover:bg-orange-600 transition-colors bg-orange-400"
        onClick={onClick}
      >
        <GoArrowRight size={24} />
      </div>
    );
  };

  const settings = {
    infinite: true,
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div
      className="mb-20 relative mt-20 h-auto flex flex-col items-center justify-center px-4 md:px-10 "
      id="resnav"
    >
      <p className="text-gray-800 text-center text-4xl md:text-6xl font-semibold">
        List of All The Restaurants
      </p>
      <div className="relative w-full max-w-[1300px] overflow-hidden ">
        {filterData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No restaurants found
          </p>
        ) : (
          <>
            <Slider {...settings} className="w-full">
              {filterData.map((d, index) => (
                <div
                  key={index}
                  className="mt-20 bg-white w-[90%] md:w-[400px] h-[550px] mb-10 text-gray-800 rounded-3xl relative mx-auto shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 hover:rotate-1 duration-300"
                >
                  <div className="img h-80 rounded-t-3xl flex justify-center items-center overflow-hidden ">
                    <img
                      src={d.imageURL}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="info flex flex-col p-6">
                    <p className="text-2xl font-bold">{d.name}</p>
                    <p className="mt-2 text-base text-gray-600">
                      <span className="font-semibold">⭐</span> {d.star}/5
                    </p>
                    <p className="mt-2 text-mg font-serif text-gray-900">
                      {d.location}
                    </p>
                    
                    {/* Add this line here */}
                    <div className="mt-4 border-t border-gray-200"></div>

                    <div
                      onClick={() => openpage(d)}
                      className="flex justify-center items-center gap-2 mt-6 h-12 text-sm rounded-3xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer"
                    >
                      <span>View Menu</span>
                      <lord-icon
                        src="https://cdn.lordicon.com/zmkotitn.json"
                        trigger="hover"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{
                          width: "25px",
                          height: "25px",
                          padding: "2px",
                        }}
                      ></lord-icon>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurent_nav;