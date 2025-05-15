// app/Terms/page.jsx
import React from "react";
export const metadata = {
    title: "Terms and Conditions | BookHub",
    description: "Read our terms and conditions to understand your rights and obligations while using BookHub.",
  };
  
  export default function TermsPage() {
    return (
      <div className="min-h-screen bg-white text-gray-800 px-6 py-12 md:px-20 lg:px-40">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 border-b pb-4">Terms & Conditions</h1>
  
          <p className="mb-4 text-lg">
            Welcome to <span className="font-semibold text-primary">BookHub</span>. These terms and conditions outline the rules and regulations for the use of our website and services.
          </p>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use BookHub if you do not accept all of the terms stated on this page.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the site. Continued use of the site signifies acceptance of the updated terms.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You agree to use our services for lawful purposes only.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Any misuse or unauthorized access may result in termination of your account.</li>
            </ul>
          </section>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2>
            <p>
              All content on BookHub, including text, graphics, logos, and software, is the property of BookHub and is protected by copyright and intellectual property laws.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
            <p>
              BookHub shall not be held liable for any indirect or consequential damages arising out of or in connection with the use of our services.
            </p>
          </section>
  
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">6. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
  
          <p className="text-sm text-gray-500 mt-12">
            Last updated: May 15, 2025
          </p>
        </div>
      </div>
    );
  }
  