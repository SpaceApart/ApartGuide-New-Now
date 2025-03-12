import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
}

const PricingTier = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText = "Rozpocznij",
}: PricingTierProps) => {
  return (
    <Card
      className={`flex flex-col h-full ${highlighted ? "border-blue-500 shadow-lg relative" : "border-gray-200"}`}
    >
      {highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Najpopularniejszy
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Indywidualna" && (
            <span className="text-gray-500 ml-2">/miesiąc</span>
          )}
        </div>
        <p className="text-gray-500 mt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${highlighted ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          variant={highlighted ? "default" : "outline"}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "199 zł",
      description: "Idealne dla właścicieli z 1-5 nieruchomościami",
      features: [
        "Do 5 nieruchomości",
        "Inteligentne instrukcje dostępu",
        "Podstawowe wizualne przewodniki",
        "Komunikacja z gośćmi",
        "Podstawowe raporty",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "399 zł",
      description: "Dla rozwijających się zarządców nieruchomości",
      features: [
        "Do 20 nieruchomości",
        "Wszystkie funkcje Starter",
        "Moduł dodatkowych usług",
        "Zarządzanie zespołem sprzątającym",
        "Zaawansowane raporty i analityka",
        "Integracja z platformami rezerwacyjnymi",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Indywidualna",
      description: "Dla dużych firm zarządzających nieruchomościami",
      features: [
        "Nieograniczona liczba nieruchomości",
        "Wszystkie funkcje Professional",
        "Dedykowany opiekun klienta",
        "API dla niestandardowych integracji",
        "Zaawansowana automatyzacja procesów",
        "Niestandardowe raporty i dashboardy",
      ],
      highlighted: false,
      buttonText: "Skontaktuj się",
    },
  ];

  return (
    <div className="py-20 px-6 md:px-10 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proste i przejrzyste cenniki
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wybierz plan, który najlepiej odpowiada Twoim potrzebom. Wszystkie
            plany zawierają 14-dniowy okres próbny.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlighted={tier.highlighted}
              buttonText={tier.buttonText}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>Wszystkie ceny są podane netto. Faktury wystawiamy z 23% VAT.</p>
          <p className="mt-2">
            Masz pytania dotyczące cennika?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Skontaktuj się z nami
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
