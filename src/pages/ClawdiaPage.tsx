import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

export default function ClawdiaPage() {
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [riskTolerance, setRiskTolerance] = useState([5]); // Middle of scale 0-10
  const [investmentGoal, setInvestmentGoal] = useState("retirement");
  const [timeHorizon, setTimeHorizon] = useState("long");

  const handleSubmit = () => {
    // Process the investment data
    console.log("Investment amount:", investmentAmount);
    console.log("Risk tolerance:", riskTolerance[0]);
    console.log("Investment goal:", investmentGoal);
    console.log("Time horizon:", timeHorizon);

    // Show results
    let recommendation = "";

    if (riskTolerance[0] <= 3) {
      recommendation =
        "a conservative portfolio with mostly bonds and some dividend stocks";
    } else if (riskTolerance[0] <= 7) {
      recommendation = "a balanced portfolio with a mix of stocks and bonds";
    } else {
      recommendation =
        "an aggressive growth portfolio with mostly stocks and some alternative investments";
    }

    alert(
      "Dr. Clawdia says: Based on your $" +
        investmentAmount +
        " investment amount, " +
        riskTolerance[0] +
        "/10 risk tolerance, " +
        investmentGoal +
        " goal, and " +
        timeHorizon +
        " time horizon, I recommend " +
        recommendation +
        "!"
    );
  };

  return (
    <div className="min-h-screen bg-catty-light-gray">
      <Navbar />

      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <img
              src="/src/images/clawdia_ok.png"
              alt="Dr. Clawdia"
              className="w-24 h-24 object-contain mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-catty-brown">
                Dr. Clawdia's Investment Planner
              </h1>
              <p className="text-catty-gray mt-2">
                Let me help you create a purrfect investment strategy based on
                your goals and risk tolerance.
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                How much would you like to invest?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="investmentAmount">
                    Investment Amount ($):
                  </Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(Number(e.target.value))
                    }
                    className="max-w-[180px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your risk tolerance?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-sm text-catty-gray">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
                <div className="text-center font-medium text-catty-brown">
                  Current: {riskTolerance[0]}/10
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your primary investment goal?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={investmentGoal}
                onValueChange={setInvestmentGoal}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="retirement" id="retirement" />
                  <Label htmlFor="retirement">Retirement</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="education" id="education" />
                  <Label htmlFor="education">Education Fund</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="house" id="house" />
                  <Label htmlFor="house">Home Purchase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wealth" id="wealth" />
                  <Label htmlFor="wealth">Wealth Building</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your investment time horizon?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={timeHorizon} onValueChange={setTimeHorizon}>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short Term (1-3 years)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium Term (3-7 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long Term (7+ years)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
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
              Get Investment Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
