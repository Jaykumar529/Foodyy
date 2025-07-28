import React, { useState, useEffect } from "react";
const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers()  
  }, []);

  const fetchUsers = () => {
      fetch("http://127.0.0.1:8080/users") 
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
  }
  
  // delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8080/deleteUser/${id}`, {
          method: "DELETE",  
        })
        if (response.ok) {
          alert("User deleted successfully!");
          fetchUsers()
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  }

  return (
    // overflow-y-scroll
    <div className=" bg-gradient-to-br from-purple-500 to-blue-500 flex justify-center items-center p-6 w-full">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          👥 Users List
        </h2>
        <div className="rounded-lg shadow-sm">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No.</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-100 transition-all border-b"
                    >
                      <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-semibold shadow-md">
                          {user.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-800 font-medium">
                          {user.userName}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.mailId}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex gap-2"
                        >
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwklEQVR4nO3TTQ6CMBAF4HoF3GL0Ug1J3zQsjMdRt8bEk0mMWxOvoI8g+IelpbjUSVjx+JgyjFL/orWWQBr6EhQBjZmGMZErgcKH0phFkzvQ2nE3CKQE9hQhRY7M85mjszmBS5NZB2fqQ6MxHzoYc6LAmSLDsRZ6aqDq2qlviu/H7BxUPAZsQ9OPwVZ9f6ne2ONeLMpqnaoNqB9YOjNZNrltUv3Cglon3eA93OrsI/fsdEOlRv4ufbv5mtM6CWLqJ6oE9bPsf5xCZLcAAAAASUVORK5CYII="
                            alt="multiply"
                          />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-600 font-medium"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
