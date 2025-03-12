import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CalendarClock,
  Home,
  Package,
  User,
  MessageSquare,
  DollarSign,
} from "lucide-react";

type ActivityType = "booking" | "guide" | "service" | "cleaning" | "message";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  property: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: "pending" | "completed" | "cancelled";
}

interface RecentActivityListProps {
  activities?: Activity[];
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "booking":
      return <CalendarClock className="h-4 w-4" />;
    case "guide":
      return <MessageSquare className="h-4 w-4" />;
    case "service":
      return <Package className="h-4 w-4" />;
    case "cleaning":
      return <Home className="h-4 w-4" />;
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <CalendarClock className="h-4 w-4" />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getActivityTypeLabel = (type: ActivityType) => {
  switch (type) {
    case "booking":
      return "New Booking";
    case "guide":
      return "Guest Guide";
    case "service":
      return "Service Order";
    case "cleaning":
      return "Cleaning";
    case "message":
      return "Message";
    default:
      return "Activity";
  }
};

const RecentActivityList = ({
  activities = defaultActivities,
}: RecentActivityListProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="guides">Guest Guides</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {activities
              .filter((activity) => activity.type === "booking")
              .map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            {activities
              .filter((activity) => activity.type === "guide")
              .map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {activities
              .filter((activity) => activity.type === "service")
              .map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {activity.user ? (
          <Avatar>
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            {getActivityIcon(activity.type)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <Badge variant="outline" className="ml-2">
            {getActivityTypeLabel(activity.type)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">{activity.property}</p>
          <p className="text-xs text-gray-400">{activity.timestamp}</p>
        </div>
        {activity.status && (
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
            >
              {activity.status.charAt(0).toUpperCase() +
                activity.status.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Default mock data
const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking: Ocean View Suite",
    description: "John Smith booked for May 15-20, 2023",
    timestamp: "10 minutes ago",
    property: "Seaside Apartments - Unit 301",
    user: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    status: "completed",
  },
  {
    id: "2",
    type: "guide",
    title: "Guest Guide Sent",
    description: "Access instructions sent to Maria Johnson",
    timestamp: "1 hour ago",
    property: "Mountain Retreat - Cabin 5",
    user: {
      name: "Maria Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    },
  },
  {
    id: "3",
    type: "service",
    title: "Welcome Package Purchased",
    description: "Premium welcome package ordered for upcoming stay",
    timestamp: "3 hours ago",
    property: "Downtown Loft - Unit 12B",
    status: "pending",
  },
  {
    id: "4",
    type: "cleaning",
    title: "Cleaning Scheduled",
    description: "Deep cleaning scheduled between guest stays",
    timestamp: "Yesterday at 4:30 PM",
    property: "Lakeside Cottage - Main House",
    status: "completed",
  },
  {
    id: "5",
    type: "message",
    title: "Guest Message",
    description: "Question about parking options near the property",
    timestamp: "Yesterday at 2:15 PM",
    property: "Urban Apartment - Unit 505",
    user: {
      name: "Robert Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
  },
  {
    id: "6",
    type: "booking",
    title: "Booking Cancelled",
    description: "Reservation for June 10-15 has been cancelled",
    timestamp: "2 days ago",
    property: "Beach House - Entire Property",
    status: "cancelled",
  },
];

export default RecentActivityList;
