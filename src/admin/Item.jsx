import { MoreVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import AddItemcard from "../components/admin/AddItemcard";
import Updatemodel from "../components/admin/Updatemodel";

const Item = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const [showModal, setShowModal] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);
  const [update, setUpdate] = useState(false);
  const [getdata, setGetdata] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleToggleMenu = (event, index) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuIndex(null);
    }
  };

  useEffect(() => {
    if (openMenuIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuIndex]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/getDbItem")
      .then((res) => res.json())
      .then((data) => setGetdata(data));
  }, [refresh]);

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setUpdateData(item);
    setUpdate(true);
  };

  const handleDelete = async (e, index) => {
    e.preventDefault();
    const imgId = getdata[index].imgId;
    await fetch("http://127.0.0.1:8080/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData: imgId }),
    });
    setOpenMenuIndex(null);
    setRefresh(!refresh);
  };

  return (
    <>
      {showModal && (
        <AddItemcard
          onClose={() => {
            setShowModal(false);
            setRefresh(!refresh);
          }}
        />
      )}
      {update && (
        <Updatemodel
          onClose={() => {
            setUpdate(false);
            setRefresh(!refresh);
          }}
          oldData={updateData}
        />
      )}

      <div className="w-full mt-6 px-6 overflow-hidden ">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 shadow-lg text-white px-6 py-2 rounded-xl font-semibold transition-transform duration-300"
          >
            + Add Item
          </button>
        </div>

        <Slider {...settings}>
          {getdata.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-md transition-transform transform relative -mx-1"
            >
              <div className="flex justify-end">
                <button onClick={(e) => handleToggleMenu(e, index)}>
                  <MoreVertical size={20} className="text-gray-700" />
                </button>
                {openMenuIndex === index && (
                  <div
                    ref={menuRef}
                    className="absolute top-12 right-4 bg-white border rounded-lg shadow-md p-2 flex flex-col z-20"
                  >
                    <button
                      onClick={(e) => handleDelete(e, index)}
                      className="text-red-600 hover:bg-red-100 px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => handleUpdate(e, item)}
                      className="text-green-600 hover:bg-green-100 px-3 py-1 rounded transition"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>

              <div className="h-40 w-full flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4">
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="object-contain h-36 hover:scale-105"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="font-bold text-lg text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Item;
