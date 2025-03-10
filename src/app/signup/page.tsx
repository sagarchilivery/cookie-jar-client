"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Context } from "../../../context";
import Link from "next/link";

export default function Signup() {
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/register", registerData);
      dispatch({
        type: "LOGIN",
        payload: { user: res.data.data, token: res.data.token },
      });
      toast.success("Registration successful!");
      router.push("/dashboard"); // Redirect to login after signup
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-8 rounded-2xl shadow-2xl w-[400px] text-center">
        <h3 className="text-4xl font-bold text-white mb-3">Create Account</h3>
        <p className="text-gray-400 mb-6">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            // type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Email"
            className="bg-white/10 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Username"
            className="bg-white/10 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-white/10 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 transition-all duration-300 shadow-lg transform hover:scale-105">
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 mt-5 text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
