"use client";

import Baselayout from "@/components/baselayout/page";
import Dropdown from "@/components/dropdown";
import Modal from "@/components/modal";
import api from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const categories = [
  "ELECTRONICS",
  "FASHION",
  "GROCERY",
  "FURNITURE",
  "SPORTS",
  "AUTOMOTIVE",
  "HOME_APPLIANCES",
  "TOYS",
  "BOOKS",
  "HEALTH",
  "JEWELRY",
];

const style = [
  "CASUAL",
  "FORMAL",
  "SPORTY",
  "TRADITIONAL",
  "STREETWEAR",
  "VINTAGE",
  "MINIMALIST",
  "LUXURY",
  "INDUSTRIAL",
  "MODERN",
  "TECH",
  "FUNCTIONAL",
];

export default function StartProcessing() {
  const params = useParams() as Record<string, string>;
  const arrivalId = params?.arrivalId ?? "";
  const router = useRouter();

  const [arrival, setArrival] = useState<any>(null);
  const [actualArrivalData, setActualArrivalData] = useState<any>({
    actual_kilograms: null,
    actual_boxes: null,
    actual_pallets: null,
    actualArrivalDate: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [product, setProduct] = useState({
    productName: "",
    size: "",
    color: "",
    quantity: 1,
  });
  const [selectedCondition, setSelectedCondition] = useState("");

  // brand states
  const [brands, setBrands] = useState<{ name: string }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [newbrand, setNewbrand] = useState("");

  // modal states
  const [isOpen, setIsOpen] = useState(false);

  // Has draft state
  const [hasDraft, setHasDraft] = useState(false);

  // Save product form data to local storage
  const saveToLocalStorage = () => {
    const productData = {
      product,
      selectedBrand,
      selectedCategory,
      selectedCondition,
      selectedStyle,
    };

    localStorage.setItem(
      `product_draft_${arrivalId}`,
      JSON.stringify(productData)
    );
    setHasDraft(true);
    toast.success("Product draft saved");
  };

  // Load product form data from local storage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(`product_draft_${arrivalId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setProduct(parsedData.product);
        setSelectedBrand(parsedData.selectedBrand);
        setSelectedCategory(parsedData.selectedCategory);
        setSelectedCondition(parsedData.selectedCondition);
        setSelectedStyle(parsedData.selectedStyle);
        setHasDraft(true);

        // Show a toast notification
        // toast.success("Loaded saved product draft");
      }
    } catch (error) {
      console.error("Error loading saved product data:", error);
    }
  };

  // Clear local storage
  const clearLocalStorage = () => {
    localStorage.removeItem(`product_draft_${arrivalId}`);
    setHasDraft(false);
    setProduct({
      productName: "",
      size: "",
      color: "",
      quantity: 1,
    });
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedCondition("");
    setSelectedStyle("");
  };

  const fetchArrival = async () => {
    if (!arrivalId) return;
    try {
      const response = await api.get(`/arrival/${arrivalId}`);
      setArrival(response.data.data);

      const arr = response.data.data;
      if (
        arr.actual_pallets !== null ||
        arr.actual_boxes !== null ||
        arr.actual_kilograms !== null ||
        arr.actualArrivalDate !== null
      ) {
        setActualArrivalData({
          actual_kilograms: arr.actual_kilograms,
          actual_quantity: arr.actual_quantity,
          actual_boxes: arr.actual_boxes,
          actual_pallets: arr.actual_pallets,
          actualArrivalDate: arr.actualArrivalDate,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch arrival");
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brand");
      setBrands(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch brands");
    }
  };

  function formatDate(isoString: string) {
    if (!isoString) return ""; // Handle empty date case
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`; // Change format for input[type="date"]
  }

  const handleActualDataSave = async () => {
    try {
      const payload = {
        ...arrival,
        ...actualArrivalData,
      };

      if (
        payload.actualArrivalDate === "" ||
        payload.actual_kilograms === null ||
        payload.actual_boxes === null ||
        payload.actual_pallets === null
      ) {
        toast.error("Please fill all fields");
        return;
      }

      const response = await api.patch(`/arrival/${arrivalId}`, {
        ...payload,
      });
      if (response.data.success) {
        toast.success("Actual data saved successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save actual data");
    }
  };

  const handleNewBrand = async () => {
    try {
      const response = await api.post("/brand", { name: newbrand });
      if (response.data.success) {
        toast.success("Brand added successfully");
        setNewbrand("");
        setIsOpen(false);
        setBrands((prev) => [...prev, response.data.data.name]);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add brand");
      }
    }
  };

  const addProductHandler = async () => {
    if (product.quantity < 1) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      const response = await api.post(`/product`, {
        brandName: selectedBrand,
        productName: product.productName,
        condition: selectedCondition,
        quantity: product.quantity,
        arrivalId: arrivalId,
        category: selectedCategory,
        style: selectedStyle,
        size: product.size,
        color: product.color,
        added: true,
      });
      if (response.data.success) {
        toast.success("Product added successfully");
        clearLocalStorage(); // Clear saved data after successful add
        setProduct({
          productName: "",
          size: "",
          color: "",
          quantity: 1,
        });
        setSelectedBrand("");
        setSelectedCategory("");
        setSelectedCondition("");
        setSelectedStyle("");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add product");
      }
    }
  };

  // Save product form to local storage without API call
  const saveDraftHandler = () => {
    saveToLocalStorage();
  };

  const finishProductHandler = async () => {
    try {
      if (
        actualArrivalData.actual_kilograms === null ||
        actualArrivalData.actual_pallets === null ||
        actualArrivalData.actual_boxes === null ||
        actualArrivalData.actualArrivalDate === ""
      ) {
        toast.error("Please fill all fields");
        return;
      }

      const res = await api.patch(`/arrival/${arrivalId}`, {
        ...arrival,
        ...actualArrivalData,
        status: "FINISHED",
        finishDate: new Date().toISOString(),
      });

      if (res.data.success) {
        toast.success("Arrival finished successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete arrival");
    }
  };

  useEffect(() => {
    if (arrivalId) {
      setHasDraft(!!localStorage.getItem(`product_draft_${arrivalId}`));
      fetchArrival();
      fetchBrands();
      // Load saved data after component mounts and arrivalId is available
      loadFromLocalStorage();
    }
  }, [arrivalId]);

  return (
    <div>
      <Baselayout>
        {arrival ? (
          <div className="flex flex-col gap-8">
            <div className="border w-full rounded-md py-4 px-6">
              <h3 className="w-full text-center mb-8 text-xl font-bold">
                Add products
              </h3>

              <div className="grid grid-cols-3 gap-10 items-start">
                {/* Product Name */}
                <div className="flex gap-5 items-center">
                  <label>Product Name </label>
                  <input
                    type="text"
                    name="product"
                    onChange={(e) => {
                      setProduct({ ...product, productName: e.target.value });
                    }}
                    value={product.productName}
                    className="border pl-1.5 rounded-md h-8"
                    id="product"
                  />
                </div>

                {/* Brand Name */}
                <div className="flex flex-col gap-3.5">
                  <div className="flex gap-5 items-center">
                    <span>Select Brand</span>
                    {brands.length > 0 ? (
                      <Dropdown
                        elements={brands}
                        selected={selectedBrand}
                        setSelect={setSelectedBrand}
                      />
                    ) : (
                      "No brands found"
                    )}
                  </div>

                  <button
                    onClick={() => setIsOpen(true)}
                    className="border cursor-pointer hover:bg-blue-800 bg-slate-800 px-6 py-1 rounded-md w-fit mx-auto"
                  >
                    Add a new brand
                  </button>
                </div>

                {/* Condition */}
                <div className="flex gap-5">
                  <span>Select Condition</span>
                  <Dropdown
                    elements={["NEW", "USED", "DAMAGED"]}
                    selected={selectedCondition}
                    setSelect={setSelectedCondition}
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-5">
                  <label>Quantity </label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    value={product.quantity}
                    className="border pl-1.5 rounded-md h-8"
                    name="quantity"
                    id="quantity"
                    min={0}
                  />
                </div>

                {/* Category */}
                <div className="flex gap-5">
                  <span>Select Category</span>
                  <Dropdown
                    elements={categories}
                    selected={selectedCategory}
                    setSelect={setSelectedCategory}
                  />
                </div>

                {/* Style */}
                <div className="flex gap-5">
                  <span>Select Style</span>
                  <Dropdown
                    elements={style}
                    selected={selectedStyle}
                    setSelect={setSelectedStyle}
                  />
                </div>

                {/* Size */}
                <div className="flex gap-5">
                  <label>Size (Optional) </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setProduct({ ...product, size: e.target.value })
                    }
                    value={product.size}
                    name="size"
                    className="border pl-1.5 rounded-md h-8"
                    id="size"
                  />
                </div>

                {/* Colour */}
                <div className="flex gap-5">
                  <label>Colour (Optional) </label>
                  <input
                    type="text"
                    name="colour"
                    onChange={(e) =>
                      setProduct({ ...product, color: e.target.value })
                    }
                    value={product.color}
                    className="border pl-1.5 rounded-md h-8"
                    id="colour"
                  />
                </div>
              </div>

              <div className="mt-10 w-full flex gap-8 items-center justify-center">
                <button
                  onClick={saveDraftHandler}
                  className="cursor-pointer btn btn-gray py-2 border rounded-md px-4 min-w-[200px] hover:bg-gray-600 bg-gray-500"
                >
                  Save product
                </button>
                <button
                  onClick={addProductHandler}
                  className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[200px] hover:bg-blue-600 bg-slate-800"
                >
                  Add product
                </button>

                {hasDraft && (
                  <button
                    onClick={clearLocalStorage}
                    className="cursor-pointer btn btn-red py-2 border rounded-md px-4 min-w-[200px] hover:bg-red-600 bg-red-800"
                  >
                    Clear saved product
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-10 w-full">
              <div className="flex flex-col border rounded-2xl gap-4 min-w-[30%] pr-20 px-6 py-4">
                <div>Arrival No. {arrival.arrivalNumber}</div>
                <div>Title: {arrival.title}</div>
                <div>Supplier: {arrival.supplier}</div>
                <div>
                  Expected Date: {formatDate(arrival.expectedArrivalDate)}
                </div>
                <div>Status: {arrival.status}</div>
                <div>Expected Kilograms: {arrival.expected_kilograms}</div>
                <div>Expected Pallets: {arrival.expected_pallets}</div>
                <div>Expected Boxes: {arrival.expected_boxes}</div>
              </div>

              <div className="flex flex-col gap-4 w-full border rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold">Actual Arrival Data</h2>

                <div className="grid grid-cols-2 gap-10">
                  {[
                    {
                      label: "Actual Kilograms",
                      key: "actual_kilograms",
                      type: "number",
                    },
                    {
                      label: "Actual Pallets",
                      key: "actual_pallets",
                      type: "number",
                    },
                    {
                      label: "Actual Boxes",
                      key: "actual_boxes",
                      type: "number",
                    },
                    {
                      label: "Actual Arrival Date",
                      key: "actualArrivalDate",
                      type: "date",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <label className="font-medium" htmlFor={item.key}>
                        {item.label}
                      </label>
                      <input
                        onChange={(e) => {
                          if (item.type !== "date") {
                            setActualArrivalData((prev: any) => ({
                              ...prev,
                              [item.key]:
                                item.type === "number"
                                  ? parseInt(e.target.value)
                                  : e.target.value,
                            }));
                          } else {
                            const { name, value } = e.target;
                            const date = new Date(value);
                            date.setUTCHours(10, 0, 0, 0);
                            setActualArrivalData((prev: any) => ({
                              ...prev,
                              actualArrivalDate: date.toISOString(),
                            }));
                          }
                        }}
                        value={
                          item.type === "date"
                            ? formatDate(actualArrivalData[item.key])
                            : actualArrivalData[item.key] ?? ""
                        }
                        type={item.type}
                        min={item.type === "number" ? 0 : undefined}
                        name={item.key}
                        id={item.key}
                        className="border p-2 rounded-md w-[250px]"
                      />
                    </div>
                  ))}
                </div>

                <div className="w-full flex justify-center items-center mt-10 gap-8">
                  <button
                    onClick={handleActualDataSave}
                    className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[200px] hover:bg-blue-600 bg-slate-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={finishProductHandler}
                    className="cursor-pointer btn btn-blue py-2 border rounded-md px-4 min-w-[200px] hover:bg-blue-600 bg-slate-800"
                  >
                    Finish arrival
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          "No arrival found"
        )}
      </Baselayout>

      {isOpen && (
        <Modal
          title="Add a new brand"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          children={
            <div className="flex flex-col gap-5 mt-5">
              <input
                type="text"
                name="brand"
                placeholder="Enter brand name"
                onChange={(e: any) => {
                  setNewbrand(e.target.value);
                }}
                className="border pl-1.5 rounded-md h-8"
              />

              <button
                onClick={handleNewBrand}
                className="border px-10 py-1 cursor-pointer  w-fit mx-auto rounded-md hover:bg-blue-600 bg-slate-800"
              >
                Add
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
