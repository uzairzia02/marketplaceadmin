"use client";
import { client } from "@/sanity/lib/client";
import React, { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "../../components/protected-route";

interface CartItem {
  product?: {
    name: string;
  };
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Shipping {
  _id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: string;
  grandTotal: number;
  orderDate: string;
  status: string | null;
  cartItems: CartItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Shipping[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "shipping"] | order(_createdAt desc){
        _id,
        firstName,
        lastName,
        email,
        address,
        contactNumber,
        city,
        province,
        postalCode,
        paymentMethod,
        grandTotal,
        orderDate,
        status,
        cartItems[] {
          quantity,
          price,
          product-> {
            name
          }
        }
      }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("error fetching products", error));
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);
  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await client.delete(orderId);
      setOrders((prevOrder) =>
        prevOrder.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Failed to delete order:", error);
      Swal.fire("Error!", "Failed to delete order.", "error");
    }
  };
  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (newStatus === "shipped") {
        Swal.fire("Shipped!", "Order has been shipped.", "success");
      } else if (newStatus === "delivered") {
        Swal.fire("Delivered!", "Order has been delivered.", "success");
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      Swal.fire("Error!", "Failed to update order status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center ">
        <nav className="bg-blue-600 text=white flex justify-between w-[100%] h-20 items-center font-bold px-8 ">
          <h2 className="text-white text-3xl font-bold">Order Details</h2>
          <div className="flex space-x-4">
            {["All", "pending", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                className={`text-white ${filter === status ? "bg-blue-800" : "bg-blue-600"} hover:bg-blue-800 px-4 py-2 rounded-md`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className=" flex-1 p-6 overflow-y-auto w-[100%] justify-between ">
          <div className="bg-white rounded-lg shadow-sm ">
            <table className="w-[100%] text-center">
              <thead>
                <tr className="text-center justify-between items-center flex-1 ">
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Province</th>
                  <th>Postal Code</th>
                  <th>Payment Method</th>
                  <th>Grand Total</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer items-center text-center hover:bg-blue-200 transition-all duration-300 "
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td>{order._id}</td>
                      <td>
                        {order.firstName} {order.lastName}
                      </td>
                      <td>{order.address}</td>
                      <td>{order.city}</td>
                      <td>{order.province}</td>
                      <td>{order.postalCode}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.grandTotal.toFixed(2)}</td>
                      <td>
                        {" "}
                        {new Date(order.orderDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}{" "}
                      </td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-gray-200 p-1 rounded "
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      {/* <td>{order.orderDate}</td> */}
                      <td className="px-6 py-4 ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition "
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {selectedOrderId === order._id && (
                      <tr>
                        <td className="bg-gray-50 p-4 transition-all ">
                          <h3 className=" font-bold ">Order Details</h3>
                          <p>
                            Phone: <strong> {order.contactNumber} </strong>{" "}
                          </p>
                          <p>
                            Email: <strong> {order.email} </strong>{" "}
                          </p>
                          <p>
                            City: <strong> {order.city} </strong>{" "}
                          </p>
                          <p></p>

                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li
                                className="flex items-center space-x-4 border-2 justify-between "
                                key={`${order._id}-${index}`}
                              >
                                <span className="font-semibold min-w-max ">
                                  {item.product?.name}
                                </span>
                                <span className="min-w-max ">
                                  Qty: {item.quantity}
                                </span>
                                <span className="min-w-max ">
                                  Price: ${item.price.toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
