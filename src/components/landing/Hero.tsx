import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Key, Package } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                <span className="text-blue-600">ApartGuide</span>
                <br />
                Zarządzaj wynajmem krótkoterminowym
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Kompleksowe rozwiązanie dla właścicieli i zarządców
                nieruchomości, które usprawnia komunikację z gośćmi i
                zarządzanie operacyjne wynajmu krótkoterminowego.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-md px-8" asChild>
                <a href="/auth/register">
                  Rozpocznij za darmo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-md px-8">
                Umów prezentację
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
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
                <span>14-dniowy okres próbny</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
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
                <span>Bez karty kredytowej</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-4 bg-blue-600 text-white flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <span className="font-medium">ApartGuide Dashboard</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                alt="Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-100 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <Key className="h-5 w-5" />
                <span className="font-medium">Inteligentne kody dostępu</span>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 bg-green-100 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <Package className="h-5 w-5" />
                <span className="font-medium">Dodatkowe usługi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
