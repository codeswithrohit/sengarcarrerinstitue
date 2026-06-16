import AdminNav from '@/components/AdminNav'
import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const db = firebase.firestore();
        const querySnapshot = await db.collection('sengarcarrerenquiries')
          .orderBy('createdAt', 'desc') // Sort by createdAt in descending order
          .get();
        const enquiriesData = [];
        querySnapshot.forEach((doc) => {
          enquiriesData.push({ id: doc.id, ...doc.data() });
        });
        setEnquiries(enquiriesData);
      } catch (error) {
        console.error("Error fetching enquiries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav/>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Enquiries</h1>
              <p className="text-sm text-gray-600">Total: {enquiries.length} enquiries</p>
            </div>
            
            {enquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enquiries.map((enquiry,index) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {index+1}. {formatDate(enquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{enquiry.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{enquiry.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {enquiry.mobileNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${enquiry.Batch === 'Offline' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {enquiry.Batch || 'N/A'}
                          </span>
                        </td>
                    
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {enquiry.targetClass || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {enquiry.address || 'N/A'}
                        </td>
                     
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No enquiries found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Enquiry;