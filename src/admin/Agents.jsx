import React, { useState, useEffect } from "react";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
    
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = () => {
    fetch("http://127.0.0.1:8080/agents")
      .then((response) => response.json())
      .then((data) => setAgents(data))
      .catch((error) => console.error("Error fetching agents:", error));
  };

  // Single delete function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/deleteAgent/${id}`,
          {
            method: "DELETE",
          }
          );
          
        if (response.ok) {
          alert("Agent deleted successfully!");
          fetchAgents();
        } else {
          alert("Failed to delete agent.");
        }
      } catch (error) {
        console.error("Error deleting agent: ", error);
      }
      }
  };

  // Multiple delete function
  const handleMultipleDelete = async () => {
    if (selectedAgents.length === 0) return alert("No agents selected.");
    if (window.confirm("Are you sure you want to delete selected agents?")) {
      try {
        const response = await fetch("http://127.0.0.1:8080/deleteAgents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentIds: selectedAgents }),
        });
          console.log("response",response);
          
        if (response.ok) {
          alert("Selected agents deleted successfully!");
            setSelectedAgents([]);
            
          fetchAgents();
        } else {
          alert("Failed to delete selected agents.");
        }
      } catch (error) {
        console.error("Error deleting agents: ", error);
      }
    }
  };

  // Handle checkbox selection
  const toggleSelection = (id) => {
    setSelectedAgents((prev) =>
      prev.includes(id)
        ? prev.filter((agentId) => agentId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="overflow-y-scroll bg-gradient-to-br from-green-500 to-blue-500 flex justify-center items-center p-6 w-full">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          👥 Agents List
        </h2>
        {selectedAgents.length > 0 && (
          <button
            onClick={handleMultipleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Delete Selected Agents ({selectedAgents.length})
          </button>
        )}
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Select</th>
                <th className="py-3 px-4 text-left">Agent Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.length > 0 ? (
                agents.map((agent, index) => (
                  <tr
                    key={index}
                    className="bg-white hover:bg-gray-100 transition-all border-b"
                  >
                    <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                    <td className="py-4 px-8 text-left">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent._id)}
                        onChange={() => toggleSelection(agent._id)}
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {agent.agentName}
                    </td>
                    <td className="py-4 px-4 text-gray-700">{agent.mailId}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-600 font-medium"
                  >
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agents;
