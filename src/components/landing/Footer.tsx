import React from "react";
import { Home } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">ApartGuide</span>
            </div>
            <p className="mb-4">
              Kompleksowe rozwiązanie do zarządzania wynajmem krótkoterminowym,
              które usprawnia komunikację z gośćmi i zarządzanie operacyjne.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: "facebook", href: "#" },
                { icon: "twitter", href: "#" },
                { icon: "instagram", href: "#" },
                { icon: "linkedin", href: "#" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`${social.icon} link`}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="sr-only">{social.icon}</span>
                    <i className={`fab fa-${social.icon}`}></i>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Produkt</h3>
            <ul className="space-y-2">
              {[
                { name: "Funkcje", href: "#" },
                { name: "Cennik", href: "#" },
                { name: "Dla kogo", href: "#" },
                { name: "Przypadki użycia", href: "#" },
                { name: "Integracje", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Firma</h3>
            <ul className="space-y-2">
              {[
                { name: "O nas", href: "#" },
                { name: "Blog", href: "#" },
                { name: "Kariera", href: "#" },
                { name: "Kontakt", href: "#" },
                { name: "Partnerzy", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Wsparcie</h3>
            <ul className="space-y-2">
              {[
                { name: "Centrum pomocy", href: "#" },
                { name: "Dokumentacja", href: "#" },
                { name: "Status systemu", href: "#" },
                { name: "Polityka prywatności", href: "#" },
                { name: "Warunki korzystania", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} ApartGuide. Wszelkie prawa
            zastrzeżone.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {[
              { name: "Polityka prywatności", href: "#" },
              { name: "Warunki korzystania", href: "#" },
              { name: "Cookies", href: "#" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
