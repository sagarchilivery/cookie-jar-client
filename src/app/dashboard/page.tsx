// "use client";

// import Baselayout from "@/components/baselayout/page";
// import api from "@/utils/axiosInstance";
// import { useContext, useEffect, useState } from "react";
// import { Context } from "../../../context";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import Modal from "@/components/modal";
// import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// export default function Dashboard() {
//   const { state, dispatch } = useContext(Context);
//   const { user } = state;
//   const [upcomingArrivals, setUpcomingArrivals] = useState([]);
//   const [inProgressArrivals, setInProgressArrivals] = useState([]);
//   const [finishedArrivals, setFinishedArrivals] = useState([]);
//   const [isManager, setIsManager] = useState(false);
//   const [updateArrival, setUpdateArrival] = useState<any>({});
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [updatingArrival, setUpdatingArrival] = useState(false);
//   const [deletingArrival, setDeletingArrival] = useState("");
//   const [processingArrival, setProcessingArrival] = useState("");
//   const [arrivals, setArrivals] = useState<any>([]);
//   const [activeTabIndex, setActiveTabIndex] = useState(0);

//   const fetchArrivals = async ({
//     status = "UPCOMING",
//     sort = "asc",
//   }: {
//     status?: string;
//     sort?: string;
//   }) => {
//     try {
//       const res = await api.get(`/arrival?status=${status}&sort=${sort}`);
//       if (status === "UPCOMING") {
//         setUpcomingArrivals(res.data.data);
//         if (activeTabIndex === 0) setArrivals(res.data.data);
//       }
//       if (status === "IN_PROGRESS") {
//         setInProgressArrivals(res.data.data);
//         if (activeTabIndex === 1) setArrivals(res.data.data);
//       }
//       if (status === "FINISHED") {
//         setFinishedArrivals(res.data.data);
//         if (activeTabIndex === 2) setArrivals(res.data.data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch arrivals");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     setDeletingArrival(id);
//     try {
//       const res = await api.delete(`/arrival/${id}`);
//       if (res.data.success) {
//         toast.success(res.data.message);
//         fetchArrivals({ status: "UPCOMING" });
//         fetchArrivals({ status: "IN_PROGRESS" });
//         fetchArrivals({ status: "FINISHED" });
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     } finally {
//       setDeletingArrival("");
//     }
//   };

//   const handleUpdate = async () => {
//     setUpdatingArrival(true);
//     try {
//       const res = await api.patch(
//         `/arrival/${updateArrival.id}`,
//         updateArrival
//       );
//       if (res.data.success) {
//         toast.success("Arrival updated successfully");
//         fetchArrivals({ status: "UPCOMING" });
//         fetchArrivals({ status: "IN_PROGRESS" });
//         fetchArrivals({ status: "FINISHED" });
//         setIsOpen(false);
//       }
//     } catch (error) {
//       toast.error("Failed to update arrival");
//       console.error(error);
//     } finally {
//       setUpdatingArrival(false);
//     }
//   };

//   const handleDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "expectedArrivalDate") {
//       const date = new Date(value);
//       date.setUTCHours(10, 0, 0, 0); // Set time to 10:00:00.000 UTC
//       setUpdateArrival({ ...updateArrival, [name]: date.toISOString() });
//     }
//   };

//   const handleStartProcessing = (arrival: any) => async () => {
//     setProcessingArrival(arrival.id);
//     try {
//       const res = await api.patch(`/arrival/${arrival.id}`, {
//         ...arrival,
//         status: "IN_PROGRESS",
//       });
//       if (res.data.success) {
//         toast.success("Arrival processing started");
//         fetchArrivals({ status: "UPCOMING" });
//         fetchArrivals({ status: "IN_PROGRESS" });
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     } finally {
//       setProcessingArrival("");
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchArrivals({ status: "UPCOMING" }),
//           fetchArrivals({ status: "IN_PROGRESS" }),
//           fetchArrivals({ status: "FINISHED" }),
//         ]);
//       } catch (error) {
//         console.error("Failed to load data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       setIsManager(user.role === "MANAGER");
//     }
//   }, [user]);

//   const handletabChange = (index: number) => {
//     setActiveTabIndex(index);
//     if (index === 0) {
//       setArrivals(upcomingArrivals);
//     } else if (index === 1) {
//       setArrivals(inProgressArrivals);
//     } else if (index === 2) {
//       setArrivals(finishedArrivals);
//     }
//   };

//   // Loading spinner component
//   const LoadingSpinner = () => (
//     <div className="flex justify-center items-center h-64 w-full col-span-2">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//     </div>
//   );

//   // Button with loading state
//   const ActionButton = ({
//     onClick,
//     isLoading,
//     className,
//     children,
//   }: {
//     onClick: () => void;
//     isLoading: boolean;
//     className: string;
//     children: React.ReactNode;
//   }) => (
//     <button
//       onClick={onClick}
//       disabled={isLoading}
//       className={`${className} relative disabled:opacity-70`}
//     >
//       {isLoading && (
//         <span className="absolute inset-0 flex items-center justify-center">
//           <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
//         </span>
//       )}
//       <span className={isLoading ? "opacity-0" : ""}>{children}</span>
//     </button>
//   );

//   return (
//     <Baselayout>
//       <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400 drop-shadow-lg">
//             📦Arrivals
//           </h1>

//           <TabGroup
//             defaultIndex={0}
//             className="w-full"
//             onChange={handletabChange}
//           >
//             <TabList className="flex gap-4 justify-center pb-8 text-2xl">
//               {["Upcoming", "In Progress", "Finished"].map((tab, index) => (
//                 <Tab
//                   key={index}
//                   className="data-[selected]:bg-blue-800 rounded-md text-xl px-6 py-1 data-[selected]:text-slate-100 data-[hover]:text-bold text-slate-300 outline-0 ring-0"
//                 >
//                   {tab}
//                 </Tab>
//               ))}
//             </TabList>
//             <TabPanels className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 w-full">
//               {loading ? (
//                 <LoadingSpinner />
//               ) : arrivals.length > 0 ? (
//                 arrivals.map((arrival: any) => (
//                   <div
//                     key={arrival.id}
//                     className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg transition-transform transform hover:scale-105 w-full"
//                   >
//                     <h2 className="text-2xl font-semibold text-blue-300">
//                       {arrival.title}
//                     </h2>
//                     <p className="text-lg mt-2 text-gray-300">
//                       🏭 <span className="font-medium">Supplier:</span>{" "}
//                       {arrival.supplier}
//                     </p>
//                     <p className="text-lg text-gray-300">
//                       📅 <span className="font-medium">Expected Date:</span>{" "}
//                       {new Date(
//                         arrival.expectedArrivalDate
//                       ).toLocaleDateString()}
//                     </p>
//                     <p className="text-lg text-gray-300">
//                       📦 <span className="font-medium">Expected Boxes:</span>{" "}
//                       {arrival.expected_boxes}
//                     </p>
//                     <p className="text-lg text-gray-300">
//                       ⚖️{" "}
//                       <span className="font-medium">Expected Kilograms:</span>{" "}
//                       {arrival.expected_kilograms}
//                     </p>
//                     <p className="text-lg text-gray-300">
//                       🧇 <span className="font-medium">Expected Pallets:</span>{" "}
//                       {arrival.expected_pallets}
//                     </p>
//                     <p className="text-lg text-gray-300">
//                       🧰 <span className="font-medium">Status:</span>{" "}
//                       {arrival.status}
//                     </p>

//                     <div className="flex gap-5 pt-4">
//                       {isManager ? (
//                         <>
//                           <ActionButton
//                             onClick={() => {
//                               setIsOpen(true);
//                               setUpdateArrival(arrival);
//                             }}
//                             isLoading={false}
//                             className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800"
//                           >
//                             Edit
//                           </ActionButton>
//                           <ActionButton
//                             onClick={() => handleDelete(arrival.id)}
//                             isLoading={deletingArrival === arrival.id}
//                             className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-red-600 bg-red-400"
//                           >
//                             Delete
//                           </ActionButton>
//                         </>
//                       ) : (
//                         arrival.status !== "FINISHED" && (
//                           <Link
//                             href={`/start-processing/${arrival.id}`}
//                             className={`cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800 relative ${
//                               processingArrival === arrival.id
//                                 ? "pointer-events-none opacity-70"
//                                 : ""
//                             }`}
//                             onClick={handleStartProcessing(arrival)}
//                           >
//                             {processingArrival === arrival.id ? (
//                               <>
//                                 <span className="absolute inset-0 flex items-center justify-center">
//                                   <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
//                                 </span>
//                                 <span className="opacity-0">
//                                   Start Processing
//                                 </span>
//                               </>
//                             ) : arrival.status === "IN_PROGRESS" ? (
//                               "Continue Processing"
//                             ) : (
//                               "Start Processing"
//                             )}
//                           </Link>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center w-full col-span-2 h-[350px] flex items-center justify-center text-xl text-gray-400">
//                   <span className="text-2xl">🚫 No arrivals found</span>
//                 </p>
//               )}
//             </TabPanels>
//           </TabGroup>
//         </div>
//       </div>

//       {isOpen && (
//         <Modal
//           title="✏️ Update Arrival"
//           isOpen={isOpen}
//           setIsOpen={setIsOpen}
//           children={
//             <>
//               <div className="space-y-5 mt-6">
//                 <div>
//                   <label className="block text-gray-300 text-lg">Title</label>
//                   <input
//                     type="text"
//                     className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
//                     value={updateArrival.title}
//                     onChange={(e) =>
//                       setUpdateArrival({
//                         ...updateArrival,
//                         title: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-300 text-lg">
//                     Supplier
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
//                     value={updateArrival.supplier}
//                     onChange={(e) =>
//                       setUpdateArrival({
//                         ...updateArrival,
//                         supplier: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="expectedArrivalDate"
//                     className="block text-sm font-medium text-gray-300 mb-1"
//                   >
//                     Expected Arrival Date
//                   </label>
//                   <input
//                     onChange={handleDateUpdate}
//                     type="date"
//                     name="expectedArrivalDate"
//                     id="expectedArrivalDate"
//                     className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-300 text-lg">
//                       Expected Boxes
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
//                       value={updateArrival.expected_boxes || ""}
//                       onChange={(e) =>
//                         setUpdateArrival({
//                           ...updateArrival,
//                           expected_boxes: parseInt(e.target.value, 10) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-300 text-lg">
//                       Expected Kilograms
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
//                       value={updateArrival.expected_kilograms || ""}
//                       onChange={(e) =>
//                         setUpdateArrival({
//                           ...updateArrival,
//                           expected_kilograms: parseInt(e.target.value, 10) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-300 text-lg">
//                       Expected Pallets
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-gray-500"
//                       value={updateArrival.expected_pallets || ""}
//                       onChange={(e) =>
//                         setUpdateArrival({
//                           ...updateArrival,
//                           expected_pallets: parseInt(e.target.value, 10) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
//                   disabled={updatingArrival}
//                 >
//                   Cancel
//                 </button>
//                 <ActionButton
//                   onClick={handleUpdate}
//                   isLoading={updatingArrival}
//                   className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-200"
//                 >
//                   Save
//                 </ActionButton>
//               </div>
//             </>
//           }
//         />
//       )}
//     </Baselayout>
//   );
// }

"use client";

import Baselayout from "@/components/baselayout/page";
import api from "@/utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../context";
import toast from "react-hot-toast";
import Link from "next/link";
import Modal from "@/components/modal";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default function Dashboard() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [upcomingArrivals, setUpcomingArrivals] = useState([]);
  const [inProgressArrivals, setInProgressArrivals] = useState([]);
  const [finishedArrivals, setFinishedArrivals] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [updateArrival, setUpdateArrival] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingArrival, setUpdatingArrival] = useState(false);
  const [deletingArrival, setDeletingArrival] = useState("");
  const [processingArrival, setProcessingArrival] = useState("");
  const [arrivals, setArrivals] = useState<any>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchArrivals = async ({
    status = "UPCOMING",
    sort = sortOrder,
  }: {
    status?: string;
    sort?: string;
  }) => {
    try {
      const res = await api.get(`/arrival?status=${status}&sort=${sort}`);
      if (status === "UPCOMING") {
        setUpcomingArrivals(res.data.data);
        if (activeTabIndex === 0) setArrivals(res.data.data);
      }
      if (status === "IN_PROGRESS") {
        setInProgressArrivals(res.data.data);
        if (activeTabIndex === 1) setArrivals(res.data.data);
      }
      if (status === "FINISHED") {
        setFinishedArrivals(res.data.data);
        if (activeTabIndex === 2) setArrivals(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch arrivals");
    }
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Refresh data with new sort order
    if (activeTabIndex === 0) {
      fetchArrivals({ status: "UPCOMING", sort: newSortOrder });
    } else if (activeTabIndex === 1) {
      fetchArrivals({ status: "IN_PROGRESS", sort: newSortOrder });
    } else if (activeTabIndex === 2) {
      fetchArrivals({ status: "FINISHED", sort: newSortOrder });
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingArrival(id);
    try {
      const res = await api.delete(`/arrival/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchArrivals({ status: "UPCOMING" });
        fetchArrivals({ status: "IN_PROGRESS" });
        fetchArrivals({ status: "FINISHED" });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setDeletingArrival("");
    }
  };

  const handleUpdate = async () => {
    setUpdatingArrival(true);
    try {
      const res = await api.patch(
        `/arrival/${updateArrival.id}`,
        updateArrival
      );
      if (res.data.success) {
        toast.success("Arrival updated successfully");
        fetchArrivals({ status: "UPCOMING" });
        fetchArrivals({ status: "IN_PROGRESS" });
        fetchArrivals({ status: "FINISHED" });
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update arrival");
      console.error(error);
    } finally {
      setUpdatingArrival(false);
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
    setProcessingArrival(arrival.id);
    try {
      const res = await api.patch(`/arrival/${arrival.id}`, {
        ...arrival,
        status: "IN_PROGRESS",
      });
      if (res.data.success) {
        toast.success("Arrival processing started");
        fetchArrivals({ status: "UPCOMING" });
        fetchArrivals({ status: "IN_PROGRESS" });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setProcessingArrival("");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchArrivals({ status: "UPCOMING" }),
          fetchArrivals({ status: "IN_PROGRESS" }),
          fetchArrivals({ status: "FINISHED" }),
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setIsManager(user.role === "MANAGER");
    }
  }, [user]);

  const handletabChange = (index: number) => {
    setActiveTabIndex(index);
    if (index === 0) {
      setArrivals(upcomingArrivals);
    } else if (index === 1) {
      setArrivals(inProgressArrivals);
    } else if (index === 2) {
      setArrivals(finishedArrivals);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64 w-full col-span-2">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  // Button with loading state
  const ActionButton = ({
    onClick,
    isLoading,
    className,
    children,
  }: {
    onClick: () => void;
    isLoading: boolean;
    className: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${className} relative disabled:opacity-70`}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
        </span>
      )}
      <span className={isLoading ? "opacity-0" : ""}>{children}</span>
    </button>
  );

  return (
    <Baselayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400 drop-shadow-lg">
            📦Arrivals
          </h1>

          <div className="flex justify-center mb-4">
            <button
              onClick={toggleSortOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
            >
              <span>Sort Order:</span>
              {sortOrder === "asc" ? (
                <>
                  <span>Ascending</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414 6.707 12.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>Descending</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          <TabGroup
            defaultIndex={0}
            className="w-full"
            onChange={handletabChange}
          >
            <TabList className="flex gap-4 justify-center pb-8 text-2xl">
              {["Upcoming", "In Progress", "Finished"].map((tab, index) => (
                <Tab
                  key={index}
                  className="data-[selected]:bg-blue-800 cursor-pointer rounded-md text-xl px-6 py-1 data-[selected]:text-slate-100 data-[hover]:text-bold text-slate-300 outline-0 ring-0"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 w-full">
              {loading ? (
                <LoadingSpinner />
              ) : arrivals.length > 0 ? (
                arrivals.map((arrival: any) => (
                  <div
                    key={arrival.id}
                    className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg transition-transform transform hover:scale-105 w-full"
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
                      {new Date(
                        arrival.expectedArrivalDate
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-lg text-gray-300">
                      📦 <span className="font-medium">Expected Boxes:</span>{" "}
                      {arrival.expected_boxes}
                    </p>
                    <p className="text-lg text-gray-300">
                      ⚖️{" "}
                      <span className="font-medium">Expected Kilograms:</span>{" "}
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
                          <ActionButton
                            onClick={() => {
                              setIsOpen(true);
                              setUpdateArrival(arrival);
                            }}
                            isLoading={false}
                            className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800"
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDelete(arrival.id)}
                            isLoading={deletingArrival === arrival.id}
                            className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-red-600 bg-red-400"
                          >
                            Delete
                          </ActionButton>
                        </>
                      ) : (
                        arrival.status !== "FINISHED" && (
                          <Link
                            href={`/start-processing/${arrival.id}`}
                            className={`cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[100px] hover:bg-blue-600 bg-slate-800 relative ${
                              processingArrival === arrival.id
                                ? "pointer-events-none opacity-70"
                                : ""
                            }`}
                            onClick={handleStartProcessing(arrival)}
                          >
                            {processingArrival === arrival.id ? (
                              <>
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
                                </span>
                                <span className="opacity-0">
                                  Start Processing
                                </span>
                              </>
                            ) : arrival.status === "IN_PROGRESS" ? (
                              "Continue Processing"
                            ) : (
                              "Start Processing"
                            )}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center w-full col-span-2 h-[350px] flex items-center justify-center text-xl text-gray-400">
                  <span className="text-2xl">🚫 No arrivals found</span>
                </p>
              )}
            </TabPanels>
          </TabGroup>
        </div>
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
                  disabled={updatingArrival}
                >
                  Cancel
                </button>
                <ActionButton
                  onClick={handleUpdate}
                  isLoading={updatingArrival}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-200"
                >
                  Save
                </ActionButton>
              </div>
            </>
          }
        />
      )}
    </Baselayout>
  );
}
