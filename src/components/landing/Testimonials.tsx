import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating?: number;
}

const Testimonial = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
}: TestimonialProps) => {
  return (
    <Card className="bg-white border-gray-100 h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="mb-4">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </span>
          ))}
        </div>
        <blockquote className="text-gray-700 italic mb-6 flex-grow">
          "{quote}"
        </blockquote>
        <div className="flex items-center mt-auto">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>
              {author.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-sm text-gray-500">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "ApartGuide zrewolucjonizował sposób, w jaki zarządzam moimi 15 apartamentami. Automatyzacja instrukcji dostępu zaoszczędziła mi niezliczone godziny pracy.",
      author: "Anna Kowalska",
      role: "Właściciel 15 apartamentów",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
      rating: 5,
    },
    {
      quote:
        "Moduł dodatkowych usług zwiększył moje przychody o 30%. Goście uwielbiają możliwość zamówienia pakietów powitalnych i usług transportowych.",
      author: "Piotr Nowak",
      role: "Zarządca nieruchomości",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=piotr",
      rating: 5,
    },
    {
      quote:
        "Optymalizacja harmonogramów sprzątania to game-changer. Mój zespół sprzątający może teraz obsłużyć więcej nieruchomości dzięki efektywnym trasom.",
      author: "Magdalena Wiśniewska",
      role: "Właściciel firmy zarządzającej",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=magdalena",
      rating: 4,
    },
  ];

  return (
    <div className="py-20 px-6 md:px-10 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Co mówią nasi klienci
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dołącz do setek zadowolonych właścicieli i zarządców nieruchomości,
            którzy usprawniają swoją działalność dzięki ApartGuide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
