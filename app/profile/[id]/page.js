'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const ProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = pathname.split('/')[2];
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let base64Image = '';
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async () => {
          base64Image = reader.result;
          await updateProfile(base64Image);
        };
        reader.onerror = (error) => {
          console.error('Error reading image file:', error);
        };
      } else {
        await updateProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const updateProfile = async (base64Image = null) => {
    try {
      const updatedData = {
        name: profile.name,
        bio: profile.bio,
        image: base64Image,
      };
      await axios.put(`/api/users/${userId}`, updatedData);
      setLoading(false);
      router.push(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="mb-4">
          {profile.image && (
            <img
              src={profile.image}
              alt="Profile Picture"
              className="w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

