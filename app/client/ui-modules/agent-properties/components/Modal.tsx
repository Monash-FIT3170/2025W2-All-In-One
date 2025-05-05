import React, { ReactNode } from "react";

interface ModalType {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-[70%] flex-col overflow-hidden rounded-xl bg-white p-4">
            <div className="flex-1 overflow-y-auto pr-4">
              {props.children}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-300 bg-white pt-4 pb-4">
              {props.footer}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}