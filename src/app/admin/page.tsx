"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaHeadphones } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProtectedRoute from "../components/protected-route";

export default function SignIn() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = formValues;

    if (email === "uzair@hotmail.com" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white flex items-center justify-center md:h-screen p-4">
      <div className="shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)] max-w-6xl max-md:max-w-lg rounded-md p-6">
        <Link href={"/"}>
          <div className="flex gap-2 sm:gap-3 md:gap-5 items-center">
            <FaHeadphones className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10" />
            <p className="text-sm sm:text-base md:text-xl font-semibold italic">
              Accessories Hub
            </p>
          </div>
        </Link>

        <div className="grid md:grid-cols-2 items-center gap-8">
          <div className="max-md:order-1">
            <Image
              src="https://readymadeui.com/signin-image.webp"
              className="w-full aspect-[12/11] object-contain"
              alt="login-image"
              width={500}
              height={500}
            />
          </div>

          <form className="md:max-w-md w-full mx-auto" onSubmit={handleSubmit}>
            <div className="mb-12">
              <h3 className="text-4xl font-bold text-blue-600">Sign in</h3>
            </div>

            {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                required
                className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-8 relative flex items-center">
              <input
                name="password"
                type="password"
                required
                className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter password"
                value={formValues.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-12">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
