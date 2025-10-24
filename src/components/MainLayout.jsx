// src/layouts/MainLayout.jsx
import Topbar from "../components/Topbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar – shrink-to-fit */}
      <header className="flex-shrink-0">
        <Topbar />
      </header>

      {/* MAIN CONTENT – **must** fill the rest */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;