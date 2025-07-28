import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const App = () => {
  const [slide, setSlide] = useState(0);
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/getDbItem")
      .then((res) => {
      return res.json()
      })
      .then((data) => {
      setCategory(data)
    })
  }, []);

  const nextSlide = () => {
    if (categories.length - 8 == slide) return false;
    setSlide(slide + 3);
  };
  const prevSlide = () => {
    if (slide == slide) return false;
    setSlide(slide - 3);
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-1">
      <div className="flex items-center justify-between">
        <div>{`What's on your mind?{ }`}</div>
        <div className="flex">
          <div
            onClick={prevSlide}
            className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2"
          >
            <FaArrowLeft />
          </div>
          <div
            onClick={nextSlide}
            className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2"
          >
            <FaArrowRight />
          </div>
        </div>
      </div>

      <div className="flex border border-red-600 overflow-hidden mt-6 h-[30vh]">
        {categories.map((d, index) => {
          return (
            <div
              style={{
                transform: `translateX(-${slide * 100})`,
              }}
              key={index}
              className="w-[150px] shrink-0"
            >
              <img src={d.imageURL} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
