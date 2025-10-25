import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Camera,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  Save,
} from "lucide-react";
import TextArea from "./TextArea";
import Input from "./Input";
import Select from "./Select";

function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || "";
  const imgBase = process.env.REACT_APP_BASE_URL_IMG || "";

  // ── Auth guard & initial preview ───────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (user.profile_image) {
      setPreviewUrl(`${imgBase}${user.profile_image}`);
    }
  }, [navigate, user.profile_image, imgBase]);

  // ── File picker → preview ───────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Generic field change ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((u) => ({ ...u, [name]: value }));
  };

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    Object.entries(user).forEach(([k, v]) => {
      if (k !== "profile_image" || !selectedFile) formData.append(k, v);
    });
    if (selectedFile) formData.append("profile_image", selectedFile);

    try {
      const res = await fetch(`${baseUrl}auth/update/${user.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!res.ok) {
        const msg =
          res.status === 404 ? "User not found" : "Failed to update profile";
        throw new Error(msg);
      }

      const data = await res.json();
      const updated = {
        ...user,
        profile_image: data.profile_image || user.profile_image,
      };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setSuccess("Profile updated!");
      toast.success("Profile updated!", { autoClose: 2000 });
      if (	selectedFile && data.profile_image) {
        setPreviewUrl(`${imgBase}${data.profile_image}`);
      }
    } catch (err) {
      if (err.message.includes("401")) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };

  // ── Cleanup object URLs ───────────────────────────────────────
  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // ── UI ───────────────────────────────────────────────────────
  return (
    <div className="flex min-w-full flex-col items-center px-4 py-6 max-w-5xl mx-auto">
      {/* ==== Header + Avatar ==== */}
      <header className="w-full text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-300">
                <User className="w-16 h-16 text-gray-500" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
            aria-label="Change photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          {user.full_name || "Your Profile"}
        </h1>
        {error && <p className="mt-2 text-red-600">{error}</p>}
        {success && <p className="mt-2 text-green-600">{success}</p>}
      </header>

      {/* ==== Info Cards ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {/* Account Info */}
        <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-600 mb-4">
            <Shield className="w-5 h-5" /> Account Information
          </h2>
          <dl className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <dt className="font-medium">Email:</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <dt className="font-medium">Role:</dt>
              <dd className="capitalize">{user.role}</dd>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`w-4 h-4 ${
                  user.verified ? "text-green-600" : "text-gray-400"
                }`}
              />
              <dt className="font-medium">Verified:</dt>
              <dd>{user.verified ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </section>

        {/* Change Password */}
        <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-600 mb-4">
            <Shield className="w-5 h-5" /> Change Password
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Use a dedicated form with <strong>old password</strong>,{" "}
            <strong>new password</strong> and <strong>confirmation</strong>.
            Send to <code className="bg-gray-100 px-1 rounded">/api/user/password</code>.
          </p>
        </section>
      </div>

      {/* ==== Edit Form ==== */}
      <section className="w-full bg-white p-6 md:p-8 rounded-xl shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-600 mb-6">
          <FileText className="w-5 h-5" /> Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            name="full_name"
            value={user.full_name || ""}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            required
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={user.phone || ""}
            onChange={handleChange}
            icon={<Phone className="w-5 h-5" />}
          />

          <Select
            label="Gender"
            name="gender"
            value={user.gender || ""}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>

          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={user.dob ? user.dob.split("T")[0] : ""}
            onChange={handleChange}
            icon={<Calendar className="w-5 h-5" />}
          />

          <div className="md:col-span-2">
            <TextArea
              label="Address"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Bio"
              name="bio"
              value={user.bio || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Input
            label="Organization"
            name="organization"
            value={user.organization || ""}
            onChange={handleChange}
            icon={<Briefcase className="w-5 h-5" />}
          />

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Save className="animate-spin w-5 h-5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;