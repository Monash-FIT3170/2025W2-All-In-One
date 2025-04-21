import React from "react";

export function AddTaskButton({ onClick }: { onClick: () => void }): React.JSX.Element {
  return <button onClick={onClick} className="px-3 py-1 bg-blue-200 text-white rounded-md">Add new task</button>
}
