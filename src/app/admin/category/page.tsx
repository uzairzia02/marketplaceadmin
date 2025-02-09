'use client';

import { useState, useEffect } from 'react';
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from 'uuid';
import ProtectedRoute from '@/app/components/protected-route';

interface Category {
  _id: string;
  name: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await client.fetch(`*[_type == "category"]{_id, name}`);
        setCategories(result);
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
      };

      await client.create(newCategoryData);
      alert('✅ Category Added Successfully!');
      
      // Update category list
      setCategories((prev) => [...prev, newCategoryData]);
      setNewCategory('');
    } catch (error) {
      console.error('🚨 Error adding category:', error);
      alert('❌ Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-blue-600 text-white flex justify-between w-full h-20 items-center font-bold px-8">
        <h2 className="text-white text-3xl font-bold">Add Category</h2>
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
            <li key={cat._id} className="p-2 border-b">{cat.name}</li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default CategoryPage;
