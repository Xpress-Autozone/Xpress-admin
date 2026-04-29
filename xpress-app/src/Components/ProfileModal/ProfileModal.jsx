import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, User, Camera, Loader2 } from 'lucide-react';
import { auth, storage } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { API_BASE_URL } from '../../config/api';

const PLACEHOLDER_AVATARS = [
  { id: 'car1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop', label: 'Classic Sports' },
  { id: 'car2', url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=400&h=400&fit=crop', label: 'Modern Supercar' },
  { id: 'car3', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', label: 'Off-road' },
  { id: 'car4', url: 'https://images.unsplash.com/photo-1611859328053-3cbc9f9399f4?w=400&h=400&fit=crop', label: 'Chrome Rim' },
  { id: 'car5', url: 'https://images.unsplash.com/photo-1486006396113-ad7b32766347?w=400&h=400&fit=crop', label: 'V8 Engine' },
  { id: 'car6', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=400&fit=crop', label: 'Steering Wheel' },
];

const ProfileModal = ({ isOpen, onClose, currentUser, token }) => {
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [selectedPhotoURL, setSelectedPhotoURL] = useState(currentUser?.photoURL || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentUser?.displayName || '');
      setSelectedPhotoURL(currentUser?.photoURL || '');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File size should be less than 2MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const storageRef = ref(storage, `profiles/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setSelectedPhotoURL(downloadURL);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // 1. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: selectedPhotoURL
      });

      // 2. Sync with Backend (optional but recommended for consistency)
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/users/${currentUser.uid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              displayName: displayName.trim(),
              photoURL: selectedPhotoURL
            })
          });
        } catch (syncErr) {
          console.warn('Backend sync failed (might be expected if not admin):', syncErr);
          // We don't block on this if the user isn't an admin
        }
        
        // Also update Firestore profile via the specific endpoint if available
        try {
          await fetch(`${API_BASE_URL}/users/${currentUser.uid}/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              // We'll just trigger a sync by sending what we have
              // Actually the backend updateUser handles displayName and photoURL if it was admin
              // but /users/:uid/profile usually handles metadata. 
              // For now, updating Auth is the priority as that's what the UI uses.
            })
          });
        } catch (syncErr) {
           console.warn('Backend profile sync failed:', syncErr);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Avatar Selection */}
        <div className="md:w-1/2 bg-gray-50 p-8 flex flex-col items-center border-r border-gray-100 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-yellow-500" />
            Profile Picture
          </h3>
          
          <div className="relative group mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-yellow-100 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-10 h-10 text-yellow-600 animate-spin" />
              ) : selectedPhotoURL ? (
                <img src={selectedPhotoURL} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-yellow-600" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-md transition-all transform hover:scale-110 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>

          <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Or choose a themed avatar</p>
          <div className="grid grid-cols-3 gap-3 w-full">
            {PLACEHOLDER_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedPhotoURL(avatar.url)}
                className={`relative rounded-lg overflow-hidden h-16 border-2 transition-all ${
                  selectedPhotoURL === avatar.url ? 'border-yellow-400 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                {selectedPhotoURL === avatar.url && (
                  <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-yellow-600 drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">Email cannot be changed from the dashboard.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading || success}
              className="flex-[2] px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold rounded-full shadow-lg shadow-yellow-200/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
