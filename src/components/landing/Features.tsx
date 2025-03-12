import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Key,
  MessageSquare,
  Package,
  Calendar,
  Users,
  Building,
  Clock,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="bg-white border-gray-100 hover:shadow-md transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Key className="h-6 w-6 text-blue-600" />,
      title: "Inteligentne instrukcje dostępu",
      description:
        "Twórz dynamiczne, czasowo ograniczone linki z kodami dostępu, danymi WiFi i wskazówkami nawigacyjnymi.",
    },
    {
      icon: <Building className="h-6 w-6 text-blue-600" />,
      title: "Zarządzanie wieloma jednostkami",
      description:
        "System szablonów dla nieruchomości z wieloma jednostkami, umożliwiający masowe tworzenie z indywidualnymi kodami dostępu.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      title: "Wizualne instrukcje",
      description:
        "Przesyłaj i organizuj zdjęcia nieruchomości, aby tworzyć wizualne przewodniki dla gości.",
    },
    {
      icon: <Package className="h-6 w-6 text-blue-600" />,
      title: "Moduł dodatkowych usług",
      description:
        "Oferuj dodatkowe usługi, takie jak parking, pakiety powitalne lub udogodnienia z treścią warunkową.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Optymalizacja zespołu sprzątającego",
      description:
        "Generuj efektywne harmonogramy sprzątania w oparciu o bliskość lokalizacji, aby zminimalizować czas podróży.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Automatyzacja procesów",
      description:
        "Automatyzuj powtarzalne zadania, takie jak wysyłanie instrukcji, przypomnienia i ankiety po pobycie.",
    },
  ];

  return (
    <div className="py-20 px-6 md:px-10 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wszystko, czego potrzebujesz do zarządzania wynajmem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ApartGuide oferuje kompleksowe narzędzia do zarządzania
            nieruchomościami, komunikacji z gośćmi i optymalizacji operacji.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
