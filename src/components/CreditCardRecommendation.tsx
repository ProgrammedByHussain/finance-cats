import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreditCardRecommendationProps {
  name: string;
  description: string;
  benefits: string[];
  annualFee: string;
  interestRate: string;
  imageUrl?: string;
  url?: string;
}

export function CreditCardRecommendation({
  name,
  description,
  benefits,
  annualFee,
  interestRate,
  imageUrl,
  url,
}: CreditCardRecommendationProps) {
  // Function to generate a search URL if no direct URL is provided
  const getCardUrl = () => {
    if (url) return url;
    // Create a search URL using the card name
    return `https://www.google.com/search?q=${encodeURIComponent(
      name + " credit card canada"
    )}`;
  };

  return (
    <Card className="mb-4 border-2 border-catty-cream hover:border-catty-orange transition-all duration-300 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-catty-brown">
            {name}
          </CardTitle>
          <div className="w-16 h-10 bg-catty-peach rounded-md flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <CreditCard size={16} className="text-catty-brown" />
                <span className="text-[8px] text-catty-brown mt-1">CANADA</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-catty-gray">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-catty-brown mb-2">
              Key Benefits:
            </h4>
            <ul className="space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check size={16} className="mr-2 text-catty-orange mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between text-sm pt-2 border-t border-catty-cream">
            <div>
              <span className="font-medium text-catty-brown">Annual Fee:</span>{" "}
              <span>{annualFee}</span>
            </div>
            <div>
              <span className="font-medium text-catty-brown">APR:</span>{" "}
              <span>{interestRate}</span>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-catty-orange border-catty-orange hover:bg-catty-peach hover:text-catty-brown"
              onClick={() => window.open(getCardUrl(), "_blank")}
            >
              Take Me There <ExternalLink className="ml-1" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
