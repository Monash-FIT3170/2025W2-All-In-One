import React from "react";
import { Button } from "../theming-shadcn/Button";

export function AboutPage(): React.JSX.Element {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    About PropManager!
                </h1>

                <p className="text-gray-700 mb-4 leading-relaxed">
                    Welcome to PropManager! 
                    We’re a team of 12 dedicated to helping rental property managers streamline their workflows and improve their efficiency.
                    We also want to help tenants find their next dream home, by providing a simple solution to view, inquire, visit and apply for rental properties.
                    Landlords are encouraged to join PropManager to understand how their properties are performing in the market, and to work with their agents with ease.
                </p>

                <div className="flex justify-center">
                    <Button
                        onClick={() => alert("Thanks for visiting our About page!")}
                        className="px-6 py-2 hover:bg-gray-300 transition"
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
}
