import React from "react";
import { Button } from "../theming-shadcn/Button";
import { Link } from "lucide-react";

export function AboutPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          About PropManager!
        </h1>

        <p className="text-gray-700 mb-4 leading-relaxed">
          Welcome to PropManager! We’re a team of 12 dedicated to helping rental
          property managers streamline their workflows and improve their
          efficiency. We also want to help tenants find their next dream home,
          by providing a simple solution to view, inquire, visit and apply for
          rental properties. Landlords are encouraged to join PropManager to
          understand how their properties are performing in the market, and to
          work with their agents with ease.
        </p>

      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">For Agents</h2>

        <p className="text-gray-700 mb-4 leading-relaxed">
          Prop Manager offers agents a comprehensive suite of tools to manage
          their properties, schedule viewings, communicate with tenants, and
          handle documents all in one place. Our platform is designed to
          simplify your workflow and help you stay organised. There is a
          dedicated dashboard for agents to view their tasks, messages, and
          upcoming appointments at a glance. Feel free to browse our site
          without signing in, but to access more features, please sign up or log
          in.
        </p>

      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">For Tenants</h2>

        <p className="text-gray-700 mb-4 leading-relaxed">
          PropManager is a user-friendly platform designed to simplify the
          rental process for tenants. Our intuitive interface allows you to
          easily search for properties, schedule viewings, communicate with
          landlords or agents, and manage your rental documents all in one
          place. Whether you're looking for a new home or managing your current
          rental, PropManager provides the tools you need to stay organized and
          informed. Feel free to explore our site without signing in, but to
          access more features, please sign up or log in.
        </p>

      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">For Landlords</h2>

        <p className="text-gray-700 mb-4 leading-relaxed">
          Make your life easier with PropManager! Our platform offers landlords
          a comprehensive suite of tools to manage their properties, track
          performance, and collaborate with agents seamlessly. With PropManager,
          you can easily monitor your property's status, view tenant
          applications, and handle important documents all in one place. Our
          user-friendly interface is designed to simplify your workflow and help
          you stay organized. Feel free to browse our site without signing in,
          but to access more features, please sign up or log in.
        </p>

      </div>
    </div>
  );
}
