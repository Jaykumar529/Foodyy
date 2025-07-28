import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from 'axios'

const Updatemodel = ({ onClose, oldData }) => {

    // for close the model 
    const modalRef = useRef();
    const closeModal = (e) => {
      if (modalRef.current === e.target) {
        onClose();
      }
  };
  
    const [image, setImage] = useState("");
    const [formData, setFormData] = useState({
      name: "",
      price: "",
      category:"",
    });

  useEffect(() => {
      setFormData({
        name: oldData.name || "",
        price: oldData.price || "",
        category: oldData.category || "",
      });
    }, [oldData]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const imageData = new FormData();
      if (image) { 
        imageData.append("image", image); // if change then new image add
      }
      imageData.append("formData", JSON.stringify({...formData, imgId: oldData.imgId}));

      // try {
        
        const response = await axios.post("http://127.0.0.1:8080/update", imageData, {
          headers: {"Content-Type": "multipart/form-data"},
        });
        console.log("updated Successfully:", response.data);
        onClose()
      // }
      // catch (err) {
      //   console.error("Error updating: ", err)
      // }
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
        <div className="mt-10 flex flex-col gap-2 text-white">
          <button onClick={onClose} className="place-self-end">
            <X size={30} />
          </button>
          <div className="bg-[#22852a] rounded-lg px-20 py-10 flex flex-col gap-5 items-center mx-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                // value={image}
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
                className="bg-black p-1 rounded-md w-16 place-self-center"
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
