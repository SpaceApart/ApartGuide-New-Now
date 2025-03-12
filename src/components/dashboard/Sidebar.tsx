import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Building,
  Users,
  Package,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Mail,
  MailCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  collapsed?: boolean;
}

const NavItem = ({
  icon,
  label,
  active = false,
  href = "#",
  onClick,
  collapsed = false,
}: NavItemProps) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </a>
  );
};

const Sidebar = ({
  className,
  collapsed = false,
  onToggleCollapse = () => {},
}: SidebarProps) => {
  // Mock active state - in a real app, this would be determined by the current route
  const [activeItem, setActiveItem] = React.useState("dashboard");

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border",
        collapsed ? "w-16" : "w-64 lg:w-72",
        className,
      )}
    >
      {/* Logo area */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <div className="font-semibold text-lg">ApartGuide</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            active={activeItem === "dashboard"}
            onClick={() => setActiveItem("dashboard")}
            collapsed={collapsed}
          />

          <div className={cn("mt-6 mb-2", collapsed ? "px-2" : "px-3")}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Property Management
              </h3>
            )}
          </div>

          <NavItem
            icon={<Building className="h-5 w-5" />}
            label="Properties"
            active={activeItem === "properties"}
            onClick={() => setActiveItem("properties")}
            collapsed={collapsed}
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Guest Guides"
            active={activeItem === "guides"}
            onClick={() => setActiveItem("guides")}
            collapsed={collapsed}
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Zespół"
            active={activeItem === "team"}
            onClick={() => {
              setActiveItem("team");
              window.location.href = "/team";
            }}
            collapsed={collapsed}
          />

          <div className={cn("mt-6 mb-2", collapsed ? "px-2" : "px-3")}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Operations
              </h3>
            )}
          </div>

          <NavItem
            icon={<Package className="h-5 w-5" />}
            label="Services"
            active={activeItem === "services"}
            onClick={() => setActiveItem("services")}
            collapsed={collapsed}
          />
          <NavItem
            icon={<Calendar className="h-5 w-5" />}
            label="Cleaning Schedule"
            active={activeItem === "cleaning"}
            onClick={() => setActiveItem("cleaning")}
            collapsed={collapsed}
          />

          <div className={cn("mt-6 mb-2", collapsed ? "px-2" : "px-3")}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </h3>
            )}
          </div>

          <NavItem
            icon={<Mail className="h-5 w-5" />}
            label="Email Templates"
            active={activeItem === "email-templates"}
            onClick={() => {
              setActiveItem("email-templates");
              window.location.href = "/admin/email-templates";
            }}
            collapsed={collapsed}
          />
          <NavItem
            icon={<MailCheck className="h-5 w-5" />}
            label="Email Logs"
            active={activeItem === "email-logs"}
            onClick={() => {
              setActiveItem("email-logs");
              window.location.href = "/admin/email-logs";
            }}
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-3">
        <Separator className="mb-3" />
        <nav className="space-y-1">
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={activeItem === "settings"}
            onClick={() => setActiveItem("settings")}
            collapsed={collapsed}
          />
          <NavItem
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help & Support"
            active={activeItem === "help"}
            onClick={() => setActiveItem("help")}
            collapsed={collapsed}
          />
          <NavItem
            icon={<LogOut className="h-5 w-5" />}
            label="Logout"
            onClick={() => {
              const { logout } = require("@/context/AuthContext").useAuth();
              logout();
            }}
            collapsed={collapsed}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
