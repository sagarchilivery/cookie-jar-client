"use client";

import Baselayout from "@/components/baselayout/page";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddArrival() {
  const [arrival, setArrival] = useState({
    title: "",
    supplier: "",
    expectedArrivalDate: "",
    expected_boxes: null,
    expected_kilograms: null,
    expected_pallets: null,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "expectedArrivalDate") {
      const date = new Date(value);
      date.setUTCHours(10, 0, 0, 0); // Set time to 10:00:00.000 UTC
      setArrival({ ...arrival, [name]: date.toISOString() });
    } else {
      setArrival((prev) => ({
        ...prev,
        [name]:
          e.target.type === "number" ? (value ? Number(value) : null) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(arrival);

    if (
      arrival.title === "" ||
      arrival.supplier === "" ||
      arrival.expectedArrivalDate === "" ||
      arrival.expected_boxes === null ||
      arrival.expected_kilograms === null ||
      arrival.expected_pallets === null
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/arrival", arrival);
      if (res.data.success) {
        toast.success("Arrival added successfully");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Failed to add arrival");
    }
  };

  return (
    <Baselayout>
      <div className="w-full min-h-fit bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6 flex justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl p-8 max-w-lg w-full">
          <h3 className="text-3xl font-extrabold text-center text-blue-400 mb-6">
            📦 Add Arrival
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Arrival Title
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="title"
                id="title"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Supplier */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Supplier
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="supplier"
                id="supplier"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Expected Arrival Date */}
            <div>
              <label
                htmlFor="expectedArrivalDate"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Arrival Date
              </label>
              <input
                onChange={handleChange}
                type="date"
                name="expectedArrivalDate"
                id="expectedArrivalDate"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Expected Boxes */}
            <div>
              <label
                htmlFor="expected_boxes"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Boxes
              </label>
              <input
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                type="number"
                name="expected_boxes"
                id="expected_boxes"
                min={0}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Expected Pieces */}
            {/* <div>
              <label
                htmlFor="expected_quantity"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Pieces
              </label>
              <input
                onChange={handleChange}
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                name="expected_quantity"
                min={0}
                id="expected_quantity"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div> */}

            {/* Expected Kilograms */}
            <div>
              <label
                htmlFor="expected_kilograms"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Kilograms
              </label>
              <input
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                type="number"
                name="expected_kilograms"
                id="expected_kilograms"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Expected Pallets */}
            <div>
              <label
                htmlFor="expected_pallets"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Pallets
              </label>
              <input
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                type="number"
                name="expected_pallets"
                id="expected_pallets"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
            >
              Add Arrival
            </button>
          </form>
        </div>
      </div>
    </Baselayout>
  );
}
