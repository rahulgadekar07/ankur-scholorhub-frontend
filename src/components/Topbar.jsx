import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../pages/auth/AuthModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const baseUrl = (process.env.REACT_APP_BASE_URL_IMG || "").replace(/\/+$/, "");
  const defaultImage = "/default-profile.png";
  const userProfileImage = user?.profile_image
    ? `${baseUrl}/${user.profile_image.replace(/^\/+/, "")}`
    : null;
  const encodedFilePath = userProfileImage
    ? userProfileImage.replace(/\s/g, "%20")
    : defaultImage;

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful, user should be null");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: "logout-success",
      });
      navigate("/");
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    console.log("User in Topbar:", user);
    console.log("Encoded Profile Image in Topbar:", encodedFilePath);
  }, [encodedFilePath, user]);

  const openImageInPopup = () => {
    if (userProfileImage) {
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      const img = document.createElement("img");
      img.src = userProfileImage;
      img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      `;

      modal.addEventListener("click", () => modal.remove());
      modal.appendChild(img);
      document.body.appendChild(modal);
    } else {
      alert("No profile image available.");
    }
  };

  const openProfilePage = () => {
    navigate("/profile");
  };

  return (
    <div className="max-h-30vh">
      {/* Top Section */}
      <div className="flex justify-between w-full bg-blue-800 text-white p-1 text-sm">
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          gadekarrahul804@gmail.com
        </p>
        <div className="mr-2 relative">
          {user ? (
            <span className="ml-2">
              <span>
                <img
                  src={encodedFilePath}
                  alt="Profile"
                  className="w-8 h-8 rounded-full inline-block mr-2 cursor-pointer"
                  onClick={openImageInPopup}
                />
              </span>
              <button
                type="button"
                className="text-white bg-transparent border-none p-0 m-0 underline cursor-pointer"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {user.full_name}
              </button>
              {dropdownOpen && (
                <div className="dropdown-content absolute right-0 mt-2 w-48 bg-white text-blue-800 rounded shadow-lg z-10">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={openProfilePage}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </span>
          ) : (
            <span className="ml-2">
              <button
                type="button"
                className="text-white bg-transparent border-none p-0 m-0 underline cursor-pointer"
                onClick={handleOpen}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex flex-row justify-between content-center">
        <div>
          <img className="w-20 h-20 mt-2" src="/Logo.png" alt="Logo" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mt-2 text-green-500">
            अंकुर विद्यार्थी फाउंडेशन
          </h1>
          <span className="text-sm text-red-500">
            <b>र. वि. नं. महा /३५६/२०२०/</b> E-Mail:
            ankur.vidyarthi.foundation@gmail.com
          </span>
          <br />
          <span className="mb-2 text-sm text-red-500">
            <b>पत्ता:-</b> मु .पो. वेळू , ग्रामपंचायत कायाालय, दुसरा मजला , ता.
            कोरेगाव, जि. सातारा, ४१५५११
          </span>
        </div>
        <div>
          <img className="w-20 h-20 mt-2" src="/Logo.png" alt="Logo" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-blue-800 text-white p-1 text-sm">
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          gadekarrahul804@gmail.com
        </p>
      </div>

      {/* Auth Modal */}
      <AuthModal open={modalOpen} onClose={handleClose} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Topbar;