import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// import Select from "react-select";

const Itemcard = ({ onClose }) => {
  const modalRef = useRef();
  // set data
  const [file, setFile] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    star: "",
    status: "", 
    // item_Name: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const resData = new FormData();
    resData.append("image", file);
    const formattedData = {
      ...formData
    }
    resData.append("formData", JSON.stringify(formattedData));

    await axios.post("http://127.0.0.1:8080/addResData", resData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    onClose();
  };

  const handleImage = (e) => {
    setFile(e.target.files[0]);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  // const [getdata, setGetdata] = useState([]);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8080/getDbItem")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       // console.log(data);
  //       setGetdata(data);
  //     })
  //     .catch((err) => console.error("Error fetching data:", err));
  // }, []);

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center  "
    >
      <div className="mt-10 flex flex-col gap-2 text-white">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <div className="bg-[#fc8b2f] rounded-lg px-20 py-10 flex flex-col gap-5 items-center mx-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="file"
              id="img"
              accept="image/*"
              name="img"
              className="w-full px-4 py-3 text-black border-gray-300 rounded-md"
              onChange={handleImage}
            />
            <input
              value={formData.name}
              type="text"
              placeholder="Enter the name"
              name="name"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />
            <input
              value={formData.location}
              type="text"
              placeholder="Enter the location"
              name="location"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />
            <input
              value={formData.star}
              type="number"
              placeholder="⭐Give's the rating out of 5"
              min="1"
              max="5"
              step="any"
              name="star"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />
            <div className="flex gap-4 text-black ">
              <label htmlFor="" className="font-semibold">
                Status:{" "}
              </label>
              <label className="flex items-center font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Open"
                  checked={formData.status === "Open"}
                  onChange={handleChange}
                  className="mr-2 "
                />
                Active
              </label>

              <label className="flex items-center font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Close"
                  checked={formData.status === "Close"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Closed
              </label>
            </div>

            {/* <Select
              options={transformedData}
              isMulti
              value={formData.item_Name}
              onChange={handleMultiSelectChange}
              className="text-black"
              placeholder="Select..."
            />
            <div>
              <strong className="text-black">Selected:</strong>
              {formData.item_Name.map((opt) => opt.label).join(", ")}
            </div> */}
            <button
              type="submit"
              className="bg-yellow-700 rounded-md w-16 place-self-end"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Itemcard;
