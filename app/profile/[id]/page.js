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

  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
      fetchAllUsers();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setProfile(response.data);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleFollow = async (id) => {
    try {
      await axios.post(`/api/follow/${id}`, { userId: session.user.id });
      setFollowing([...following, id]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await axios.post(`/api/unfollow/${id}`, { userId: session.user.id });
      setFollowing(following.filter((followedId) => followedId !== id));
    } catch (error) {
      console.error('Error unfollowing user:', error);
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
      <h2 className="text-xl font-bold mt-8 mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="flex items-center justify-between mb-4">
            <span>{user.name}</span>
            {following.includes(user._id) ? (
              <button
                onClick={() => handleUnfollow(user._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Follow
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
