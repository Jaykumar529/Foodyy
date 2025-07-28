import axios from "axios";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";

const AddDish = ({ onClose, id }) => {
  const modalRef = useRef();
  const [file, setFile] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dishData = new FormData();
    dishData.append("image", file);
    const formattedData = {
      ...formData,
      id,
    };
    dishData.append("formData", JSON.stringify(formattedData));

    await axios.post("http://127.0.0.1:8080/addDishData", dishData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    onClose();
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handleImage = (e) => {
    setFile(e.target.files[0]);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              placeholder="Enter the Dish name"
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
                Select a food Cuisine
              </option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="International ">International</option>
            </select>

            <input
              value={formData.description}
              type="text"
              placeholder="Enter the Dish Description"
              name="description"
              className="w-full px-4 py-1 text-black border-gray-300 rounded-md"
              onChange={handleChange}
            />

            <input
              value={formData.price}
              type="number"
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

export default AddDish;
