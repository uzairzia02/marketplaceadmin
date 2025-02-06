"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaHeadphones } from "react-icons/fa";
import { client } from "../../sanity/lib/client"; // Ensure you have your sanity client setup
import { useRouter } from "next/navigation";

export default function SignIn() {

    const router = useRouter()
        const [formValues, setFormValues] = useState({
            email: "",
            password: "",
        })
        const [error, setError] = useState("")
        const [loading, setLoading] = useState(false);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        };
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            setError("");

            const { email, password } = formValues;

            try {
                const query = `[_type == "adminUser" && email == $email][0]`;
                const params = { email };
                const user = await client.fetch(query, params);
                if (!user) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }
                if (user.password !== password) {
                    setError("Invalid password");
                    setLoading(false);
                    return;
                }
                router.push("/dashboard");

                
            } catch (error) {
                console.error("Error signing in:", error);
                setError("Error signing in. Please try again");
            } finally {
                setLoading(false);
            }
            
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
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="w-full aspect-[12/11] object-contain"
              alt="login-image"
            />
          </div>

          <form
            className="md:max-w-md w-full mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="mb-12">
              <h3 className="text-4xl font-bold text-blue-600">Sign in</h3>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center mb-4">{error}</p>
            )}

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-[18px] h-[18px] absolute right-2"
                viewBox="0 0 682.667 682.667"
              >
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z"></path>
                  </clipPath>
                </defs>
                <g
                  clipPath="url(#a)"
                  transform="matrix(1.33 0 0 -1.33 0 682.667)"
                >
                  <path
                    fill="none"
                    strokeMiterlimit="10"
                    strokeWidth="40"
                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  ></path>
                  <path
                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  ></path>
                </g>
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                viewBox="0 0 128 128"
              >
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"></path>
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="text-gray-800 ml-3 block text-sm"
                >
                  Remember me
                </label>
              </div>
              <div>
                <a
                  href="javascript:void(0);"
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
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
