"use client";

import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/protected-route";

interface CartItem {
  product?: {
    name: string;
    category?: {
      name: string;
    };
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderDate: string;
  cartItems: CartItem[];
}

interface ProductSales {
  name: string;
  category?: string;
  totalQuantity: number;
  unitPrice: number;
  shippingDate: string;
  totalSales: number;
}

export default function Sales() {
  const [salesData, setSalesData] = useState<ProductSales[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "shipping"]{
          _id,
          orderDate,
          cartItems[] {
            quantity,
            price,
            product-> {
              name,
              category-> {
                name
              }
            }
          }
        }`
      )
      .then((orders: Order[]) => {
        const productSalesMap: Record<string, ProductSales> = {};

        orders.forEach((order) => {
          order.cartItems.forEach((item) => {
            if (item.product?.name) {
              const productName = item.product.name;
              const category = item.product?.category?.name ?? "Unknown";
              const unitPrice = item.price;
              const shippingDate = new Date(order.orderDate).toLocaleDateString(
                "en-US"
              );

              if (!productSalesMap[productName]) {
                productSalesMap[productName] = {
                  name: productName,
                  category,
                  totalQuantity: 0,
                  unitPrice,
                  shippingDate,
                  totalSales: 0,
                };
              }
              productSalesMap[productName].totalQuantity += item.quantity;
              productSalesMap[productName].totalSales =
                productSalesMap[productName].totalQuantity * unitPrice;
            }
          });
        });

        setSalesData(Object.values(productSalesMap));
      })
      .catch((error) => console.log("Error fetching sales data", error));
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-blue-600 text-white flex justify-between w-full h-20 items-center font-bold px-8">
        <h2 className="text-white text-3xl font-bold">Sales Report</h2>
      </div>
      <div className="p-6">
        <div className="bg-white p-4 shadow-md rounded-md">
          <table className="w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Quantity Sold</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((product) => (
                <tr key={product.name} className="hover:bg-gray-100">
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">{product.totalQuantity}</td>
                  <td className="p-2 border">
                    ${product.unitPrice.toFixed(2)}
                  </td>
                  <td className="p-2 border font-bold">
                    ${product.totalSales.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-bold text-4xl w-[100%] italic bg-gray-400 justify-between flex px-10 pl-36 ">
            <p>Total Sales</p>
            <p>
              $
              {salesData
                .reduce((total, product) => total + product.totalSales, 0)
                .toFixed(2)}{" "}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
