import React, { ReactNode } from "react";
import Navbar from "./navbar";

export default function Baselayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div>
      <div className="flex flex-col overflow-hidden">
        <div className="w-screen flex-col flex ">
          <div className=" w-full">
            <Navbar />
          </div>
          <div className="w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen pt-22">
            <div className=" max-w-[1440px] w-full mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
