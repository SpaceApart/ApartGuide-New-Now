import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, Settings, User, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/AuthContext";

interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onProfileClick?: () => void;
}

const DashboardHeader = ({
  user: propUser,
  notificationCount = 3,
  onNotificationsClick = () => console.log("Notifications clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
  onLogoutClick: propOnLogoutClick,
  onProfileClick = () => console.log("Profile clicked"),
}: DashboardHeaderProps) => {
  const { user: authUser, logout } = useAuth();

  // Use auth user data if available, otherwise fallback to props
  const user = authUser
    ? {
        name:
          authUser.user_metadata?.firstName && authUser.user_metadata?.lastName
            ? `${authUser.user_metadata.firstName} ${authUser.user_metadata.lastName}`
            : authUser.email?.split("@")[0] || "User",
        email: authUser.email || "",
        avatar:
          authUser.user_metadata?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email}`,
      }
    : propUser || {
        name: "Jane Cooper",
        email: "jane@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      };

  // Use auth logout if available, otherwise fallback to props
  const onLogoutClick = async () => {
    if (logout) {
      await logout();
    } else if (propOnLogoutClick) {
      propOnLogoutClick();
    }
  };
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">ApartGuide</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onNotificationsClick}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                    variant="destructive"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100 px-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
