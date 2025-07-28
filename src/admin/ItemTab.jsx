import React, { useEffect, useState, useRef } from "react";
import AddItemcard from "../components/admin/AddItemcard";
import Updatemodel from "../components/admin/Updatemodel";
import { MoreVertical } from "lucide-react";

const Item = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [getdata, setGetdata] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc")
  const menuRef = useRef(null); 

  const fetchItem = () => {
     fetch("http://127.0.0.1:8080/getDbItem")
       .then((res) => res.json())
       .then((data) => setGetdata(data));
  }

  useEffect(() => {
   fetchItem()
  }, []);

  const handleAddclose = () => {
    setShowModal(false)
    fetchItem()
  }
 
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

  // function for toggle button
  const handleToggleMenu = (event, index) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setUpdateData(item);
    setUpdate(true);
  };

  const handleUpdateClose = () => { 
    setUpdate(false)
    fetchItem();
  };
  
  const handleDelete = async (e, index) => {
    e.preventDefault();
    const imgId = getdata[index].imgId;
    const response = await fetch("http://127.0.0.1:8080/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData: imgId }),
    });

    if (response.ok) {
      fetchItem()
    }
    else {
      console.error("Error deleting item");
    }
    setGetdata(getdata.filter((_, i) => i !== index));
  };

  const handleSort = () => {
    const sortedData = [...getdata].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name)
      }
      else { 
        return b.name.localeCompare(a.name)
      }
    })
    setGetdata(sortedData)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="p-8 w-full bg-gray-200 overflow-y-scroll flex flex-col items-center">
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <AddItemcard onClose={handleAddclose} />
        </div>
      )}
      {update && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <Updatemodel onClose={handleUpdateClose} oldData={updateData} />
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white rounded-lg px-4 py-2 mb-4 shadow-lg hover:bg-red-700"
      >
        Add Dish
      </button>

      <div className="w-full max-w-5xl bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-red-500 to-red-700 text-white text-lg">
              <th className="p-4 rounded-tl-lg">Image</th>
              <th className="p-4 cursor-pointer" onClick={handleSort}>
                Name {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="p-4">Price (₹)</th>
              <th className="p-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {getdata.map((d, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-white/50 transition"
              >
                <td className="p-4 flex items-center">
                  <img
                    src={d.imageURL}
                    alt={d.name}
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                  />
                </td>
                <td className="p-4 text-lg font-medium">{d.name}</td>
                <td className="p-4 text-lg font-semibold">{d.price}</td>
                <td className="p-4 relative">
                  <button onClick={(e) => handleToggleMenu(e, index)}>
                    <MoreVertical size={20} />
                  </button>
                  {openMenuIndex === index && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-0 bg-white shadow-lg rounded-lg p-2 z-10"
                    >
                      <button
                        className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full rounded-lg"
                        onClick={(e) => handleDelete(e, index)}
                      >
                        Delete
                      </button>
                      <button
                        className="block px-4 py-2 text-green-600 hover:bg-green-100 w-full rounded-lg"
                        onClick={(e) => handleUpdate(e, d)}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Item;
