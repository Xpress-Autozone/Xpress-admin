// src/contexts/AuthContext.js - CREATE THIS NEW FILE
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../authSlice';

const AuthContext = createContext();

const db = getFirestore();

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
    return signInWithPopup(auth, provider);

  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
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
        } catch (error) {
          console.error("[AuthContext] Error syncing with Redux:", error);
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
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