import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    // Set initial preview URL if user has a profile image
    if (user.profile_image) {
       const path = process.env.REACT_APP_BASE_URL_IMG + user.profile_image;
      setPreviewUrl(path);
    }
  }, [navigate, user.profile_image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    if (name === 'profile_image') {
      setImageError(null);
      setPreviewUrl(value);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setImageError('Please select an image file');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageError(null);
      setUser(prev => ({ ...prev, profile_image: '' })); // Clear URL input
    }
  };

  const handleImagePicker = () => {
    fileInputRef.current.click();
  };

  const handleImageError = () => {
    setImageError('Invalid image URL');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    // Append all user fields except profile_image if a file is selected
    Object.entries(user).forEach(([key, value]) => {
      if (key !== 'profile_image' || !selectedFile) {
        formData.append(key, value);
      }
    });
    if (selectedFile) {
      formData.append('profile_image', selectedFile);
    }

    fetch(`${baseUrl}auth/update/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to update user data');
        }
        return response.json();
      })
      .then(data => {
        // Update user with the new profile_image path from the server
        const updatedUser = { ...user, profile_image: data.profile_image || user.profile_image };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Profile updated successfully!');
          toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          toastId: "sign-in-success",
        });
        setTimeout(() => setSuccess(null), 3000);
        setLoading(false);
        if (selectedFile) {
          setPreviewUrl(data.profile_image || URL.createObjectURL(selectedFile));
        }
      })
      .catch(err => {
        if (err.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        setError(err.message);
        setTimeout(() => setError(null), 3000);
        setLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  return (
    <div className="flex min-h-screen bg-gray-100 min-w-full flex-col items-center justify-center">
      <header className="text-black p-4 text-center mt-2">
        <h1 className="text-3xl font-bold">Profile Page</h1>
        {error && <p className="text-red-200 mt-2">{error}</p>}
        {success && <p className="text-green-200 mt-2">{success}</p>}
      </header>

      <div className="flex p-6 w-[90%] items-center justify-center">
        <section className="w-1/2 md:w-1/3 bg-white p-6 rounded-lg shadow-md md:mr-6 h-48">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Account Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="text-gray-700">
              <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
            </p>
          </div>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md w-1/2 h-48">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Change Password
          </h2>
          <p className="text-gray-600">
            To change your password, implement a separate form with old
            password, new password, and confirmation. Send to a dedicated
            endpoint like /api/user/password.
          </p>
        </section>
      </div>

      <section className="w-[90%] bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Edit Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name:
            </label>
            <input
              type="text"
              name="full_name"
              value={user.full_name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone:
            </label>
            <input
              type="tel"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Profile Image:
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                name="profile_image"
                value={user.profile_image || ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter image URL"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={handleImagePicker}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </button>
            </div>
            {imageError && (
              <p className="text-red-500 text-sm mt-1">{imageError}</p>
            )}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-20 h-20 mt-2 rounded-full object-cover"
                onError={handleImageError}
              />
            )}
          </div> */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender:
            </label>
            <select
              name="gender"
              value={user.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={user.dob ? user.dob.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address:
            </label>
            <textarea
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Bio:</label>
            <textarea
              name="bio"
              value={user.bio || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Organization:
            </label>
            <input
              type="text"
              name="organization"
              value={user.organization || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;