import React from 'react';

const PaymentTerms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-6 text-white">
          <h1 className="text-3xl font-bold">Sengar Career Institute Payment Terms</h1>
          <p className="mt-2 opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">1. Fee Structure</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>IIT JEE Program: ₹15,000/month</li>
              <li>NEET Program: ₹12,000/month</li>
              <li>Class 10 Foundation: ₹8,000/month</li>
              <li>Crash Courses: Prices vary by duration (contact for details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">2. Payment Methods</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-blue-600">Online Payments</h3>
                <ul className="mt-2 space-y-1">
                  <li>• UPI (PhonePe/Google Pay/PayTM)</li>
                  <li>• Net Banking</li>
                  <li>• Credit/Debit Cards</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-blue-600">Offline Payments</h3>
                <ul className="mt-2 space-y-1">
                  <li>• Cash (at our center only)</li>
                  <li>• Cheque (payable to Sengar Career Institute)</li>
                  <li>• Bank Transfer (details available on request)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">3. Payment Schedule</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">✔</span>
                  <span>Fees are due on the 1st of each month</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">✔</span>
                  <span>A 5-day grace period is provided without penalty</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">✔</span>
                  <span>Late payments incur a ₹200/day penalty after grace period</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">4. Refund Policy</h2>
            <div className="border-l-4 border-orange-400 pl-4 py-1 bg-orange-50">
              <p className="italic">We offer refunds under the following conditions:</p>
              <ul className="list-decimal pl-5 mt-2 space-y-2">
                <li>100% refund if withdrawal before program starts</li>
                <li>50% refund if withdrawn within first 7 days of program</li>
                <li>No refunds after 7 days of program commencement</li>
                <li>Refunds processed within 15 working days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">5. Discounts & Scholarships</h2>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start mb-3">
                <span className="bg-green-100 text-green-800 rounded-full p-1 mr-3">★</span>
                <span>10% sibling discount for second child enrollment</span>
              </div>
              <div className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full p-1 mr-3">★</span>
                <span>Merit-based scholarships available (top 5% in entrance tests)</span>
              </div>
            </div>
          </section>

          <div className="border-t pt-4 text-sm text-gray-500">
            <p>By making payment to Sengar Career Institute, you agree to these terms and conditions. For any queries, please contact our support team at payments@tris-coaching.com or call +91 XXXXX XXXXX.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTerms;