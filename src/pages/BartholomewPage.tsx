import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { playMeowSound } from "@/utils/sound";
import CreditCardDashboard from "@/components/CreditCardDashboard";

export default function BartholomewPage() {
  const navigate = useNavigate();
  const [spendingCategories, setSpendingCategories] = useState({
    dining: false,
    travel: false,
    groceries: false,
    gas: false,
    online: false,
    entertainment: false,
  });

  const [cardGoal, setCardGoal] = useState("cashback");
  const [animate, setAnimate] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSpendingCategories((prev) => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  const handleSubmit = () => {
    playMeowSound();
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-catty-light-gray">
        <Navbar />
        <div className="container py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src="/src/images/barth_ok.png"
                  alt="Dr. Bartholameow"
                  className="w-24 h-24 object-contain mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold text-catty-brown">
                    Your Credit Card Recommendations
                  </h1>
                  <p className="text-catty-gray mt-2">
                    Based on your spending habits and goals
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
                className="bg-white border-catty-orange text-catty-brown hover:bg-catty-peach"
              >
                Edit Preferences
              </Button>
            </div>
            <CreditCardDashboard data={{ spendingCategories, cardGoal }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-catty-light-gray">
      <Navbar />

      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className={`flex items-center mb-8 ${
              animate ? "bartholomew-appear" : "opacity-0"
            }`}
          >
            <img
              src="/src/images/barth_ok.png"
              alt="Dr. Bartholameow"
              className="w-24 h-24 object-contain mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-catty-brown">
                Dr. Bartholameow's Credit Card Advisor
              </h1>
              <p className="text-catty-gray mt-2">
                Let me help you find the purrfect credit card based on your
                spending habits and goals.
              </p>
            </div>
          </div>

          <Card
            className={`mb-8 ${animate ? "bartholomew-card" : "opacity-0"}`}
          >
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                Where do you spend the most?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 stagger-appear">
              {Object.keys(spendingCategories).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={
                      spendingCategories[
                        category as keyof typeof spendingCategories
                      ]
                    }
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={category} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className={`mb-8 ${animate ? "bartholomew-card" : "opacity-0"}`}
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What are you looking for in a credit card?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={cardGoal}
                onValueChange={setCardGoal}
                className="stagger-appear"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="cashback" id="cashback" />
                  <Label htmlFor="cashback">Cash Back</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="points" id="points" />
                  <Label htmlFor="points">Travel Points</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="lowinterest" id="lowinterest" />
                  <Label htmlFor="lowinterest">Low Interest Rate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rewards" id="rewards" />
                  <Label htmlFor="rewards">Specialized Rewards</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div
            className={`flex justify-between ${
              animate ? "stagger-appear" : "opacity-0"
            }`}
          >
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white border-catty-orange text-catty-brown hover:bg-catty-peach"
            >
              Go Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-catty-orange hover:bg-catty-brown text-white"
            >
              Get Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}