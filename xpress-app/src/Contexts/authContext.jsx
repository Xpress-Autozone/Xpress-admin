// src/contexts/AuthContext.js - CREATE THIS NEW FILE
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '../firebase/config';

import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Auth functions
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile) {
      return signInWithRedirect(auth, provider);
    } else {
      return signInWithPopup(auth, provider);
    }
  };

  useEffect(() => {
    // Handle redirect result for mobile
    getRedirectResult(auth).catch((error) => {
      console.error("Error getting redirect result:", error);
    });
  }, []);

  useEffect(() => {
    let refreshInterval;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const syncToken = async () => {
          try {
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
            console.log("[AuthContext] Token refreshed successfully");
          } catch (error) {
            console.error("[AuthContext] Error refreshing token:", error);
          }
        };

        await syncToken();

        // Refresh token every 45 minutes (Firebase tokens expire in 60m)
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(syncToken, 45 * 60 * 1000);
      } else {
        if (refreshInterval) clearInterval(refreshInterval);
        setCurrentUser(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [dispatch]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}