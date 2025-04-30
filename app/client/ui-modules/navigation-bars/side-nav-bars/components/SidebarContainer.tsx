import React from "react";
import { Button } from "../../../theming-shadcn/Button";
import { EscapeIcon } from "../../../theming/icons/EscapeIcon";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={`mt-auto border-t border-gray-200 ${className}`}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"
interface SidebarContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const SidebarContainer = ({
  isOpen,
  children,
}: SidebarContainerProps) => (
  <div
    className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex flex-col h-full">
      {children}
    </div>
  </div>
);

interface SidebarContentProps {
  nav: React.ReactNode;
  bottom?: React.ReactNode;
}

export const SidebarContent = ({ nav, bottom }: SidebarContentProps) => (
  <div className="flex-1 flex flex-col overflow-hidden">
    <div className="flex-1 overflow-y-auto">
      <nav className="flex flex-col gap-3 p-4">
        {nav}
      </nav>
    </div>
    {bottom && (
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200">
        {bottom}
      </div>
    )}  </div>
);

interface SidebarHeaderProps {
  title?: string;
  onClose: () => void;
}

export const SidebarHeader = ({
  title = "Navigation",
  onClose,
}: SidebarHeaderProps) => (
  <div className="flex justify-between items-center p-4 border-b">
    <span className="text-lg font-semibold">{title}</span>
    <Button variant="outline" size="icon" onClick={onClose}>
      <EscapeIcon variant="light" />
    </Button>
  </div>
);
