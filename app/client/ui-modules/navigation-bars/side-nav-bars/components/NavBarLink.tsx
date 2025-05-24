import React from "react";
import { Link, LinkProps } from "react-router";

type NavBarLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function NavBarLink({
  children,
  className = "",
  ...props
}: NavBarLinkProps): React.JSX.Element {
  return (
    <Link {...props} className={`hover:underline geist-body ${className}`}>
      {children}
    </Link>
  );
}

export interface NavLinkItem {
  to: string;
  label: string;
  icon?: React.ReactNode; 
}

interface NavBarLinksProps {
  links: NavLinkItem[];
  onClose?: () => void;
}

export function NavBarLinks({ links, onClose }: NavBarLinksProps) {
  return (
    <>
      {links.map(({ to, label, icon }) => (
        <Link
          to={to}
          className="flex items-center gap-2 p-2"
          key={to}
          onClick={(e) => {
            if (onClose) {
              onClose();
            }
          }}
        >
          {icon && icon}
          <span>{label}</span>
        </Link>
      ))}
    </>
  );
}
