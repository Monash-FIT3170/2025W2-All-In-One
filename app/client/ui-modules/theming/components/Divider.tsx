import React from "react"
import { twMerge } from "tailwind-merge"

export function Divider({
  className=""
} : {
  className?: string
}): React.JSX.Element {
  return <hr className={twMerge("border-(--divider-color) my-2", className)}/>
}