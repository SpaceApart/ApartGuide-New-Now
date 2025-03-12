import React from "react";
import MetricsPanel from "./MetricsPanel";
import QuickActionCard from "./QuickActionCard";
import RecentActivityList from "./RecentActivityList";
import { PlusCircle, MessageSquare, Package, Calendar } from "lucide-react";

interface DashboardOverviewProps {
  userName?: string;
}

const DashboardOverview = ({
  userName = "Property Manager",
}: DashboardOverviewProps) => {
  // Handler functions for quick action cards
  const handleAddProperty = () => {
    console.log("Add property clicked");
    // Navigation or modal opening logic would go here
  };

  const handleCreateGuide = () => {
    console.log("Create guide clicked");
    // Navigation or modal opening logic would go here
  };

  const handleManageServices = () => {
    console.log("Manage services clicked");
    // Navigation or modal opening logic would go here
  };

  const handleScheduleCleaning = () => {
    console.log("Schedule cleaning clicked");
    // Navigation or modal opening logic would go here
  };

  return (
    <div className="w-full h-full p-6 overflow-auto bg-gray-50">
      {/* Welcome section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Metrics Panel */}
      <div className="mb-8">
        <MetricsPanel />
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add New Property"
            description="Create a new property listing"
            icon={<PlusCircle className="h-10 w-10 text-blue-500" />}
            actionText="Add Property"
            onClick={handleAddProperty}
            variant="property"
          />

          <QuickActionCard
            title="Create Guest Guide"
            description="Send instructions to guests"
            icon={<MessageSquare className="h-10 w-10 text-green-500" />}
            actionText="Create Guide"
            onClick={handleCreateGuide}
            variant="guide"
          />

          <QuickActionCard
            title="Manage Services"
            description="Set up additional services"
            icon={<Package className="h-10 w-10 text-purple-500" />}
            actionText="Manage Services"
            onClick={handleManageServices}
            variant="service"
          />

          <QuickActionCard
            title="Schedule Cleaning"
            description="Organize cleaning services"
            icon={<Calendar className="h-10 w-10 text-amber-500" />}
            actionText="Schedule"
            onClick={handleScheduleCleaning}
            variant="cleaning"
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-6">
        <RecentActivityList />
      </div>

      {/* Stats or additional information could go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Upcoming Bookings</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">Seaside Apartment {i}</p>
                  <p className="text-sm text-gray-500">
                    May {10 + i} - May {15 + i}, 2023
                  </p>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {3 - i} days away
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold">$12,450</p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 12% from last month
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Projected</p>
              <p className="text-2xl font-bold">$15,200</p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 22% from last month
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Top performing property:</p>
            <p className="font-medium">Lakeside Cottage - $4,320 this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
