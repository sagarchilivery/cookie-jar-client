"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Context } from "../../../context";
import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useContext(Context);
  const [isManager, setIsManager] = useState(false);
  const { user } = state;
  const [username, setUsername] = useState();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setIsManager(user.role === "MANAGER");
    } else {
      router.push("/");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const res = await api.post("/user/logout");
      dispatch({ type: "LOGOUT" });
      toast.success(res.data.message);
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <nav className="w-full backdrop-blur-lg bg-white/10 text-white shadow-lg fixed top-0 left-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-blue-400 hover:opacity-80 transition-all"
        >
          CookieJar
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {username && <span className="nav-link">Welcome, {username}</span>}
          {isManager && (
            <Link href="/add-arrival" className="nav-link">
              Add Arrival
            </Link>
          )}

          <button onClick={handleLogout} className=" cursor-pointer">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg border-t border-gray-700 shadow-lg transition-all">
          <Link
            href="/"
            className="block py-3 px-6 border-b border-gray-700 hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-3 px-6 border-b border-gray-700 hover:bg-white/10"
          >
            About
          </Link>
          <Link
            href="/services"
            className="block py-3 px-6 border-b border-gray-700 hover:bg-white/10"
          >
            Services
          </Link>
          <Link href="/contact" className="block py-3 px-6 hover:bg-white/10">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
