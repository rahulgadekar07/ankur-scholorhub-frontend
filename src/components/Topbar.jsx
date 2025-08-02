import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../pages/auth/AuthModal";

const Topbar = () => {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div className="max-h-30vh">
      {/* Top Section */}
      <div className="flex justify-between w-full bg-blue-800 text-white p-1 text-sm">
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          gadekarrahul804@gmail.com
        </p>
        <div className="mr-2">
          {user ? (
            <span className="ml-2">
              <button
                type="button"
                className="text-white bg-transparent border-none p-0 m-0 underline cursor-pointer"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user.name}
              </button>
              <div className="dropdown-content">
                <button
                  type="button"
                  className="text-blue-800 bg-transparent border-none p-0 m-0 underline cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
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
        <div className="">
          <h1 className="text-3xl font-bold text-center mt-2 text-green-500">
            अंकुर विद्यार्थी फाउंडेशन
          </h1>
          <span className="text-sm text-red-500">
            <b>र. वि. नं. महा /३५६/२०२०/</b>E-Mail:
            ankur.vidyarthi.foundation@gmail.com
          </span>
          <br />
          <span className="mb-2 text-sm text-red-500">
            <b>पत्ता:-</b> मु .पो. वेळू , ग्रामपंचायत कायाालय, दुसरा मजला , ता.
            कोरेगाव,जि. सातारा, ४१५५११
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
    </div>
  );
};

export default Topbar;