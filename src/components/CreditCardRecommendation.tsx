import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

interface CreditCardRecommendationProps {
  name: string;
  description: string;
  benefits: string[];
  annualFee: string;
  interestRate: string;
  imageUrl?: string;
}

export function CreditCardRecommendation({
  name,
  description,
  benefits,
  annualFee,
  interestRate,
  imageUrl,
}: CreditCardRecommendationProps) {
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
        </div>
      </CardContent>
    </Card>
  );
}
