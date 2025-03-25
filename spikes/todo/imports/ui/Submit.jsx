import React from "react"

export const Submit = () => {
    const [newTask, setNewTask] = React.useState('')

    return (
        <div className="submit">
            <button>Submit</button>
        </div>
    )

}