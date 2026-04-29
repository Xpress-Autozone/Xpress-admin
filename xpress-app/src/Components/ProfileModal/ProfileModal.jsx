import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, User, Camera, Loader2 } from 'lucide-react';
import { auth, storage } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { API_BASE_URL } from '../../config/api';

const PLACEHOLDER_AVATARS = [
  { id: 'car1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop', label: 'Classic Sports' },
  { id: 'car2', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop', label: 'Modern Supercar' },
  { id: 'car3', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', label: 'Off-road' },
  { id: 'car4', url: 'https://images.unsplash.com/photo-1611859328053-3cbc9f9399f4?w=400&h=400&fit=crop', label: 'Chrome Rim' },
  { id: 'car5', url: 'https://images.unsplash.com/photo-1590403669145-22d7159f8a37?w=400&h=400&fit=crop', label: 'V8 Engine' },
  { id: 'car6', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=400&fit=crop', label: 'Steering Wheel' },
  { id: 'car7', url: 'https://images.unsplash.com/photo-1541139366608-8e65e648c68b?w=400&h=400&fit=crop', label: 'Muscle Car' },
  { id: 'car8', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop', label: 'Luxury Interior' },
  { id: 'car9', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop', label: 'Race Car' },
  { id: 'car10', url: 'https://images.unsplash.com/photo-1534484042858-da3980007e05?w=400&h=400&fit=crop', label: 'Gear Shifter' },
  { id: 'car11', url: 'https://images.unsplash.com/photo-1542362567-b055002b9134?w=400&h=400&fit=crop', label: 'Dashboard' },
  { id: 'car12', url: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?w=400&h=400&fit=crop', label: 'Speedometer' },
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

      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: selectedPhotoURL
      });

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
          console.warn('Backend sync failed:', syncErr);
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
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-w-2xl w-full mx-0 md:mx-4 overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Close Button (Mobile Only Header) */}
        <div className="md:hidden flex justify-center py-3 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Left Side: Avatar Selection (Desktop Sidebar / Mobile Top Section) */}
        <div className="md:w-5/12 bg-gray-50/50 p-6 md:p-8 flex flex-col items-center border-r border-gray-100 overflow-y-auto">
          <h3 className="hidden md:flex text-lg font-bold text-gray-900 mb-6 items-center gap-2">
            <Camera className="w-4 h-4 text-yellow-500" />
            Profile Picture
          </h3>
          
          <div className="relative group mb-6 md:mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-yellow-100 flex items-center justify-center transition-all group-hover:scale-105">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
              ) : selectedPhotoURL ? (
                <img src={selectedPhotoURL} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-yellow-600" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-md transition-all transform hover:scale-110 disabled:opacity-50"
            >
              <Upload className="w-3 h-3 md:w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>

          <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest font-bold">Themed Avatars</p>
          
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-3 w-full overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide px-2 md:px-0">
            {PLACEHOLDER_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedPhotoURL(avatar.url)}
                className={`flex-shrink-0 relative rounded-xl overflow-hidden h-14 w-14 md:h-16 md:w-auto border-2 transition-all ${
                  selectedPhotoURL === avatar.url ? 'border-yellow-400 scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                {selectedPhotoURL === avatar.url && (
                  <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-yellow-600 drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between bg-white relative">
          <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="animate-in slide-in-from-left-2 duration-300">
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Display Name</label>
                <div className="relative group">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                   <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 focus:bg-white transition-all text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="animate-in slide-in-from-left-2 duration-400">
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-medium"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">Email cannot be changed for security.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl animate-shake font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-xs rounded-xl flex items-center gap-2 animate-in slide-in-from-bottom-2 font-bold">
                  <Check className="w-4 h-4" /> Changes saved successfully!
                </div>
              )}
            </div>
          </div>

          {/* Sticky Actions Container */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-0 md:relative md:mt-8 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 md:py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading || success}
              className="flex-[2] px-4 py-3 md:py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold rounded-full shadow-lg shadow-yellow-200/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
import { Mail } from 'lucide-react';
