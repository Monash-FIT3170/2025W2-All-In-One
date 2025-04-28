"use client";

import React from "react";

export function FormHeading({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <h1 className="text-xl font-semibold mb-1">{title}</h1>
      <h3 className="text-sm text-[#71717A]">{subtitle}</h3>
    </div>
  );
}
