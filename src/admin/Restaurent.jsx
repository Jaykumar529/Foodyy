import { MoreVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Addrestaurant from "../components/admin/Addrestaurant";
import Update_Res from "../components/admin/Update_Res";

const Restaurent = () => {
  // for searchbar
  const [search, setSearch] = useState("");

  // for model open and close and also navigate
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // try a index open card
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  //for update popup menu
  const [update, setUpdate] = useState(false);

  // function for toggle button
  const handleToggleMenu = (event, index) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // for outside the menu close
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
  }, [openMenuIndex, handleClickOutside]);

  // for get data from api(backend)
  const [getdata, setGetdata] = useState([]);
  const [updateData, setUpdateData] = useState(null);

  
  const fetchRes = () => {
    fetch("http://127.0.0.1:8080/getDbResItem")
    .then((res) => res.json())
    .then((data) => setGetdata(data))
    .catch((error) => console.error("Error fetching users:", error));
  }
  useEffect(() => {
    fetchRes()
   }, []);

  /*for update*/
  const handleUpdate = async (e, item) => {
    e.preventDefault();
    setUpdateData(item);
    setUpdate(true);
  };
  // Ensure that when the update modal closes, it fetches new data
  const handleUpdateClose = () => {
    setUpdate(false);
    fetchRes(); // Refresh data after update
  };

  // for delete
  const handleDelete = async (e, index) => {
    e.preventDefault();
    const oop = getdata[index].imgId;
    let data = await fetch("http://127.0.0.1:8080/delete_res", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData: oop }),
    });

    if (response.ok) {
      fetchRes(); // Refresh data after deletion
    } else {
      console.error("Error deleting restaurant");
    }

    setOpenMenuIndex(null);
  };

  const handleAddClose = () => {
    setShowModal(false);
    fetchRes(); // Refresh data after adding a new restaurant
  };
  
  const openpage = (d) => {
    const id = d._id;
    navigate(`/dashboard/restaurent/${id}`, {
      state: { name: d.name, location: d.location },
    });
  };

  // search filtering
  const filterdata = getdata.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full z-10 overflow-y-auto bg-gradient-to-r from-gray-300 via-white to-gray-100">
      <div>
        {showModal && <Addrestaurant onClose={handleAddClose} />}
        {update && (
          <Update_Res onClose={handleUpdateClose} oldData={updateData} />
        )}
      </div>
      <div className="flex justify-between">
        {/* searchbar */}
        <div className="relative w-fit m-2">
          <input
            type="text"
            placeholder="Search"
            name="text"
            className="w-[150px] p-2 text-black pl-10 border border-gray-800 rounded-full outline-none opacity-80 transition-all duration-200 ease-in-out focus:w-[250px] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-3 transform -translate-y-1/2"
          >
            <path
              d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
              fillRule="evenodd"
            />
          </svg>
        </div>

        <div className="relative inline-block m-2">
          {/* <button
            onClick={() => setShowModal(true)}
            className="
        relative z-10 w-24 h-10 text-lg font-semibold text-red-600 border-2 border-red-600 rounded-lg overflow-hidden
        transition-all duration-300 ease-in-out hover:text-white
      "
          >
            Add
            <span
              className="
          absolute top-full left-full w-[150px] h-[200px] bg-red-600 rounded-full z-[-1]
          transition-all duration-300 ease-in-out hover:top-[-30px] hover:left-[-30px]
        "
            ></span>
          </button> */}
          <button
            onClick={() => setShowModal(true)}
            className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium tracking-wide text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-lg shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
              +
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">
              Add
            </span>
            <span className="relative invisible">Add</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {filterdata.map((d, index) => {
          return (
            <div
              key={index}
              className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 w-auto m-2 h-[270px] text-black rounded-xl relative"
              // className="bg-[#f7f7f7] w-auto m-2 h-[270px] text-black rounded-xl relative"
            >
              <div className="flex">
                <button
                  variant="ghost"
                  className="p-2"
                  onClick={(e) => handleToggleMenu(e, index)}
                >
                  <MoreVertical size={20} />
                </button>
                {openMenuIndex === index && (
                  <div ref={menuRef} className="absolute left-8 top-0">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white pb-1 mt-1 mr-4 rounded-lg w-16"
                      onClick={(e) => handleDelete(e, index)}
                    >
                      Delete
                    </button>
                    <button
                      className=" bg-green-600 hover:bg-green-700 text-white pb-1 mt-1 rounded-lg w-16"
                      onClick={(e) => handleUpdate(e, d)}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
              <div className="img h-28 rounded-t-xl flex justify-center items-center">
                <img
                  src={d.imageURL}
                  alt=""
                  className="h-28 w-36 rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openpage(d)}
                />
              </div>
              {/* <div className="info flex flex-col justify-center ml-6 mt-6">
                <div className="flex">
                  <label htmlFor="">Name:</label>
                  <p className="text-base font-semibold pr-7">{d.name}</p>
                </div>
                <div className="flex">
                  <label htmlFor="">Location: </label>
                  <p className="text-base font-semibold pr-7">{d.location}</p>
                </div>
                <div className="flex">
                  <label htmlFor="">Rating : </label>
                  <p className="text-base font-semibold pr-7"> {d.star}</p>
                </div>
              </div> */}
              <div className="info text-center mt-4 space-y-1">
                <p className="font-semibold text-lg">{d.name}</p>
                <p className="text-sm text-gray-600">{d.location}</p>
                <p className="text-yellow-600 font-medium">⭐ {d.star}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Restaurent;

