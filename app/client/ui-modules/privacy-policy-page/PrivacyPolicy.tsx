import React from "react";

export function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>PropManager</strong>, we are committed to protecting the
        privacy and security of your personal information. This Privacy Policy
        explains how we collect, use, disclose, and manage your information in
        accordance with the Privacy Act 1988 (Cth) and the Spam Act 2003 (Cth).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Collection and Use of Personal Information</h2>
      <p className="mb-2">
        We collect personal information necessary to provide our services, including:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>User details (name, email, phone number, DOB, profile picture, occupation, emergency contact, employer, work address, work phone)</li>
        <li>Account credentials (email, password, account creation time, role)</li>
        <li>Messages (content, metadata, sender/receiver info)</li>
        <li>Property and listing information (address, features, images, inspection times, history)</li>
        <li>Tasks (creator, description, dates, priority, status, associated property)</li>
        <li>Rental agreements (digital signatures, full names, addresses)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Australian Privacy Principles (APPs)</h2>
      <p className="mb-2">
        PropManager adheres to all 13 APPs, including:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>APP 1:</strong> Open and transparent management.</li>
        <li><strong>APP 2:</strong> Anonymity and pseudonymity where possible.</li>
        <li><strong>APP 3:</strong> Collection of only necessary personal information.</li>
        <li><strong>APP 4:</strong> Immediate destruction of unsolicited personal info.</li>
        <li><strong>APP 5:</strong> Clear collection notices at signup.</li>
        <li><strong>APP 6:</strong> Role-based access control for disclosure.</li>
        <li><strong>APP 7:</strong> Opt-out mechanism in marketing communications.</li>
        <li><strong>APP 8:</strong> Protection of cross-border information.</li>
        <li><strong>APP 9:</strong> No unauthorized disclosure of government identifiers.</li>
        <li><strong>APP 10:</strong> Data accuracy via agent verification.</li>
        <li><strong>APP 11:</strong> Robust security measures and breach response.</li>
        <li><strong>APP 12:</strong> Users can view information held about them.</li>
        <li><strong>APP 13:</strong> Users can correct personal information.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">User Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>View all information stored about them</li>
        <li>Request correction or deletion of personal information</li>
        <li>Opt out of marketing communications at any time</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
      <p className="mb-2">
        For questions about this Privacy Policy or how we handle your personal information, please contact:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Email: [insert email]</li>
        <li>Phone: [insert phone]</li>
        <li>Address: [insert address]</li>
      </ul>
    </div>
  );
}
