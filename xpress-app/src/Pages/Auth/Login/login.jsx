import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import XpressLogo from "../../../assets/Xpress-Autozone-Logo.png"
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../../Contexts/authContext';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../authSlice';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const dispatch = useDispatch();

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;
    
      if (user) {
        // Force refresh token to get latest claims
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role || "user"; 
        
        dispatch(setCredentials({
          user: {
            uid: user.uid,
            email: user.email,
            role: role
          },
          token: tokenResult.token
        }));

        if (role === "admin" || role === "manager" || role === "moderator" || role === "accountant" || role === "vendor") {
          // Show dashboard for authorized roles
          navigate("/");
        } else {
          setError("Access Denied: You do not have administrative permissions.");
        }
      }
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Login Access */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="mb-10 text-center lg:text-left">
                <img src={XpressLogo} alt="XpressLogo" className="h-16 w-auto mx-auto lg:mx-0 mb-8 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"/>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
                <p className="text-gray-500 font-medium">Secure access for authorized personnel only.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                  <p className="text-red-600 text-sm font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    {error}
                  </p>
                </div>
              )}

              {/* Google Login Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-100 rounded-2xl shadow-sm text-base font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-500 border-t-transparent"></div>
                      <span className="text-gray-400">Verifying Identity...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google Workspace
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 px-4">
                  By signing in, you agree to our Internal Security Policy and System Usage Terms.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-16 text-center lg:text-left flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  ©2026 Xpress Autozone System Administration
                </p>
                <a 
                  href="https://bookflywheel.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-gray-400 hover:text-orange-500 active:text-orange-600 transition-colors duration-200 inline-flex items-center gap-1 justify-center lg:justify-start"
                >
                  Developed by flywheel
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Branding/Hero */}
          <div className="hidden lg:flex lg:w-1/2 bg-yellow-400 p-16 items-center justify-center relative overflow-hidden">
            {/* Abstract Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl transform rotate-12">
                <Lock className="w-12 h-12 text-gray-900" />
              </div>

              <h2 className="text-4xl font-black mb-6 text-gray-900 leading-tight">
                Xpress Admin<br/>Command Center
              </h2>
              <div className="w-16 h-1.5 bg-gray-900 mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-800 text-lg font-medium leading-relaxed max-w-sm mx-auto opacity-80">
                Centralized intelligence for inventory, logistics, and vendor relations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;