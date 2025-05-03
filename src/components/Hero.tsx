
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const adviceCards = [
    {
      title: "Let Whiskers help with your finances",
      content: [
        "Upload your bank statements",
        "Get personalized spending insights",
        "Receive paw-some savings tips"
      ]
    },
    {
      title: "Track your spending habits",
      content: [
        "Identify unnecessary expenses",
        "Visualize spending patterns",
        "Set monthly budget goals"
      ]
    },
    {
      title: "Plan for the future",
      content: [
        "Create savings targets",
        "Prepare for emergencies",
        "Build investment strategies"
      ]
    },
    {
      title: "Reduce your debt",
      content: [
        "Prioritize high-interest payments",
        "Create a debt snowball plan",
        "Find refinancing opportunities"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-catty-peach/50 to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-catty-brown">
                Meet Your Purr-sonal Finance Advisor
              </h1>
              <p className="text-lg text-catty-gray md:text-xl">
                Whiskers helps you track your spending, save money, and make smarter financial decisions with feline finesse.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="bg-catty-orange hover:bg-catty-brown text-white px-8 py-6">
                Get Started
              </Button>
              <Button variant="outline" className="border-catty-orange text-catty-brown hover:bg-catty-peach px-8 py-6">
                Learn More
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-catty-gray">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-catty-orange flex items-center justify-center text-white text-xs">🐱</div>
                <div className="w-8 h-8 rounded-full bg-catty-brown flex items-center justify-center text-white text-xs">🐾</div>
                <div className="w-8 h-8 rounded-full bg-catty-peach flex items-center justify-center text-white text-xs">💰</div>
              </div>
              <span>Trusted by thousands of financially savvy cat lovers</span>
            </div>
          </div>

          <div className="relative">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {adviceCards.map((card, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 relative">
                    <div className="relative">
                      {/* Hint cards in the background */}
                      {index === 0 && (
                        <>
                          <div className="absolute -right-4 -top-3 w-full h-full bg-catty-cream rounded-lg transform rotate-3 z-0"></div>
                          <div className="absolute -right-2 -top-1 w-full h-full bg-catty-peach/50 rounded-lg transform rotate-1 z-0"></div>
                        </>
                      )}
                      <Card className="relative bg-white rounded-lg p-6 shadow-lg z-10 transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-0">
                          {/* Cat illustration */}
                          <div className="relative h-64 w-full mb-6">
                            {/* Main cat body - stylized using CSS */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-32 bg-catty-orange rounded-[50%] overflow-hidden"></div>
                            
                            {/* Cat head */}
                            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-catty-orange rounded-full">
                              {/* Ears */}
                              <div className="absolute -top-6 -left-2 w-10 h-10 bg-catty-orange rounded-md transform rotate-45"></div>
                              <div className="absolute -top-6 -right-2 w-10 h-10 bg-catty-orange rounded-md transform rotate-45"></div>
                              
                              {/* Inner ears */}
                              <div className="absolute -top-4 left-2 w-6 h-6 bg-catty-peach rounded-md transform rotate-45"></div>
                              <div className="absolute -top-4 right-2 w-6 h-6 bg-catty-peach rounded-md transform rotate-45"></div>
                              
                              {/* Eyes */}
                              <div className="absolute top-8 left-6 w-6 h-6 bg-white rounded-full">
                                <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-black rounded-full"></div>
                              </div>
                              <div className="absolute top-8 right-6 w-6 h-6 bg-white rounded-full">
                                <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-black rounded-full"></div>
                              </div>
                              
                              {/* Nose */}
                              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-catty-brown rounded-md"></div>
                              
                              {/* Mouth */}
                              <div className="absolute top-18 left-1/2 transform -translate-x-1/2">
                                <div className="w-1 h-4 bg-catty-brown mx-auto"></div>
                                <div className="w-8 h-4 border-b-2 border-catty-brown rounded-b-full"></div>
                              </div>
                              
                              {/* Whiskers */}
                              <div className="absolute top-16 left-0 w-12 h-1 bg-white rounded-full"></div>
                              <div className="absolute top-18 left-0 w-10 h-1 bg-white rounded-full"></div>
                              <div className="absolute top-16 right-0 w-12 h-1 bg-white rounded-full"></div>
                              <div className="absolute top-18 right-0 w-10 h-1 bg-white rounded-full"></div>
                            </div>
                            
                            {/* Paws */}
                            <div className="absolute bottom-0 left-1/4 w-8 h-4 bg-catty-cream rounded-full"></div>
                            <div className="absolute bottom-0 right-1/4 w-8 h-4 bg-catty-cream rounded-full"></div>
                            
                            {/* Tail */}
                            <div className="absolute bottom-10 -right-4 w-16 h-4 bg-catty-orange rounded-full origin-left animate-tail-wag"></div>
                            
                            {/* Dollar sign */}
                            <div className="absolute top-0 right-1/4 w-12 h-12 bg-catty-cream rounded-full flex items-center justify-center shadow-lg animate-float">
                              <span className="text-catty-orange text-2xl font-bold">$</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-catty-brown text-center">{card.title}</h3>
                          <ul className="mt-4 space-y-2">
                            {card.content.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-catty-peach flex items-center justify-center">
                                  <span className="text-catty-brown text-xs">✓</span>
                                </div>
                                <span className="text-catty-gray">{item}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 text-center text-catty-gray text-sm flex items-center justify-center gap-2">
                            <span>Swipe for more tips</span>
                            <ChevronRight size={16} className="text-catty-orange animate-pulse" />
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
