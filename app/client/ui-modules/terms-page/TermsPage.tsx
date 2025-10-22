import React from "react";
import { Button } from "../theming-shadcn/Button";

export function TermsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Welcome to PropManager. By accessing our website, you agree to these terms of service. 
          Please read them carefully before using our platform.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Visitor Agreement</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          By using PropManager, you agree to these terms and conditions. You must be at least 18 years old
          to use our services. You are responsible for maintaining the confidentiality of your account
          information and for all activities that occur under your account.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Liability Limitations</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          PropManager and its affiliates will not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of our services. We do not guarantee
          the accuracy, completeness, or usefulness of any information on the platform.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Content</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Our platform may contain links to third-party websites or services that are not owned or
          controlled by PropManager. We have no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party websites or services.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          You agree not to misuse our services or help anyone else do so. This includes attempting to
          access our systems unauthorized, circumventing security measures, or using our services for
          any illegal or unauthorized purpose.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies Policy</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We use cookies and similar tracking technologies to track activity on our platform and hold
          certain information. You can instruct your browser to refuse all cookies or to indicate when
          a cookie is being sent.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          All subscription fees and payments made through PropManager are non-refundable unless
          required by law. In case of technical issues or service interruptions, we may provide
          compensation in the form of service credits.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We reserve the right to modify these terms at any time. We will notify users of any material
          changes via email or through our platform. Your continued use of PropManager after such
          modifications constitutes your acceptance of the updated terms.
        </p>
      </div>
    </div>
  );
}