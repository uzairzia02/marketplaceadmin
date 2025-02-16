"use client";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProtectedRoute from "../../components/protected-route";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: { _id: string; name: string };
  stock: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "product"]{
          _id,
          name,
          "image": image.asset->url,
          price,
          description,
          category-> { _id, name },
          stock
        }`
      );
      setProducts(data);
      setFilteredProducts(data); // Default: Show all products
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await client.fetch(`*[_type == "category"]{ _id, name }`);
      setCategories(data);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const handleFilterChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category._id === categoryId);
      setFilteredProducts(filtered);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;
    try {
      await client
        .patch(editProduct._id)
        .set({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          stock: updatedProduct.stock,
          category: { _ref: updatedProduct.category?._id }, // Update category reference
        })
        .commit();

      alert("✅ Product updated successfully");
      setEditProduct(null);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error("Error updating product", error);
      alert("❌ Product update failed");
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-blue-600 text-white flex justify-between w-full h-20 items-center font-bold px-8">
        <h2 className="text-3xl font-bold">All Products</h2>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Filter by Category:</h3>
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md flex flex-col">
              <Image
                src={product.image ? urlFor(product.image).url() : "/placeholder.jpg"}
                alt={product.name}
                width={200}
                height={200}
                objectFit="cover"
              />
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600 line-clamp-3">{product.description}</p>
              <p className="text-blue-500 font-bold">${product.price}</p>
              <p className="text-gray-500">Category: {product.category.name}</p>
              <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => {
                    setEditProduct(product);
                    setUpdatedProduct({
                      name: product.name,
                      price: product.price,
                      description: product.description,
                      stock: product.stock,
                      category: product.category, // Pre-fill category
                    });
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={async () => {
                    try {
                      await client.delete(product._id);
                      setProducts(products.filter((p) => p._id !== product._id));
                      alert("✅ Product deleted successfully");
                    } catch (error) {
                      console.error("Error deleting product", error);
                      alert("❌ Product not deleted because an order is already in place");
                    }
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              value={updatedProduct.name || ""}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Product Name"
            />
            <input
              type="number"
              value={updatedProduct.price || ""}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: Number(e.target.value) })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Price"
            />
            <textarea
              value={updatedProduct.description || ""}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
            ></textarea>
            <input
              type="number"
              value={updatedProduct.stock || ""}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock: Number(e.target.value) })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Stock"
            />

            {/* Category Dropdown */}
            <select
              value={updatedProduct.category?._id || ""}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  category: categories.find((cat) => cat._id === e.target.value) || updatedProduct.category,
                })
              }
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button onClick={handleUpdateProduct} className="w-full p-2 bg-blue-600 text-white rounded">
                Save Changes
              </button>
              <button onClick={() => setEditProduct(null)} className="w-full p-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
