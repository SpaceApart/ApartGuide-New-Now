import React, { ReactNode } from "react";
import { Home } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <Home className="h-8 w-8" />
            <span className="text-2xl font-bold">ApartGuide</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Zarządzaj wynajmem krótkoterminowym w jednym miejscu
            </h1>
            <p className="text-blue-100 text-lg">
              Kompleksowe rozwiązanie dla właścicieli i zarządców nieruchomości,
              które usprawnia komunikację z gośćmi i zarządzanie operacyjne.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Zadowolonych klientów</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Zarządzanych nieruchomości</div>
            </div>
          </div>

          <div className="text-sm text-blue-200">
            &copy; {new Date().getFullYear()} ApartGuide. Wszelkie prawa
            zastrzeżone.
          </div>
        </div>
      </div>

      {/* Right side - auth form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
