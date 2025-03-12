import React, { useState } from "react";
import TeamManagement from "@/components/team/TeamManagement";
import { Toaster } from "@/components/ui/toaster";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

const TeamPage = () => {
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

        {/* Team Management Content */}
        <main className="flex-1 overflow-auto">
          <TeamManagement />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default TeamPage;
