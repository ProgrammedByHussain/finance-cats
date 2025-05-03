import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { playMeowSound } from "@/utils/sound";
import InvestmentDashboard from "@/components/InvestmentDashboard";
import { getInvestmentRecommendations } from "@/services/geminiService";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CatCredentialsPlaque } from "@/components/CatCredentialsPlaque";

export default function ClawdiaPage() {
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [riskTolerance, setRiskTolerance] = useState([5]); // Middle of scale 0-10
  const [investmentGoal, setInvestmentGoal] = useState("retirement");
  const [timeHorizon, setTimeHorizon] = useState("long");
  const [animate, setAnimate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const handleSubmit = async () => {
    playMeowSound();
    setIsLoading(true);
    setError(null);

    try {
      // Call the Gemini API service to get recommendations
      const investmentPlan = await getInvestmentRecommendations(
        investmentAmount,
        riskTolerance,
        investmentGoal,
        timeHorizon
      );

      setApiData(investmentPlan);
      setShowResults(true);
    } catch (error) {
      console.error("Error getting investment recommendations:", error);
      setError(
        "Meow! Dr. Clawdia had trouble analyzing your preferences. Please check if the Gemini API key is configured correctly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-catty-light-gray">
        <Navbar />
        <div className="container py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div>
                  {showCredentials && (
                    <CatCredentialsPlaque
                      name="Dr. Clawdia"
                      degree="Ph.D., Credit Score Analytics & Portfolio Optimization"
                      school="Stanford University"
                      schoolLogo="/src/images/stanford_logo.png"
                    />
                  )}
                  <p className="text-catty-gray mt-2">
                    Based on your investment preferences and goals
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

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <InvestmentDashboard
              data={{
                investmentAmount,
                riskTolerance,
                investmentGoal,
                timeHorizon,
                apiData, // Pass the API data to the dashboard
              }}
            />
          </div>
        </div>

        <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom">
          <img
            src="/src/images/clawdia_ok.png"
            alt="Dr. Clawdia"
            className="w-64 h-64 object-contain transform scale-150"
            onLoad={() => setShowCredentials(true)}
          />
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
              animate ? "clawdia-appear" : "opacity-0"
            }`}
          >
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

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className={`mb-6 ${animate ? "clawdia-card" : "opacity-0"}`}>
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                How much would you like to invest?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 stagger-appear">
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

          <Card
            className={`mb-6 ${animate ? "clawdia-card" : "opacity-0"}`}
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your risk tolerance?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 stagger-appear">
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

          <Card
            className={`mb-6 ${animate ? "clawdia-card" : "opacity-0"}`}
            style={{ animationDelay: "0.7s" }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your primary investment goal?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={investmentGoal}
                onValueChange={setInvestmentGoal}
                className="stagger-appear"
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

          <Card
            className={`mb-8 ${animate ? "clawdia-card" : "opacity-0"}`}
            style={{ animationDelay: "0.9s" }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-catty-brown">
                What is your investment time horizon?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                className="stagger-appear"
              >
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Investment Plan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
