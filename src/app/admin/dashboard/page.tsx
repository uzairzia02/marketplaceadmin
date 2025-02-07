'use client'
import React, { useState } from "react";
import Orders from "../orderdetails/page";
import AddProduct from "../addproduct/page";
import AllProducts from "../allproducts/page";
import { FaHeadphones } from "react-icons/fa";
import ProtectedRoute from "@/app/components/protected-route";

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
      default:
        return <Orders />;
    }
  };

  return (
    <ProtectedRoute>
    <div className=" min-h-screen flex">
      {/* Left Panel (Sidebar) */}
      
      <div className="w-[15%] bg-gray-800 text-white p-4 space-y-10 ">
      <div className="flex-col gap-2 sm:gap-3 md:gap-5 items-center">
                    <FaHeadphones className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10" />
                    <p className="text-sm sm:text-base md:text-xl font-semibold italic">
                      Accessories Hub
                    </p>
                  </div>
        <h2 className="text-4xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-5 " >
          <li
            onClick={() => setSelectedComponent("Orders")}
            className="cursor-pointer mb-2 hover:text-gray-400"
          >
            Orders
          </li>
          <li
            onClick={() => setSelectedComponent("AddProduct")}
            className="cursor-pointer mb-2 hover:text-gray-400"
          >
            Add Product
          </li>
          <li
            onClick={() => setSelectedComponent("AllProducts")}
            className="cursor-pointer mb-2 hover:text-gray-400"
          >
            All Products
          </li>
          <li>
            <a href="/" className="cursor-pointer mb-2 hover:text-red-800 text-red-500 ">
              Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Right Panel */}
      <div className="w-[85%] p-6">
        
        {renderComponent()}
      </div>
    </div>
    </ProtectedRoute>
  );
}
