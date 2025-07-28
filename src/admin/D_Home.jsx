// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Users, Utensils, Store } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const D_Home = () => {
//   const [users, setUsers] = useState([]);
//   const [restaurants, setRestaurants] = useState([]);
//   const [dishes, setDishes] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersRes = await axios.get("http://127.0.0.1:8080/users");
//         const restaurantsRes = await axios.get(
//           "http://127.0.0.1:8080/restaurants"
//         );
//         const dishesRes = await axios.get("http://127.0.0.1:8080/dishes");

//         setUsers(usersRes.data);
//         setRestaurants(restaurantsRes.data);
//         setDishes(dishesRes.data);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const chartData = [
//     { name: "Users", count: users.length },
//     { name: "Restaurants", count: restaurants.length },
//     { name: "Dishes", count: dishes.length },
//   ];

//   return (
//     <div className="p-8 bg-gradient-to-r from-gray-300 via-white to-gray-100 w-full overflow-y-auto">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
//           <CardContent className="flex flex-col items-center gap-3 py-6">
//             <Users className="w-8 h-8 text-blue-500" />
//             <h2 className="text-xl font-medium text-gray-600">Total Users</h2>
//             <p className="text-3xl font-bold text-gray-900">{users.length}</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500">
//           <CardContent className="flex flex-col items-center gap-3 py-6">
//             <Store className="w-8 h-8 text-green-500" />
//             <h2 className="text-xl font-medium text-gray-600">
//               Total Restaurants
//             </h2>
//             <p className="text-3xl font-bold text-gray-900">
//               {restaurants.length}
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500">
//           <CardContent className="flex flex-col items-center gap-3 py-6">
//             <Utensils className="w-8 h-8 text-orange-500" />
//             <h2 className="text-xl font-medium text-gray-600">Total Dishes</h2>
//             <p className="text-3xl font-bold text-gray-900">{dishes.length}</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="mt-12 bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-semibold mb-6 text-gray-700">Overview</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default D_Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Users, Utensils, Store } from "lucide-react";
import moment from "moment";

const D_Home = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderTrend, setOrderTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, restaurantsRes, dishesRes, agentsRes, ordersRes] =
          await Promise.all([
            axios.get("http://127.0.0.1:8080/users"),
            axios.get("http://127.0.0.1:8080/restaurants"),
            axios.get("http://127.0.0.1:8080/dishes"),
            axios.get("http://127.0.0.1:8080/agents"),
            axios.get("http://127.0.0.1:8080/orders"),
          ]);

        setUsers(usersRes.data);
        setRestaurants(restaurantsRes.data);
        setDishes(dishesRes.data);
        setAgents(agentsRes.data);
        setOrders(ordersRes.data);
        transformOrderData(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // fetch every 5 seconds
    }, 5000); // 5000ms = 5s, you can reduce if needed

    return () => clearInterval(interval); // clear interval on unmount
  }, []);

  const transformOrderData = (orders) => {
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyCount = {};

    orders.forEach((order) => {
      const dateObj = new Date(order.createdAt);
      const dateKey = moment(dateObj).format("YYYY-MM-DD"); // Use date in 'YYYY-MM-DD' format as key
      const day = dateObj.getDate(); // Day of the month (e.g., 17)
      const dayName = dayMap[dateObj.getDay()]; // Abbreviated day name (e.g., Mon)
      const label = `${day} ${dayName}`; // Format as '17 Mon'

      // Now use the formatted dateKey as key to count orders
      dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1; // Store by formatted date key
    });

    // Convert dailyCount keys (which are date strings) to an array of objects
    const sortedData = Object.keys(dailyCount)
      .map((dateKey) => ({
        date: new Date(dateKey), // Convert back to Date object
        orders: dailyCount[dateKey],
      }))
      .sort((a, b) => a.date - b.date); // Sort by date (ascending)

    // Now format the data with the 'day + dayName' format
    const formattedData = sortedData.map((item) => {
      const date = item.date;
      const day = date.getDate();
      const dayName = dayMap[date.getDay()];
      return { date: `${day} ${dayName}`, orders: item.orders };
    });

    setOrderTrend(formattedData);
  };


  const overviewData = [
    { name: "Users", count: users.length },
    { name: "Restaurants", count: restaurants.length },
    { name: "Dishes", count: dishes.length },
    { name: "Agents", count: agents.length },
    { name: "Orders", count: orders.length },
  ];

  const donutColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

  return (
    <div className="p-8 bg-gradient-to-r from-gray-300 via-white to-gray-100  w-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="bg-white shadow-xl border-t-4 border-blue-500 transition-all hover:shadow-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Users className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-medium text-gray-600">Users</h2>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-t-4 border-green-500 transition-all hover:shadow-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Store className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-medium text-gray-600">Restaurants</h2>
            <p className="text-3xl font-bold text-gray-900">
              {restaurants.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-t-4 border-orange-500 transition-all hover:shadow-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Utensils className="w-8 h-8 text-orange-500" />
            <h2 className="text-xl font-medium text-gray-600">Dishes</h2>
            <p className="text-3xl font-bold text-gray-900">{dishes.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-t-4 border-purple-500 transition-all hover:shadow-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Users className="w-8 h-8 text-purple-500" />
            <h2 className="text-xl font-medium text-gray-600">Agents</h2>
            <p className="text-3xl font-bold text-gray-900">{agents.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-t-4 border-red-500 transition-all hover:shadow-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Utensils className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-medium text-gray-600">Orders</h2>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Bar Chart */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Overview (Bar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overviewData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              System Overview (Donut)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overviewData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {overviewData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={donutColors[index % donutColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Line Chart */}
      <div className="mt-12">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Daily Order Trend (Line Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrend}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default D_Home;
