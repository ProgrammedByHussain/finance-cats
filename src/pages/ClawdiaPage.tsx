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
import { Loader2, AlertCircle, Volume2, VolumeX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { playCatSpeech, stopAllSpeech } from "@/services/elevenlabsService";

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
  const [isSpeechMuted, setIsSpeechMuted] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);

    // Clean up speech when component unmounts
    return () => {
      stopAllSpeech();
    };
  }, []);

  // Play speech when results are shown
  useEffect(() => {
    if (showResults && !isSpeechMuted && apiData) {
      // Generate a custom message based on investment data
      let speechText = `Greetings, I'm Doctor Clawdia. `;

      speechText += `I've created an investment portfolio tailored to your financial goals and risk tolerance. `;

      if (apiData.portfolioAllocation) {
        // Get the highest allocation asset
        const highestAllocation = [...apiData.portfolioAllocation].sort(
          (a, b) => b.value - a.value
        )[0];

        speechText += `Based on your ${investmentGoal} goal and ${riskTolerance[0]}/10 risk tolerance, `;
        speechText += `I've allocated ${highestAllocation.value}% of your portfolio to ${highestAllocation.name}. `;

        if (apiData.annualReturn) {
          speechText += `This strategy has a projected annual return of ${apiData.annualReturn}%, `;
          speechText += `which would grow your $${investmentAmount} investment to $${Math.round(
            apiData.totalReturn
          )} over ${apiData.years} years. `;
        }

        speechText += `Let's review my investment recommendations!`;
      }

      playCatSpeech("clawdia", speechText);
    }
  }, [
    showResults,
    isSpeechMuted,
    apiData,
    investmentAmount,
    investmentGoal,
    riskTolerance,
  ]);

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

  const toggleSpeech = () => {
    if (isSpeechMuted) {
      setIsSpeechMuted(false);
      if (showResults && apiData) {
        playCatSpeech("clawdia");
      }
    } else {
      setIsSpeechMuted(true);
      stopAllSpeech();
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
                <img
                  src="/src/images/clawdia_ok.png"
                  alt="Dr. Clawdia"
                  className="w-24 h-24 object-contain mr-4"
                />
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-catty-brown mr-3">
                      Your Investment Plan
                    </h1>
                    <Button variant="ghost" size="icon" onClick={toggleSpeech}>
                      {isSpeechMuted ? (
                        <VolumeX className="h-5 w-5 text-catty-gray" />
                      ) : (
                        <Volume2 className="h-5 w-5 text-catty-orange" />
                      )}
                    </Button>
                  </div>
                  <p className="text-catty-gray mt-2">
                    Based on your investment preferences and goals
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowResults(false);
                  stopAllSpeech();
                }}
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
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-catty-brown">
                  Dr. Clawdia's Investment Planner
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSpeech}
                  className="ml-2"
                >
                  {isSpeechMuted ? (
                    <VolumeX className="h-5 w-5 text-catty-gray" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-catty-orange" />
                  )}
                </Button>
              </div>
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
