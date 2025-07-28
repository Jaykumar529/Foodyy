// import React, { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import AddDish from "./AddDish";
// import Dish_Update from "./Dish_Update";

// const FoodDetails = () => {
//   const [showModal, setShowModal] = useState(false);
//   const { id } = useParams();
//   const location = useLocation();
//   // for get data from api(backend)
//   const [getdata, setGetdata] = useState(null);
//   const [updateData, setUpdateData] = useState(null);
//   const restaurantName = location.state?.name || "Unknown";
//   const restaurantLocation = location.state?.location || "Unknown";
//   const [dish, setDish] = useState(null);

//   //for update popup menu
//   const [update, setUpdate] = useState(false);

//   // for cover image
//   useEffect(() => {
//     fetch(`http://127.0.0.1:8080/getDbResItem/${id}`)
//       .then((res) => {
//         return res.json();
//       })
//       .then((data) => {
//         setGetdata(data);
//       })
//       .catch((err) => console.error("Error fetching data:", err));
//   }, [id]);

//   // for each restaurant different data (dishes data)
//   useEffect(() => {
//     fetch(`http://127.0.0.1:8080/getDbDishes/${id}`)
//       .then((res) => {
//         return res.json();
//       })
//       .then((data) => {
//         setDish(data);
//       })
//       .catch((err) => console.error("Error fetching data:", err));
//   }, [id]);

//   if (!dish) {
//     return <div>Loading...</div>;
//   }

//   const handleUpdate = async (e, item) => {
//     e.preventDefault();
//     setUpdateData(item);
//     setUpdate(true);
//   };

//   const dishdelete = async (e, index) => {
//     e.preventDefault();
//     const dd = dish[index].imgId;
//     let dishes = await fetch("http://127.0.0.1:8080/delete_dishes", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ formData: dd }),
//     });
//   };

//   return (
//     <div className="overflow-y-scroll max-h-[700px] w-full">
//       <div>
//         {showModal && <AddDish onClose={() => setShowModal(false)} id={id} />}
//         {update && (
//           <Dish_Update onClose={() => setUpdate(false)} oldData={updateData} />
//         )}
//       </div>
//       <div className="px-2 my-2">FoodDetails</div>
//       <div className="">
//         <div className="bg-zinc-800 w-[85vw] text-slate-200 rounded-xl ">
//           <div className="img rounded-t-xl object-fill justify-center items-center">
//             <img
//               src={getdata.imageURL}
//               alt=""
//               className="h-80 blur-0 w-[100vw] scale-90 rounded-t-xl"
//             />
//           </div>

//           <div className="container mx-auto p-6">
//             <div className="flex justify-evenly">
//               <h1 className="bg-slate-700 w-48 pl-1 rounded-md">
//                 <strong>Name: </strong>
//                 {restaurantName}
//               </h1>
//               <p className="bg-slate-700 w-32 pl-1 rounded-md">
//                 {" "}
//                 <strong>Location: </strong> {restaurantLocation}
//               </p>
//             </div>
//             <div className="flex">
//               <h2 className="text-2xl font-bold mb-4">🍽️ Manage Dishes</h2>
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded mb-4 ml-[9.35in] hover:bg-green-600"
//                 onClick={() => setShowModal(true)}
//               >
//                 + Add New Dish
//               </button>
//             </div>

//             <div className=" border border-gray-300 rounded-lg shadow-md">
//               <table className="w-full table-auto border border-gray-300 rounded-lg shadow-md">
//                 <thead>
//                   <tr className="bg-gray-500 text-left">
//                     <th className="px-4 py-2 border">Dish Name</th>
//                     <th className="px-4 py-2 border">Category</th>
//                     <th className="px-4 py-2 border">Price (₹)</th>
//                     <th className="px-4 py-2 border">Status</th>
//                     <th className="px-4 py-2 border">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="">
//                   {dish.map((dish, index) => {
//                     return (
//                       <tr
//                         key={index}
//                         className="hover:bg-gray-800 transition-all"
//                       >
//                         <td className="px-4 py-2 border">{dish.name}</td>
//                         <td className="px-4 py-2 border">{dish.category}</td>
//                         <td className="px-4 py-2 border">₹{dish.price}</td>
//                         <td className="px-4 py-2 border">
//                           {dish.status ? (
//                             <span className="text-green-600 font-bold">
//                               ✅ Available
//                             </span>
//                           ) : (
//                             <span className="text-red-500 font-bold">
//                               ❌ Out of Stock
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-2 border space-x-2">
//                           <button
//                             onClick={(e) => handleUpdate(e, dish)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>

//                           <button
//                             onClick={(e) => dishdelete(e, index)}
//                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodDetails;

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AddDish from "./AddDish";
import Dish_Update from "./Dish_Update";

const FoodDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const [getdata, setGetdata] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const restaurantName = location.state?.name || "Unknown";
  const restaurantLocation = location.state?.location || "Unknown";
  const [dish, setDish] = useState(null);
  const [update, setUpdate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/getDbResItem/${id}`)
      .then((res) => res.json())
      .then((data) => setGetdata(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  // try
  useEffect(() => {
    fetch(`http://127.0.0.1:8080/getDbDishes/${id}`)
      .then((res) => res.json())
      .then((data) => setDish(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [id, refreshTrigger]); // Add refreshTrigger as dependency

  // useEffect(() => {
  //   fetch(`http://127.0.0.1:8080/getDbDishes/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => setDish(data))
  //     .catch((err) => console.error("Error fetching data:", err));
  // }, [id]);

  if (!dish) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setUpdateData(item);
    setUpdate(true);
  };

  const dishdelete = async (e, index) => {
    e.preventDefault();
    const dd = dish[index].imgId;
    await fetch("http://127.0.0.1:8080/delete_dishes", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData: dd }),
    });
     setRefreshTrigger(!refreshTrigger); //refresh after delete the item
  };

  return (
    <div className="overflow-y-scroll max-h-screen w-full p-6 bg-gray-900 text-white">
      {showModal && (
        <AddDish
          onClose={() => { setShowModal(false); setRefreshTrigger(!refreshTrigger);}}
          id={id}
        />
      )}
      {update && (
        <Dish_Update onClose={() => setUpdate(false)} oldData={updateData} />
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg">
        <img
          src={getdata.imageURL}
          alt=""
          className="h-80 w-full object-cover rounded-t-xl"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">{restaurantName}</h1>
            <p className="text-gray-400">📍 {restaurantLocation}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🍽️ Manage Dishes</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              onClick={() => setShowModal(true)}
            >
              + Add New Dish
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-4 py-2 border">Dish Name</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Price (₹)</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dish.map((dish, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="px-4 py-2 border">{dish.name}</td>
                    <td className="px-4 py-2 border">{dish.category}</td>
                    <td className="px-4 py-2 border">₹{dish.price}</td>
                    <td className="px-4 py-2 border">
                      {dish.status ? (
                        <span className="text-green-400 font-bold">
                          ✅ Available
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold">
                          ❌ Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={(e) => handleUpdate(e, dish)}
                        className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => dishdelete(e, index)}
                        className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
