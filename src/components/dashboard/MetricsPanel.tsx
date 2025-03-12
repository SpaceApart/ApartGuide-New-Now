import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Calendar, ShoppingBag } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <Building className="h-5 w-5" />,
  trend = { value: "0%", positive: true },
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted/20 p-1.5 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center text-xs">
          <span
            className={`mr-1 ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsPanelProps {
  metrics?: {
    properties: {
      total: string;
      trend: string;
      positive: boolean;
    };
    guides: {
      total: string;
      trend: string;
      positive: boolean;
    };
    cleanings: {
      total: string;
      trend: string;
      positive: boolean;
    };
    services: {
      total: string;
      trend: string;
      positive: boolean;
    };
  };
}

const MetricsPanel = ({
  metrics = {
    properties: {
      total: "24",
      trend: "12%",
      positive: true,
    },
    guides: {
      total: "18",
      trend: "8%",
      positive: true,
    },
    cleanings: {
      total: "7",
      trend: "5%",
      positive: false,
    },
    services: {
      total: "32",
      trend: "24%",
      positive: true,
    },
  },
}: MetricsPanelProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Properties"
          value={metrics.properties.total}
          icon={<Building className="h-5 w-5" />}
          trend={{
            value: metrics.properties.trend,
            positive: metrics.properties.positive,
          }}
        />
        <MetricCard
          title="Active Guest Guides"
          value={metrics.guides.total}
          icon={<Users className="h-5 w-5" />}
          trend={{
            value: metrics.guides.trend,
            positive: metrics.guides.positive,
          }}
        />
        <MetricCard
          title="Upcoming Cleanings"
          value={metrics.cleanings.total}
          icon={<Calendar className="h-5 w-5" />}
          trend={{
            value: metrics.cleanings.trend,
            positive: metrics.cleanings.positive,
          }}
        />
        <MetricCard
          title="Service Orders"
          value={metrics.services.total}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{
            value: metrics.services.trend,
            positive: metrics.services.positive,
          }}
        />
      </div>
    </div>
  );
};

export default MetricsPanel;
