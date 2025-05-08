import React from "react";

export function EditableField({label, text}: {label: string, text: string}):  React.JSX.Element {



    return (

        // this is the section that will display when on the default profile (not edit mode)
        <div className="grid w-full max-w-sm items-start gap-1.5">
            
        <div className="text-base geist-bold text-gray-700">{label}</div>
        <div className="border rounded px-3 py-2 bg-muted border-gray-300  text-muted-foreground geist-regular">
            {text}
            </div>

        </div>
       
    );
}