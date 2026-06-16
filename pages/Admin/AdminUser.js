import React, { useState, useEffect } from 'react';
import { firebase } from "../../Firebase/config";
import AdminNav from '@/components/AdminNav';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiShield, FiCheckCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUser = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isVerified: false,
    access: 'Admin',
    viewDashboard: false,
    viewFees: false,
    viewTestSeries: false,
    viewYouTube: false,
    viewStudent: false,
    viewAdminUser: false,
    viewDashboardFeesStats: false,
    viewUpcomingFees: false,
    feesPaidAccess: false,
    feesEditAccess: false,
    feesMarkUnpaidAccess: false
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db.collection('sengarcarreradminUsers').get();
        const adminData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAdmins(adminData);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        toast.error('Failed to load admin users. Check Firestore permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'isVerified') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', isVerified: false, access: 'Admin',
      viewDashboard: false, viewFees: false, viewTestSeries: false,
      viewYouTube: false, viewStudent: false, viewAdminUser: false,
      viewDashboardFeesStats: false, viewUpcomingFees: false,
      feesPaidAccess: false, feesEditAccess: false, feesMarkUnpaidAccess: false
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (admin) => {
    setFormData({
      ...admin,
      password: '' // Keep password empty on edit for security
    });
    setEditingId(admin.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        await firebase.firestore().collection('sengarcarreradminUsers').doc(id).delete();
        toast.success('Admin user deleted successfully from database!');
        setAdmins(prev => prev.filter(admin => admin.id !== id));
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error('Error deleting admin user. Check permissions.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!editingId && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const db = firebase.firestore();
      
      // 1. Prepare data (Exclude password from Firestore payload)
      const submitData = { ...formData };
      delete submitData.password; 
      
      submitData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

      if (editingId) {
        // --- UPDATE EXISTING ADMIN ---
        await db.collection('sengarcarreradminUsers').doc(editingId).update(submitData);
        toast.success('Admin permissions updated successfully!');
      } else {
        // --- CREATE NEW ADMIN ---
        
        // 2. Safely get the primary app config to initialize the secondary app
        const primaryApp = firebase.app();
        const secondaryApp = firebase.apps.find(app => app.name === 'SecondaryApp') 
          || firebase.initializeApp(primaryApp.options, 'SecondaryApp');

        try {
          // 3. Create the user in Firebase Authentication
          await secondaryApp.auth().createUserWithEmailAndPassword(formData.email, formData.password);
          await secondaryApp.auth().signOut();
        } catch (authError) {
          console.error("Auth Creation Error:", authError);
          if (authError.code === 'auth/email-already-in-use') {
            toast.error('This email is already registered in Authentication.');
          } else {
            toast.error('Auth Error: ' + authError.message);
          }
          setIsSubmitting(false);
          return; // Stop execution if auth fails
        }

        // 4. Save data to Firestore
        submitData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('sengarcarreradminUsers').add(submitData);
        toast.success('Admin User created successfully!');
      }

      // 5. Refresh list efficiently
      const snapshot = await db.collection('sengarcarreradminUsers').get();
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      resetForm();

    } catch (error) {
      console.error('Error saving admin:', error);
      toast.error(error.message || 'Failed to save admin user to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PermissionCheckbox = ({ name, label }) => (
    <label className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors shadow-sm">
      <input 
        type="checkbox" 
        name={name} 
        checked={formData[name]} 
        onChange={handleInputChange} 
        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
      />
      <span className="text-xs font-bold text-slate-700 select-none">{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminNav />
      
      <div className="md:ml-64 px-4 py-8 max-w-7xl ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Users Management</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage system administrators, passwords, and granular access permissions.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center font-bold text-sm"
          >
            <FiPlus className="mr-2" size={18} /> Add Admin User
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-sm font-bold text-slate-400">Loading admin users...</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-sm font-bold text-slate-400 border-dashed border-2 border-slate-100 m-4 rounded-xl">No admin users found.</td></tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <FiShield className="h-5 w-5 text-indigo-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-800">{admin.name}</div>
                            <div className="text-[11px] font-semibold text-slate-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 inline-flex text-[10px] font-black uppercase tracking-wider rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                          {admin.access}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                          admin.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {admin.isVerified && <FiCheckCircle size={10} />}
                          {admin.isVerified ? 'True' : 'False'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(admin)} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors shadow-sm">
                            Edit Access
                          </button>
                          <button onClick={() => handleDelete(admin.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-colors">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Admin User' : 'Add New Admin User'}</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Configure account details and module access</p>
              </div>
              <button onClick={resetForm} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm font-semibold text-slate-800 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="admin@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm font-semibold text-slate-800 transition-all" required={!editingId} disabled={!!editingId} />
                  </div>
                  {!editingId && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Password</label>
                      <input type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimum 6 characters" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm font-semibold text-slate-800 transition-all" required />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Primary Role</label>
                      <select name="access" value={formData.access} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm font-semibold text-slate-800 transition-all cursor-pointer" required>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Verified Status</label>
                      <select name="isVerified" value={formData.isVerified ? 'true' : 'false'} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm font-semibold text-slate-800 transition-all cursor-pointer" required>
                        <option value="true">True (Verified)</option>
                        <option value="false">False (Unverified)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                  <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><FiShield className="text-indigo-500" /> Permission Configurations</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Module View Access</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <PermissionCheckbox name="viewDashboard" label="View Dashboard" />
                        <PermissionCheckbox name="viewStudent" label="View Students" />
                        <PermissionCheckbox name="viewFees" label="View Fees" />
                        <PermissionCheckbox name="viewTestSeries" label="View Test Series" />
                        <PermissionCheckbox name="viewYouTube" label="View YouTube" />
                        <PermissionCheckbox name="viewAdminUser" label="View Admin Users" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Fees & Financial Controls</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <PermissionCheckbox name="viewDashboardFeesStats" label="View Dashboard Fee Stats" />
                        <PermissionCheckbox name="viewUpcomingFees" label="View Upcoming Fees" />
                        <PermissionCheckbox name="feesEditAccess" label="Edit Fee Structure" />
                        <PermissionCheckbox name="feesPaidAccess" label="Mark Fees as Paid" />
                        <PermissionCheckbox name="feesMarkUnpaidAccess" label="Mark Fees as Unpaid" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm transition-all shadow-sm disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Configurations' : 'Create User & Permissions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;