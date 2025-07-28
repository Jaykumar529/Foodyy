import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    mailId: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://127.0.0.1:8080/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setFormData(response.data.user); //show already data
        setLoading(false);
      } catch (error) {
        setError("Error fetching user details. Please try again.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://127.0.0.1:8080/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-100 shadow-md rounded-xl p-6 mt-10">
      <div className="flex flex-col items-center">
        <img
          src={
            user.profilePicture ||
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300"
        />
        <h1 className="text-2xl font-bold mt-3 text-gray-800">
          {user.userName}
        </h1>
      </div>

      <div className="mt-6 space-y-2 text-gray-700">
        <p className="text-lg">
          📧 <span className="font-semibold">Email:</span> {user.mailId}
        </p>
        <p className="text-lg">
          📞 <span className="font-semibold">Phone:</span> {user.phone || "N/A"}
        </p>
        <p className="text-lg">
          🏡 <span className="font-semibold">Address: </span>
          {user.address || "N/A"}
        </p>
      </div>

      <button
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={handleEditClick}
      >
        Edit Profile
      </button>

      {/* model */}
      {isEditing && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                placeholder="UserName"
                required
              />
              <input
                type="email"
                name="mailId"
                value={formData.mailId}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                placeholder="Phone"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                placeholder="Address"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 bg-gray-500 text-black rounded hover:bg-gray-600" onClick={handleCloseModal}>Cancle</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
