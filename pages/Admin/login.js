import React, { useState } from 'react';
import { firebase } from '../../Firebase/config';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const db = firebase.firestore();

      try {
        // 1. Attempt standard Firebase Auth login
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (authError) {
        // 2. Catch the "Invalid Credential" error if the user isn't in Auth yet
        if (
          authError.code === 'auth/invalid-credential' || 
          authError.code === 'auth/user-not-found' || 
          authError.code === 'auth/wrong-password'
        ) {
          
          // Check if they exist in our Firestore database instead
          const adminCheck = await db.collection('sengarcarreradminUsers').where('email', '==', email).get();
          
          if (!adminCheck.empty) {
            const adminData = adminCheck.docs[0].data();
            
            // Validate the plaintext password from Firestore
            if (adminData.password === password) {
              try {
                // Just-In-Time Creation: Create the missing Firebase Auth account on the fly!
                // This automatically signs them in.
                await firebase.auth().createUserWithEmailAndPassword(email, password);
              } catch (createError) {
                if (createError.code === 'auth/email-already-in-use') {
                  // User exists in Auth, but they changed their password in the Database
                  throw new Error('password-desync');
                }
                throw createError;
              }
            } else {
              throw new Error('invalid-password'); // Wrong password
            }
          } else {
             throw authError; // Not in Firestore either, throw original error
          }
        } else {
           throw authError; // Some other Auth error (like too-many-requests)
        }
      }

      // --- At this point, the user is successfully signed into Firebase Auth ---

      // 3. Fetch the corresponding admin user document from Firestore to check Verification
      const adminSnapshot = await db.collection('sengarcarreradminUsers')
        .where('email', '==', email)
        .get();

      if (adminSnapshot.empty) {
        await firebase.auth().signOut();
        toast.error('Access denied: No administrative record found in the database.');
        setLoading(false);
        return;
      }

      const adminData = adminSnapshot.docs[0].data();

      // 4. CRITICAL: Check if the admin is verified
      if (adminData.isVerified !== true) {
        await firebase.auth().signOut();
        toast.error('Access denied: Your account is pending verification.');
        setLoading(false);
        return;
      }

      // Success! Firebase Auth handles the session automatically.
      toast.success('Login successful! Redirecting...', { autoClose: 1500 });
      
      // Redirect to the Dashboard after a brief delay
      setTimeout(() => {
        router.push('/Admin'); // Make sure this matches your exact Dashboard route
      }, 1500);

    } catch (error) {
      console.error('Login Error:', error);
      
      // Handle custom and platform errors safely
      if (error.message === 'invalid-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error('Invalid credentials. Please check your email and password.');
      } else if (error.message === 'password-desync') {
        toast.error('Your password was updated by an admin. Please use the "Forgot Password" link to reset your Auth credentials.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.');
      } else {
        toast.error('Failed to login. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 relative overflow-hidden">
      <ToastContainer position="top-right" theme="colored" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md px-6 py-12 mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg mb-4">
            <FiLogIn size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Admin Portal</h1>
          <p className="text-sm font-medium text-blue-200">Sign in to access your administrative dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-blue-400" size={18} />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-blue-300/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm" 
                placeholder="admin@example.com" 
                required 
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-blue-400" size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-11 pr-12 py-3 bg-white/5 border border-blue-300/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all disabled:opacity-70 mt-8"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-blue-300 font-medium">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;