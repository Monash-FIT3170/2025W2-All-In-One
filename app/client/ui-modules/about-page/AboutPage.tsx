import React from "react";
import { Button } from "../theming-shadcn/Button";

export function AboutPage(): React.JSX.Element {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    About Our Platform
                </h1>

                <p className="text-gray-700 mb-4 leading-relaxed">
                    Welcome to our platform! We’re passionate about creating
                    tools that empower people to work, connect, and grow. Our
                    mission is to provide reliable, modern solutions that make
                    complex workflows simple and efficient.
                </p>

                <p className="text-gray-700 mb-4 leading-relaxed">
                    Built with Meteor and React, our application integrates
                    powerful real-time features with an intuitive interface. We
                    value collaboration, security, and performance in every
                    aspect of our system.
                </p>

                <p className="text-gray-700 mb-8 leading-relaxed">
                    Whether you’re managing your profile, connecting with others,
                    or exploring our latest features, we’re committed to
                    delivering a smooth and enjoyable experience.
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
