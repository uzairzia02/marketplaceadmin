"use client";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProtectedRoute from "../../components/protected/page";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: { name: string };
  stock: number;
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "product"]{
          _id,
          name,
          "image": image.asset->url,
          price,
          description,
          category-> { name },
          stock
        }`
      )
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error fetching products", error));
  }, []);

  return (
    <ProtectedRoute>
        <div className="bg-blue-600 text=white flex justify-between w-[100%] h-20 items-center font-bold px-8 ">
      <h2 className="text-white text-3xl font-bold">All Product</h2>
        </div>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md">
              <Image
  src={product.image ? urlFor(product.image).url() : "/placeholder.jpg"}
  alt={product.name}
  width={200}
  height={200}
  objectFit="cover"
/>
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600 line-clamp-3 ">{product.description}</p>
              <p className="text-blue-500 font-bold">${product.price}</p>
              <p className="text-gray-500">Category: {product.category.name}</p>
              <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
