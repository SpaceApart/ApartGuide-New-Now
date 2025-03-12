import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle, MessageSquare, Package, Calendar } from "lucide-react";

interface QuickActionCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onClick?: () => void;
  variant?: "property" | "guide" | "service" | "cleaning";
}

const QuickActionCard = ({
  title = "Add New Property",
  description = "Create a new property listing with all details",
  icon,
  actionText = "Get Started",
  onClick = () => console.log("Card action clicked"),
  variant = "property",
}: QuickActionCardProps) => {
  // Determine icon and color scheme based on variant
  const getCardDetails = () => {
    switch (variant) {
      case "property":
        return {
          icon: icon || <PlusCircle className="h-10 w-10 text-blue-500" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonVariant: "default" as const,
        };
      case "guide":
        return {
          icon: icon || <MessageSquare className="h-10 w-10 text-green-500" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          buttonVariant: "secondary" as const,
        };
      case "service":
        return {
          icon: icon || <Package className="h-10 w-10 text-purple-500" />,
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          buttonVariant: "outline" as const,
        };
      case "cleaning":
        return {
          icon: icon || <Calendar className="h-10 w-10 text-amber-500" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          buttonVariant: "secondary" as const,
        };
      default:
        return {
          icon: icon || <PlusCircle className="h-10 w-10 text-blue-500" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonVariant: "default" as const,
        };
    }
  };

  const {
    icon: cardIcon,
    bgColor,
    borderColor,
    buttonVariant,
  } = getCardDetails();

  return (
    <Card
      className={`w-full max-w-[380px] h-[220px] ${bgColor} ${borderColor} hover:shadow-md transition-shadow duration-300`}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          {cardIcon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {variant === "property" &&
            "Add details, photos, and access instructions for your rental property."}
          {variant === "guide" &&
            "Create time-sensitive guides with access codes and instructions for guests."}
          {variant === "service" &&
            "Set up additional services to offer your guests during their stay."}
          {variant === "cleaning" &&
            "Schedule and manage cleaning services between guest stays."}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} onClick={onClick} className="w-full">
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickActionCard;
