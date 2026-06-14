import React, { useState } from "react";
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from '../Firebase/config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signinsinup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(firebaseApp);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Sign in successful!");
      router.push('/Student');
    } catch (error) {
      let errorMessage = "Sign in failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        default:
          break;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container: Full width, pure white background
    <div className=" w-full bg-white">
      
      {/* Form Container: Blends seamlessly into the white background */}
      <div className="w-full ">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-4 rounded-full border border-gray-200" 
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Welcome Back</h2>
          <p className="text-center text-sm text-gray-500 font-medium px-4">
            We'll check if you have an account, and help create one if you don't.
          </p>
        </div>

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleSignIn}>
          {/* Email Input */}
          <div>
            <label className="mb-2 text-sm font-bold text-gray-900 block">Email Address</label>
            <div className="relative flex items-center">
              <input 
                type="email" 
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-5 h-5 absolute right-4 text-gray-400"
                viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 text-sm font-bold text-gray-900 block">Password</label>
            <div className="relative flex items-center">
              <input 
                type="password" 
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-sm" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                className="w-5 h-5 absolute right-4 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 text-sm font-bold tracking-wide text-white rounded-lg transition-all shadow-md 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Signinsinup;