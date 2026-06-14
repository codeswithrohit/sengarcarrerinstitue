import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Privacy Policy | Sengar Career Institute</title>
        <meta name="description" content="Sengar Career Institute Privacy Policy for IIT JEE, NEET, Class 10 programs" />
      </Head>
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Sengar Career Institute</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
          <p className="text-gray-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-indigo max-w-none">
          <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-indigo-700">
              At Sengar Career Institute, we are committed to protecting the privacy of our students and visitors. 
              This policy outlines how we collect, use, and safeguard your information when you use our 
              services for IIT JEE, NEET, Class 10, and other competitive exam preparation.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">1. Information We Collect</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email, phone number, parent/guardian details when you register for our programs.</li>
                <li><strong>Academic Information:</strong> Class, school, academic history, test scores, and performance data.</li>
                <li><strong>Payment Information:</strong> For fee payments (processed through secure third-party providers).</li>
                <li><strong>Usage Data:</strong> How you interact with our platform, including login times, accessed resources, and device information.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">2. How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and personalize our coaching services</li>
                <li>To track academic progress and provide feedback</li>
                <li>To communicate about classes, schedules, and important updates</li>
                <li>To improve our teaching methodologies and platform</li>
                <li>For internal analytics and research (always anonymized where possible)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">3. Data Protection</h3>
              <p>
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Secure servers with encryption</li>
                <li>Limited access to personal data</li>
                <li>Regular security audits</li>
                <li>Secure payment gateways</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">4. Third-Party Services</h3>
              <p>
                We may use trusted third parties for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Payment processing (Razorpay, PayPal, etc.)</li>
                <li>Learning management systems</li>
                <li>Analytics tools (Google Analytics)</li>
                <li>Communication platforms (WhatsApp, Email services)</li>
              </ul>
              <p className="mt-4">
                These parties have their own privacy policies, and we recommend you review them.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">5. Student Rights</h3>
              <p>
                Students and parents/guardians can:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Request access to their personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Withdraw consent for data processing (may affect service delivery)</li>
                <li>Request deletion of data (subject to legal requirements)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">6. Cookies & Tracking</h3>
              <p>
                Our website uses cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Improve user experience</li>
                <li>Remember login sessions</li>
                <li>Analyze platform usage</li>
              </ul>
              <p className="mt-4">
                You can disable cookies in your browser settings, but this may affect functionality.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">7. Policy Updates</h3>
              <p>
                We may update this policy periodically. Significant changes will be communicated to registered users via email or platform notifications.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">8. Contact Us</h3>
              <p>
                For privacy-related inquiries or requests, please contact:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Sengar Career Institute Privacy Officer</strong></p>
                <p>Phone: 9205204647</p>
                <p>Address: PANCHKOSHI RD, JAI NAGAR COLONY, GILAT BAZAR, VARANASI, UTTAR PRADESH 221002</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;