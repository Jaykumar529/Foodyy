// import React from "react";
// import cross from "/cross.png";
// import cutlery from "/cutlery.png";
// import delivery from "/delivery.png";

// const details = () => {
//   return (
//     <div id="services" className="w-full bg-[#f7f7fa]">
//       {/* scale effect */}
//       <div className="mx-32 pt-10 pb-10">
//         <div className="flex justify-center text-orange-600 text-3xl font-semibold mb-5">
//           <p>Services</p>
//         </div>
//         <div className="flex justify-center text-black text-6xl font-semibold mb-7">
//           <p>Why Choose Our Food</p>
//         </div>
//         <div className="flex mb-20 justify-around h-[4.3in] text-black">
//           <div className="group flex flex-col items-center justify-center w-[5in] gap-3 border p-10 rounded-3xl m-6 transition-all duration-300 hover:scale-105 hover:shadow-inner">
//             <div className="w-24 h-24 opacity-80">
//               <img src={cross} alt="" />
//             </div>
//             <span className="text-2xl font-bold">Qualityfull Food</span>
//             <p className="text-center">
//               Experience lightning-fast delivery times with Foodyy's optimized
//               delivery network. Get your food delivered hot and fresh, right to
//               your doorstep.
//             </p>
//           </div>
//           <div className="group flex flex-col items-center justify-center w-[5in] gap-3 border p-10 rounded-3xl m-6 transition-all duration-300 hover:scale-105 hover:shadow-inner">
//             <div className="w-24 h-24 opacity-80">
//               <img src={cutlery} alt="" className="rounded-full" />
//             </div>
//             <span className="text-2xl font-bold">Healthy Food</span>
//             <p className="text-center">
//               Say goodbye to order errors! Foodyy ensures precise order
//               processing, so you get exactly what you ordered, every time.
//             </p>
//           </div>
//           <div className="group flex flex-col items-center justify-center w-[5in] gap-3 border p-10 rounded-3xl m-6 transition-all duration-300 hover:scale-105 hover:shadow-inner">
//             <div className="w-28 h-28 opacity-80">
//               <img src={delivery} alt="" />
//             </div>
//             <span className="text-2xl font-bold">Faster Delivery</span>
//             <p className="text-center">
//               Enjoy a seamless and delightful food ordering experience with
//               Foodyy. From browsing menus to tracking your order, we've got you
//               covered.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default details;

import React from "react";
import cross from "/cross.png";
import cutlery from "/cutlery.png";
import delivery from "/delivery.png";

const Details = () => {
  return (
    <div id="services" className="w-full bg-[#f7f7fa] py-10">
      <div className="mx-32 text-center">
        <p className="text-orange-600 text-3xl font-semibold mb-2">Services</p>
        <h2 className="text-black text-6xl font-semibold mb-10">
          Why Choose Our Food
        </h2>
      </div>
      <div className="flex justify-around flex-wrap gap-10 px-10">
        {[
          {
            img: cross,
            title: "Qualityfull Food",
            desc: "Experience lightning-fast delivery times with Foodyy's optimized delivery network. Get your food delivered hot and fresh, right to your doorstep.",
          },
          {
            img: cutlery,
            title: "Healthy Food",
            desc: "Say goodbye to order errors! Foodyy ensures precise order processing, so you get exactly what you ordered, every time.",
          },
          {
            img: delivery,
            title: "Faster Delivery",
            desc: "Enjoy a seamless and delightful food ordering experience with Foodyy. From browsing menus to tracking your order, we've got you covered.",
          },
        ].map((service, index) => (
          <div
            key={index}
            className="relative group flex flex-col items-center justify-center w-[5in] gap-3 border p-10 rounded-3xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:rotate-1 hover:translate-y-[-10px] hover:shadow-orange-300/50"
          >
            <div className="w-24 h-24 opacity-80 transition-all duration-300 group-hover:scale-110">
              <img
                src={service.img}
                alt={service.title}
                className="rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {service.title}
            </span>
            <p className="text-center text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
