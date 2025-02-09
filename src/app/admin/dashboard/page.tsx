'use client'
import React, { useState } from "react";
import Orders from "../orderdetails/page";
import AddProduct from "../addproduct/page";
import AllProducts from "../allproducts/page";
import Categories from "../category/page"
import { FaHeadphones } from "react-icons/fa";
import ProtectedRoute from "@/app/components/protected-route";
import Sales from "../sales/page";

export default function Dashboard1() {
  const [selectedComponent, setSelectedComponent] = useState("Orders");

  // Render the component based on the selected value
  const renderComponent = () => {
    switch (selectedComponent) {
      case "Orders":
        return <Orders />;
      case "AddProduct":
        return <AddProduct />;
      case "AllProducts":
        return <AllProducts />;
        case "Categories":
        return <Categories />;
        case "Sales":
        return <Sales />;
      default:
        return <Orders />;
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[20%] lg:w-[15%] bg-gray-800 text-white p-4 space-y-10 flex md:block justify-between md:justify-start">
        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-5">
          <FaHeadphones className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10" />
          <p className="text-sm sm:text-base md:text-xl font-semibold italic">Accessories Hub</p>
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Dashboard</h2>
          <ul className="space-y-2 md:space-y-5">
            <li
              onClick={() => setSelectedComponent("Orders")}
              className="cursor-pointer hover:text-gray-400"
            >
              Orders
            </li>
            <li
              onClick={() => setSelectedComponent("Sales")}
              className="cursor-pointer hover:text-gray-400"
            >
              Sales
            </li>
            <li
              onClick={() => setSelectedComponent("Categories")}
              className="cursor-pointer hover:text-gray-400"
            >
              Cagetory
            </li>
            <li
              onClick={() => setSelectedComponent("AddProduct")}
              className="cursor-pointer hover:text-gray-400"
            >
              Add Product
            </li>
            <li
              onClick={() => setSelectedComponent("AllProducts")}
              className="cursor-pointer hover:text-gray-400"
            >
              All Products
            </li>
            <li>
  <button
    onClick={() => {
      localStorage.removeItem("isLoggedIn"); 
      window.location.href = "/"; 
    }}
    className="cursor-pointer hover:text-red-800 text-red-500"
  >
    Logout
  </button>
</li>

          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[80%] lg:w-[85%] p-4 sm:p-6">
        {renderComponent()}
      </div>
    </div>
    </ProtectedRoute>
  );
}
