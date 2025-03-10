"use client";

import Baselayout from "@/components/baselayout/page";
import api from "@/utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../context";
import toast from "react-hot-toast";
import Link from "next/link";
import Modal from "@/components/modal";

export default function Dashboard() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [upcomingArrivals, setUpcomingArrivals] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [updateArrival, setUpdateArrival] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const fetchUpcomingArrivals = async () => {
    try {
      // const res = await api.get("/arrival?status=UPCOMING");
      const res = await api.get("/arrival");
      setUpcomingArrivals(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/arrival/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUpcomingArrivals();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.patch(
        `/arrival/${updateArrival.id}`,
        updateArrival
      );
      if (res.data.success) {
        toast.success("Arrival updated successfully");
        fetchUpcomingArrivals();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update arrival");
      console.error(error);
    }
  };

  const handleDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "expectedArrivalDate") {
      const date = new Date(value);
      date.setUTCHours(10, 0, 0, 0); // Set time to 10:00:00.000 UTC
      setUpdateArrival({ ...updateArrival, [name]: date.toISOString() });
    }
  };

  const handleStartProcessing = (arrival: any) => async () => {
    try {
      const res = await api.patch(`/arrival/${arrival.id}`, {
        ...arrival,
        status: "IN_PROGRESS",
      });
      if (res.data.success) {
        toast.success("Arrival processing started");
        fetchUpcomingArrivals();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUpcomingArrivals();
  }, []);

  useEffect(() => {
    if (user) {
      setIsManager(user.role === "MANAGER");
    }
  }, [user]);

  return (
    <Baselayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6">
        {upcomingArrivals.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400 drop-shadow-lg">
              📦Arrivals
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14">
              {upcomingArrivals.map((arrival: any) => (
                <div
                  key={arrival.id}
                  className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg transition-transform transform hover:scale-105"
                >
                  <h2 className="text-2xl font-semibold text-blue-300">
                    {arrival.title}
                  </h2>
                  <p className="text-lg mt-2 text-gray-300">
                    🏭 <span className="font-medium">Supplier:</span>{" "}
                    {arrival.supplier}
                  </p>
                  <p className="text-lg text-gray-300">
                    📅 <span className="font-medium">Expected Date:</span>{" "}
                    {new Date(arrival.expectedArrivalDate).toLocaleDateString()}
                  </p>
                  <p className="text-lg text-gray-300">
                    📦 <span className="font-medium">Expected Boxes:</span>{" "}
                    {arrival.expected_boxes}
                  </p>
                  <p className="text-lg text-gray-300">
                    ⚖️ <span className="font-medium">Expected Kilograms:</span>{" "}
                    {arrival.expected_kilograms}
                  </p>
                  <p className="text-lg text-gray-300">
                    🧇 <span className="font-medium">Expected Pallets:</span>{" "}
                    {arrival.expected_pallets}
                  </p>
                  <p className="text-lg text-gray-300">
                    🧰 <span className="font-medium">Status:</span>{" "}
                    {arrival.status}
                  </p>

                  <div className="flex gap-5 pt-4">
                    {isManager ? (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setUpdateArrival(arrival);
                          }}
                          className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(arrival.id)}
                          className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-red-600 bg-red-400"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <Link
                        href={`/start-processing/${arrival.id}`}
                        onClick={handleStartProcessing(arrival)}
                        className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800"
                      >
                        Start Proccessing
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-400">
            🚫 No upcoming arrivals
          </p>
        )}
      </div>

      {isOpen && (
        <Modal
          title="✏️ Update Arrival"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          children={
            <>
              <div className="space-y-5 mt-6">
                <div>
                  <label className="block text-gray-300 text-lg">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
                    value={updateArrival.title}
                    onChange={(e) =>
                      setUpdateArrival({
                        ...updateArrival,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-lg">
                    Supplier
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
                    value={updateArrival.supplier}
                    onChange={(e) =>
                      setUpdateArrival({
                        ...updateArrival,
                        supplier: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="expectedArrivalDate"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Expected Arrival Date
                  </label>
                  <input
                    onChange={handleDateUpdate}
                    type="date"
                    name="expectedArrivalDate"
                    id="expectedArrivalDate"
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-lg">
                      Expected Boxes
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
                      value={updateArrival.expected_boxes || ""}
                      onChange={(e) =>
                        setUpdateArrival({
                          ...updateArrival,
                          expected_boxes: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-lg">
                      Expected Kilograms
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
                      value={updateArrival.expected_kilograms || ""}
                      onChange={(e) =>
                        setUpdateArrival({
                          ...updateArrival,
                          expected_kilograms: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-lg">
                      Expected Pallets
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
                      value={updateArrival.expected_pallets || ""}
                      onChange={(e) =>
                        setUpdateArrival({
                          ...updateArrival,
                          expected_pallets: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-200"
                >
                  Save
                </button>
              </div>
            </>
          }
        />
      )}
    </Baselayout>
  );
}
