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
