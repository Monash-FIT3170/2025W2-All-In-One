import React from "react";
import { Link, LinkProps } from "react-router";

type NavBarLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

//This is a single link component that accepts props for rendering a nav link 
//It is responsible for rendering one individual link
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
//This component handles multiple NavBarLink components
//It accepts an array of link components and renders them using the
//nav bar link component
//
export interface NavLinkItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavBarLinksProps {
  links: NavLinkItem[];
}

export function NavBarLinks({ links }: NavBarLinksProps) {
  return (
    <>
      {links.map((link, index) => (
        <NavBarLink to={link.to} key={index}>
          <span className="flex items-center gap-2">
            {link.icon}
            {link.label}
          </span>
        </NavBarLink>
      ))}
    </>
  );
}
