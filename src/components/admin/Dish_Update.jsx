import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Updatemodel = ({ onClose, oldData }) => {
  // for close the model
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const [image, setImage] = useState("");
  // const [formData, setFormData] = useState({oldData});
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    status: "",
  });

  const [getdata, setGetdata] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/getDbDishes")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setGetdata(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (oldData) {
      setFormData({
        name: oldData.name || "",
        category: oldData.category || "",
        description: oldData.description || "",
        price: oldData.price || "",
        status: oldData.status || "",
      });
    }
  }, [oldData, getdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageData = new FormData();
      if (image) {
        imageData.append("image", image); // if change then new image add
      }
      imageData.append(
        "formData",
        JSON.stringify({
          ...formData,
          imgId: oldData.imgId,
        })
      );

      // try {
      const response = await axios.post(
        "http://127.0.0.1:8080/update_dishes",
        imageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("updated Successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center "
    >
      <div className="mt-0 flex flex-col gap-2 text-white">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <div className="bg-[#1f7826] rounded-lg px-20 py-12 flex flex-col gap-5 items-center mx-4">
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

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="text-black"
            >
              <option value="" disabled>
                Select a food category
              </option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="International">International</option>
            </select>

            <input
              value={formData.description}
              type="text"
              placeholder="Enter the description"
              name="description"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />

            <input
              value={formData.price}
              type="text"
              placeholder="Enter the Dish price"
              name="price"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              className="text-black"
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a food current Status
              </option>
              <option value="Available">✅ Available</option>
              <option value="Out">❌ Out of Stock</option>
            </select>

            <button
              type="submit"
              className="bg-black p-1 rounded-md mt-11 w-16 place-self-center"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Updatemodel;
