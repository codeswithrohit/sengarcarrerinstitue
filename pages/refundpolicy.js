import React from 'react';
import Head from 'next/head';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Refund Policy | Sengar Career Institute</title>
        <meta name="description" content="Sengar Career Institute refund policy for IIT JEE, NEET, Class 10, and other courses" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Refund Policy
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Our commitment to transparency and customer satisfaction
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h2 className="text-lg leading-6 font-medium text-white">
              Sengar Career Institute Refund Guidelines
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {/* General Policy */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  General Policy
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p className="mb-3">
                    Sengar Career Institute is committed to providing high-quality educational services. Due to the digital nature of our resources and the immediate access provided upon enrollment, we generally do not offer refunds once a course has been accessed or materials have been downloaded.
                  </p>
                  <p>
                    However, we understand exceptional circumstances may arise, and each case will be reviewed individually.
                  </p>
                </dd>
              </div>
              
              {/* Refund Eligibility */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  Refund Eligibility
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Before course access:</span> Full refund available if requested within 7 days of payment and before any course materials have been accessed.
                    </li>
                    <li>
                      <span className="font-medium">Technical issues:</span> If you're unable to access the course due to technical problems we cannot resolve within 72 hours.
                    </li>
                    <li>
                      <span className="font-medium">Course cancellation:</span> Full refund if TRI-S cancels a course before completion.
                    </li>
                    <li>
                      <span className="font-medium">Duplicate payment:</span> Refund for accidental duplicate payments upon verification.
                    </li>
                  </ul>
                </dd>
              </div>
              
              {/* Non-Refundable Situations */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  Non-Refundable
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>After accessing any course materials or attending live sessions</li>
                    <li>Change of mind after 7 days from enrollment</li>
                    <li>Failure to meet course requirements or expectations</li>
                    <li>Partial completion of the course</li>
                    <li>Downloaded study materials or resources</li>
                  </ul>
                </dd>
              </div>
              
              {/* Refund Process */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  Refund Process
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>Submit a refund request via email to support@tris-coaching.com with your enrollment details</li>
                    <li>Our team will review your request within 3-5 business days</li>
                    <li>If approved, refunds will be processed to the original payment method within 10 business days</li>
                    <li>You will receive email confirmation once the refund is processed</li>
                  </ol>
                  <p className="mt-3 text-gray-600">
                    Note: Bank processing times may vary depending on your financial institution.
                  </p>
                </dd>
              </div>
              
              {/* Partial Refunds */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  Partial Refunds
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>
                    In exceptional circumstances, Sengar Career Institute may grant partial refunds at our discretion. These are typically calculated based on:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Percentage of course content accessed</li>
                    <li>Time elapsed since enrollment</li>
                    <li>Resources already utilized</li>
                  </ul>
                </dd>
              </div>
              
              {/* Contact */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition">
                <dt className="text-sm font-medium text-gray-500">
                  Questions
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>
                    For any questions about our refund policy, please contact us at:
                  </p>
                  <p className="mt-2 font-medium">
                    Email: support@tris-coaching.com<br />
                    Phone: 9205204647<br />
                    Hours: Monday-Friday, 9:00 AM - 6:00 PM IST
                  </p>
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="px-4 py-4 bg-gray-50 text-center sm:px-6">
            <p className="text-xs text-gray-500">
              Sengar Career Institute reserves the right to modify this refund policy at any time. Any changes will be posted on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;