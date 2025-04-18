import React from "react";

export function AddTaskButton({ onClick }: { onClick: () => void }): React.JSX.Element {
  return <button onClick={onClick} className="button-example-style">Add new task</button>
}
