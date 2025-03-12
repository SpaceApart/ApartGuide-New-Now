import React, { useState } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import Sidebar from "./dashboard/Sidebar";
import DashboardOverview from "./dashboard/DashboardOverview";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock user data
  const user = {
    name: "Jane Cooper",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <DashboardHeader user={user} notificationCount={3} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <DashboardOverview userName={user.name.split(" ")[0]} />
        </main>
      </div>
    </div>
  );
};

export default Home;
