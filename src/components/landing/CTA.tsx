import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="py-20 px-6 md:px-10 lg:px-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gotowy, aby usprawnić zarządzanie swoimi nieruchomościami?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Dołącz do setek właścicieli i zarządców nieruchomości, którzy już
              korzystają z ApartGuide. Rozpocznij 14-dniowy okres próbny bez
              zobowiązań.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-md px-8"
                asChild
              >
                <a href="/auth/register">
                  Rozpocznij za darmo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700 text-md px-8"
              >
                Umów prezentację
              </Button>
            </div>
          </div>
          <div className="bg-blue-500 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-4">
              Co otrzymujesz w okresie próbnym?
            </h3>
            <ul className="space-y-4">
              {[
                "Pełny dostęp do wszystkich funkcji platformy",
                "Możliwość dodania do 5 nieruchomości",
                "Nieograniczona liczba instrukcji dostępu dla gości",
                "Dostęp do modułu dodatkowych usług",
                "Wsparcie techniczne przez email i czat",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-6 w-6 text-blue-200 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-blue-100 text-sm">
              Nie wymagamy karty kredytowej. Po zakończeniu okresu próbnego
              możesz wybrać plan lub zrezygnować bez żadnych opłat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
