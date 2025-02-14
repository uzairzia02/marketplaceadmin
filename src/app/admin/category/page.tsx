'use client';

import { useState, useEffect } from 'react';
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from 'uuid';
import ProtectedRoute from '@/app/components/protected-route';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await client.fetch(`*[_type == "category"]{_id, name, "image": image.asset->url}`);
        setCategories(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageAsset = await client.assets.upload('image', file);
      setImageId(imageAsset._id);
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('🚨 Image upload error:', error);
      alert('❌ Image upload failed!');
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('❌ Category name cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const newCategoryData = {
        _type: 'category',
        _id: uuidv4(),
        name: newCategory,
        image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } } : undefined,
      };

      await client.create(newCategoryData);
      alert('✅ Category Added Successfully!');

      setCategories((prev) => [...prev, { ...newCategoryData, image: imageId || undefined }]);
      setNewCategory('');
      setImageId(null);
    } catch (error) {
      console.error('🚨 Error adding category:', error);
      alert('❌ Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (categoryId: string) => {
    if (!editCategoryName.trim()) {
      alert('❌ Category name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updatedCategoryData = {
        name: editCategoryName,
        ...(imageId && { image: { _type: 'image', asset: { _type: 'reference', _ref: imageId } } }),
      };

      await client.patch(categoryId).set(updatedCategoryData).commit();
      alert('✅ Category Updated Successfully!');

      setCategories((prev) =>
        prev.map((cat) => (cat._id === categoryId ? { ...cat, name: editCategoryName, image: imageId || cat.image } : cat))
      );

      setEditCategoryId(null);
      setEditCategoryName('');
      setImageId(null);
    } catch (error) {
      console.error('🚨 Error updating category:', error);
      alert('❌ Failed to update category.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category delete
  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this category?')) return;

    try {
      await client.delete(categoryId);
      alert('✅ Category Deleted Successfully!');
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    } catch (error) {
      console.error('🚨 Error deleting category:', error);
      alert('❌ Failed to delete category.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-blue-600 text-white flex justify-between w-full h-20 items-center font-bold px-8">
        <h2 className="text-white text-3xl font-bold">Manage Categories</h2>
      </div>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
        <input
          type="text"
          name="category"
          placeholder="Category Name"
          value={newCategory}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input type="file" onChange={handleImageUpload} className="w-full p-2 border rounded" />

        <button
          onClick={handleAddCategory}
          disabled={loading}
          className="w-full mt-4 p-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>

        <h3 className="text-xl font-bold mt-6">Existing Categories</h3>
        <ul className="mt-2">
          {categories.map((cat) => (
            <li key={cat._id} className="p-2 border-b flex items-center gap-4 ">
              {cat.image && <Image src={cat.image} alt={cat.name} width={100} height={100} className="w-12 h-12 object-cover rounded" />}
              {editCategoryId === cat._id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button
                    onClick={() => handleUpdateCategory(cat._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditCategoryId(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <button
                    onClick={() => {
                      setEditCategoryId(cat._id);
                      setEditCategoryName(cat.name);
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded jus "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default CategoryPage;
