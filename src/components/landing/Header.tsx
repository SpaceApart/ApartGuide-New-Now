import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 px-6 md:px-10 lg:px-16 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">ApartGuide</h1>
        </div>

        <nav className="hidden md:flex ml-10 space-x-8">
          {[
            { name: "Funkcje", href: "#features" },
            { name: "Cennik", href: "#pricing" },
            { name: "Opinie", href: "#testimonials" },
            { name: "Blog", href: "#" },
            { name: "Kontakt", href: "#" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="hidden md:inline-flex" asChild>
          <a href="/auth/login">Zaloguj się</a>
        </Button>
        <Button asChild>
          <a href="/auth/register">Rozpocznij za darmo</a>
        </Button>

        <button className="md:hidden p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
