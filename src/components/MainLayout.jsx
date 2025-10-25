// src/layouts/MainLayout.jsx
import Topbar from "../components/Topbar";
import Footer from "./Footer";

// src/layouts/MainLayout.jsx
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0">
        <Topbar />
      </header>

      {/* SCROLL CONTAINER – HIDDEN SCROLLBAR */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>

      <footer className="flex-shrink-0">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;