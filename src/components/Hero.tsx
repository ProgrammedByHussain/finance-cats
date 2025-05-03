import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Import cat images
import barthOk from "@/images/barth_ok.png";
import pounceOk from "@/images/pounce_ok.png";
import clawdiaOk from "@/images/clawdia_ok.png";

export default function Hero() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const adviceCards = [
    {
      title: "Dr. Bartholomeow",
      content: [
        "Expert in financial planning",
        "Specializes in investment strategies",
        "Helps you build long-term wealth",
      ],
      image: barthOk,
      path: "/bartholomew",
    },
    {
      title: "Sir Pounce",
      content: [
        "Master of budget optimization",
        "Helps identify savings opportunities",
        "Creates personalized spending plans",
      ],
      image: pounceOk,
      path: "/pounce",
    },
    {
      title: "Dr. Clawdia",
      content: [
        "Debt management specialist",
        "Credit score improvement expert",
        "Financial wellness coach",
      ],
      image: clawdiaOk,
      path: "/clawdia",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-catty-peach/50 to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1
                className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-catty-brown ${
                  animate ? "hero-title" : "opacity-0"
                }`}
              >
                Meet Your Purr-sonal Finance Advisors
              </h1>
              <p
                className={`text-lg text-catty-gray md:text-xl ${
                  animate ? "hero-description" : "opacity-0"
                }`}
              >
                Our team of feline financial experts helps you track your
                spending, save money, and make smarter financial decisions.
              </p>
            </div>
            <div
              className={`flex flex-col gap-2 sm:flex-row ${
                animate ? "hero-buttons" : "opacity-0"
              }`}
            >
              <Button
                onClick={() => navigate(adviceCards[0].path)}
                className="bg-catty-orange hover:bg-catty-brown text-white px-8 py-6"
              >
                Get Started
              </Button>
            </div>
            <div
              className={`flex items-center gap-2 text-sm text-catty-gray ${
                animate ? "hero-stats" : "opacity-0"
              }`}
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-catty-orange flex items-center justify-center text-white text-xs">
                  🐱
                </div>
                <div className="w-8 h-8 rounded-full bg-catty-brown flex items-center justify-center text-white text-xs">
                  🐾
                </div>
                <div className="w-8 h-8 rounded-full bg-catty-peach flex items-center justify-center text-white text-xs">
                  💰
                </div>
              </div>
              <span>Trusted by thousands of financially savvy cat lovers</span>
            </div>
          </div>

          <div className="relative">
            <Carousel
              ref={emblaRef}
              opts={{
                loop: true,
                align: "center",
              }}
              className="w-full max-w-md mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {adviceCards.map((card, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 relative">
                    <div className="relative">
                      {index === 0 && (
                        <>
                          <div className="absolute -right-4 -top-3 w-full h-full bg-catty-cream rounded-lg transform rotate-3 z-0"></div>
                          <div className="absolute -right-2 -top-1 w-full h-full bg-catty-peach/50 rounded-lg transform rotate-1 z-0"></div>
                        </>
                      )}
                      <Card
                        className="relative bg-white rounded-lg p-6 shadow-lg z-10 transition-all duration-300 hover:shadow-xl cursor-pointer"
                        onClick={() => navigate(card.path)}
                      >
                        <CardContent className="p-0">
                          {/* Cat image */}
                          <div className="relative h-64 w-full mb-6">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <h3 className="text-xl font-bold text-catty-brown text-center">
                            {card.title}
                          </h3>
                          <ul className="mt-4 space-y-2">
                            {card.content.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-catty-peach flex items-center justify-center">
                                  <span className="text-catty-brown text-xs">
                                    ✓
                                  </span>
                                </div>
                                <span className="text-catty-gray">{item}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 text-center text-catty-orange text-sm flex items-center justify-center gap-2">
                            <span>Click to get started</span>
                            <ChevronRight
                              size={16}
                              className="text-catty-orange animate-pulse"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-white text-catty-orange border-catty-orange" />
              <CarouselNext className="right-0 bg-white text-catty-orange border-catty-orange" />

              <div className="flex justify-center mt-4 gap-1">
                {adviceCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-catty-peach transition-all duration-300"
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
