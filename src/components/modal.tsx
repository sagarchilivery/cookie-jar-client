import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { ReactNode } from "react";

export default function Modal({
  children,
  title,
  isOpen,
  setIsOpen,
  parentStyles,
}: {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: any;
  parentStyles?: string;
}) {
  return (
    <div className=" border">
      {" "}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <DialogPanel
            className={`${
              parentStyles ? parentStyles : "max-w-lg"
            } w-full bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-lg`}
          >
            <DialogTitle className="text-2xl font-bold text-white">
              {title}
            </DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
