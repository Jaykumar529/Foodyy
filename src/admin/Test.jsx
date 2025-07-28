import React, { useState } from "react";
import styled from "styled-components";

const Test = () => {
  const [orders, setOrders] = useState([
    { order_id: 1, customer: "Alice", restaurant: 24, status: "Pending" },
    { order_id: 2, customer: "Bob", restaurant: 24, status: "Delivered" },
    { order_id: 3, customer: "Charlie", restaurant: 24, status: "Pending" },
    { order_id: 4, customer: "rich", restaurant: 4, status: "Canceled" },
    { order_id: 5, customer: "milen", restaurant: 2, status: "Pending" },
  ]);

  const [selectStatus, setselectStatus] = useState("");
  const filterStatus = selectStatus
    ? orders.filter((item) => item.status === selectStatus)
    : orders;

  return (
    <div className="w-full">
      <div className="flex gap-3 mt-2 ml-2 text-xl">
        <p>Filter: </p>
        <StyledWrapper>
          <div className="radio-buttons-container ">
            <div className="radio-button ">
              <input
                name="radio-group"
                id="radio0"
                className="radio-button__input"
                type="radio"
                value=""
                checked={selectStatus === ""}
                onChange={() => setselectStatus("")}
              />
              <label htmlFor="radio0" className="radio-button__label">
                <span className="radio-button__custom" />
                All
              </label>
            </div>
            <div className="radio-button">
              <input
                name="radio-group"
                id="radio1"
                type="radio"
                className="radio-button__input"
                value="Pending"
                checked={selectStatus === "Pending"}
                onChange={() => setselectStatus("Pending")}
              />
              <label htmlFor="radio1" className="radio-button__label">
                <span className="radio-button__custom" />
                Pending
              </label>
            </div>
            <div className="radio-button">
              <input
                name="radio-group"
                id="radio2"
                className="radio-button__input"
                type="radio"
                value="Delivered"
                checked={selectStatus === "Delivered"}
                onChange={() => setselectStatus("Delivered")}
              />
              <label htmlFor="radio2" className="radio-button__label">
                <span className="radio-button__custom" />
                Delivered
              </label>
            </div>
            <div className="radio-button ">
              <input
                name="radio-group"
                id="radio4"
                className="radio-button__input"
                type="radio"
                value="Canceled"
                checked={selectStatus === "Canceled"}
                onChange={() => setselectStatus("Canceled")}
              />
              <label htmlFor="radio4" className="radio-button__label">
                <span className="radio-button__custom" />
                Canceled
              </label>
            </div>
          </div>
        </StyledWrapper>
      </div>

      {/* ---------------------- table ---------------------- */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-500 text-center">
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Restaurant </th>
              <th className="px-4 py-2 border">Status </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterStatus.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-gray-800 transition-all ">
                  <td className="px-4 py-2 border">{item.order_id}</td>
                  <td className="px-4 py-2 border">{item.customer}</td>
                  <td className="px-4 py-2 border">{item.restaurant}</td>
                  <td className="px-4 py-2 border">{item.status}</td>
                  <td className="px-4 py-2 border">
                    {item.status === "Pending"
                      ? (<span className="text-green-600 font-bold"> ✅ Update</span>)
                      : item.status === "Delivered"
                        ? (<span className="text-red-500 font-bold"> ❌ Cancel </span>)
                        : (<span className="text-white font-bold"> -- </span>)
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* -------------------------------------------- */}
    </div>
  );
};

const StyledWrapper = styled.div`
  .radio-buttons-container {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .radio-button {
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  .radio-button__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-button__label {
    display: inline-block;
    padding-left: 30px;
    margin-bottom: 10px;
    position: relative;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .radio-button__custom {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #555;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .radio-button__input:checked + .radio-button__label .radio-button__custom {
    transform: translateY(-50%) scale(0.9);
    border: 5px solid #4c8bf5;
    color: #4c8bf5;
  }

  .radio-button__input:checked + .radio-button__label {
    color: #4c8bf5;
  }

  .radio-button__label:hover .radio-button__custom {
    transform: translateY(-50%) scale(1.2);
    border-color: #4c8bf5;
    box-shadow: 0 0 10px #4c8bf580;
  }
`;

export default Test;
