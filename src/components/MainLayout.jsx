// layouts/MainLayout.jsx
import Topbar from "../components/Topbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      {children}
    </>
  );
};

export default MainLayout;
