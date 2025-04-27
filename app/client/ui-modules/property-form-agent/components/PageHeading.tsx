import React from "react";

export function PageHeading({title, subtitle, className=""}: {title: string, subtitle: string, className?: string}): React.JSX.Element{
  return (
    <div>
    <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <h3 className="text-sm text-[#71717A]">{subtitle}</h3>
      </div>
  )
}