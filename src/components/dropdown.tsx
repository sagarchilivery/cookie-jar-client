import { Select } from "@headlessui/react";
import React from "react";

export default function Dropdown({ elements, selected, setSelect }: any) {
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return (
    <Select
      name="dropdown"
      value={selected}
      onChange={(e: any) => setSelect(e.target.value)}
      aria-label="Project status"
      className="border w-full h-8 max-w-[250px] text-[15px] px-2 rounded-md"
    >
      {/* Default option */}
      <option value="" disabled hidden>
        Select one
      </option>
      {elements.map((element: any) => (
        <option
          key={element}
          value={element}
          onClick={() => setSelect(element)}
          className="text-gray-900 text-[13px]"
        >
          {capitalizeFirstLetter(element)}
        </option>
      ))}
    </Select>
  );
}
