import React from 'react';
import Head from 'next/head';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Terms of Use | Sengar Career Institute</title>
        <meta name="description" content="Terms of Use for Sengar Career Institute - IIT JEE, NEET, Class 10 preparation" />
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-xl opacity-90">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Welcome to Sengar Career Institute</h2>
            <p className="text-gray-600 mb-6">
              These Terms of Use govern your use of Sengar Career Institute services, including our courses for IIT JEE, NEET, Class 10, and other competitive exams. By accessing or using our services, you agree to be bound by these terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. Services Offered</h2>
            <p className="text-gray-600 mb-4">
              Sengar Career Institute provides educational services including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Online and offline coaching for IIT JEE (Main & Advanced)</li>
              <li>NEET (UG) preparation courses</li>
              <li>Class 10 board exam preparation</li>
              <li>Study materials, mock tests, and practice papers</li>
              <li>Doubt solving sessions and mentorship programs</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">
              As a user of Sengar Career Institute services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not share course materials with non-registered users</li>
              <li>Use the services solely for personal, non-commercial purposes</li>
              <li>Not engage in any activity that disrupts the learning experience of others</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">3. Payment and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Our payment and refund policies include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Fees must be paid in full before accessing paid courses</li>
              <li>Refund requests within 7 days of purchase may be considered under specific circumstances</li>
              <li>No refunds will be provided after accessing more than 20% of course content</li>
              <li>All fees are non-transferable between courses or students</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              All course materials, including videos, documents, tests, and other content provided by Sengar Career Institute are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">5. Privacy Policy</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our collection and use of your data as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">6. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              Sengar Career Institute shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. While we strive for excellence, we do not guarantee specific exam results or rankings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">7. Modifications to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify these Terms of Use at any time. Continued use of our services after such changes constitutes your acceptance of the new terms. We will notify users of significant changes through email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">8. Contact Information</h2>
            <p className="text-gray-600">
              For any questions about these Terms of Use, please contact us at:
            </p>
            <p className="text-blue-600 font-medium mt-2">
              Phone: 9205204647<br />
              Address: SAI COMPLEX, BENIPUR POKHRA, BENIPUR ROAD, PAHARIYA-221007
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Sengar Career Institute. All rights reserved.</p>
          <p className="mt-2 text-gray-400 text-sm">Empowering students for IIT JEE, NEET, and academic excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse;