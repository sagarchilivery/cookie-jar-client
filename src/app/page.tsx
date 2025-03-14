"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { Context } from "../../context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/user/login", loginData);
      dispatch({
        type: "LOGIN",
        payload: { user: response.data.data, token: response.data.token },
      });
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-8 rounded-2xl shadow-2xl w-[400px] text-center">
        <h3 className="text-4xl font-bold text-white mb-3">Welcome Back</h3>
        <p className="text-gray-400 mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            // type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Email"
            className="bg-white/10 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-white/10 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 transition-all duration-300 shadow-lg transform hover:scale-105">
            Login
          </button>
        </form>

        <p className="text-gray-400 mt-5 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
