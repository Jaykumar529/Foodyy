import axios from "axios";
import { X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const Itemcard = ({ onClose }) => {
  const modalRef = useRef();
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category:"",
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const imageData = new FormData();
    imageData.append("image", image);
    imageData.append("formData", JSON.stringify(formData));
    
      await axios.post("http://127.0.0.1:8080/addData", imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    onClose()
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
      fetch("http://127.0.0.1:8080/getDbItem")
      
      .then((res) => {
          return res.json();
        })
        // .then((data) => {
        //   console.log(data);
        //   setGetdata(data);
        // });
  }, []);
  

  const closeModal = (e) => {
    console.log("Modal Ref:", modalRef.current);
    console.log("Event Target:", e.target);

    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0  bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center  z-50"
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
              value={formData.price}
              type="number"
              placeholder="Enter the price"
              name="price"
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
