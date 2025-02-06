'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from "@/sanity/lib/client"
import { v4 as uuidv4 } from 'uuid';

interface Category {
  _id: string;
  title: string;
}

const AddProduct = () => {
  const router = useRouter();
  const [productData, setProductData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null as string | null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await client.fetch(`*[_type == "category"]{_id, title}`);
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Generate slug from product name
  useEffect(() => {
    if (productData.name) {
      const generatedSlug = productData.name
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, ''); // Remove non-word characters
      setProductData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [productData.name]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageAsset = await client.assets.upload('image', file);
      setProductData((prev) => ({ ...prev, image: imageAsset._id }));
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('🚨 Image upload error:', error);
      alert('❌ Image upload failed!');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProduct = {
        _type: 'product',
        _id: uuidv4(),
        name: productData.name,
        slug: { current: productData.slug },
        description: productData.description,
        price: Number(productData.price),
        stock: Number(productData.stock),
        category: productData.category ? { _type: 'reference', _ref: productData.category } : undefined,
        image: productData.image ? { _type: 'image', asset: { _ref: productData.image } } : undefined,
      };

      const response = await client.create(newProduct);
      alert('✅ Product Added Successfully!');
      console.log('Sanity Response:', response);

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('🚨 Error adding product:', error);
      alert('❌ Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-blue-600 text=white flex justify-between w-[100%] h-20 items-center font-bold px-8 ">
        <h2 className="text-white text-3xl font-bold">Add New Product</h2>
      </div>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="slug"
            placeholder="Product Slug"
            value={productData.slug}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            readOnly
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={productData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Product Stock"
            value={productData.stock}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-black "
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>

          <input type="file" onChange={handleImageUpload} className="w-full p-2 border rounded" />

          <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded">
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
