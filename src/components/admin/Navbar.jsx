// import React from "react";
// import { NavLink } from "react-router-dom";
// const Navbar = () => {
//   return (
//     <div className="w-[15%]  overflow-auto bg-[#f8f8f8] text-left pl-8 pt-3">
//       <h1 className="text-xl font-bold pt-2 text-gray-700">Main menu</h1>
//       <ul>
//         <li>
//           <NavLink
//             to="/dashboard/d_home"
//             className={({ isActive }) =>
//               ` ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }  font-semibold  border-gray-100 hover:bg-gray-50  lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             <span>🏠</span> Dashboard
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/dashboard/restaurent"
//             className={({ isActive }) =>
//               ` ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }  font-semibold  border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             🏪 Restaurents
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/dashboard/orders"
//             className={({ isActive }) =>
//               `font-semibold ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }   hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             📦 Orders
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/dashboard/user"
//             className={({ isActive }) =>
//               `font-semibold ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }   hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             👥 Users
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/dashboard/items"
//             className={({ isActive }) =>
//               `font-semibold ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }   hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             🥗 Items
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/dashboard/itemtab"
//             className={({ isActive }) =>
//               `font-semibold ${
//                 isActive ? "text-orange-700" : "text-gray-700"
//               }   hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//             }
//           >
//             🥗 Items_table
//           </NavLink>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard , Home, Store, Package, Users, Utensils, Table} from "lucide-react";
import { RiUserLocationLine } from "react-icons/ri";

const Navbar = () => {
  return (
    <div className=" bg-gray-100 p-6 shadow-md">
      {/* w-[15%]  */}
      <h1 className="text-xl font-bold text-gray-800 mb-6 text-center flex gap-2">
        <LayoutDashboard />
        Main Menu
      </h1>
      <ul className="space-y-4">
        <NavItem
          to="/dashboard/d_home"
          icon={<Home size={20} />}
          label="Dashboard"
        />
        <NavItem
          to="/dashboard/restaurent"
          icon={<Store size={20} />}
          label="Restaurants"
        />
        <NavItem
          to="/dashboard/orders"
          icon={<Package size={20} />}
          label="Orders"
        />
        <NavItem
          to="/dashboard/user"
          icon={<Users size={20} />}
          label="Users"
        />
        <NavItem
          to="/dashboard/items"
          icon={<Utensils size={20} />}
          label="Items"
        />
        <NavItem
          to="/dashboard/itemtab"
          icon={<Table size={20} />}
          label="Items Table"
        />
        <NavItem
          to="/dashboard/agents"
          icon={<RiUserLocationLine size={20} />}
          label="Agents"
        />
      </ul>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-6 py-2 rounded-lg transition-all duration-200 font-medium text-lg ${
            isActive
              ? "bg-orange-100 text-orange-700"
              : "text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        {icon} {label}
      </NavLink>
    </li>
  );
};

export default Navbar;
