// Main.jsx
import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { useMediaQuery } from "react-responsive";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export const Main = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        username='John Doe'
        toggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
      />
      
      <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`} style={{ flex: 1 }}>
        <Sidebar
          collapsed={isSidebarCollapsed || isMobile}
          isMobile={isMobile}
        />
        <div className='content'>{children}</div>
      </div>

      <Footer />

      <ToastContainer />
    </div>
  );
};
