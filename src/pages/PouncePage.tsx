import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import CatAdvisor from "@/components/CatAdvisor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PouncePage() {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState<any>(null);
  const [advisorOpen, setAdvisorOpen] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [catAdvice, setCatAdvice] = useState<string | undefined>(
    "Meow! Upload your spending history CSV, and I'll help you optimize your budget!"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const handleFileUploaded = (data: any) => {
    console.log("Received data from FileUpload:", data);

    if (!data) {
      setError(
        "Unable to analyze the CSV data. Please try another file format."
      );
      return;
    }

    setFinancialData(data);

    // Generate cat advice based on the data
    try {
      const generateCatAdvice = () => {
        // Check which category has the highest expense
        const highestCategory =
          data.spendingInsights?.highestCategory || "unknown";

        // Get a random tip from the savings tips
        const savingsTips = data.spendingInsights?.savingsTips || [];
        const randomTip =
          savingsTips.length > 0
            ? savingsTips[Math.floor(Math.random() * savingsTips.length)]
            : "Meow! Try to set aside a little more each month for savings!";

        // Format the advice with some cat puns
        return `Meow! I notice your highest spending is in ${highestCategory}. Purr-haps you could consider this tip: ${randomTip}`;
      };

      setCatAdvice(generateCatAdvice());
    } catch (error) {
      console.error("Error generating cat advice:", error);
      setCatAdvice(
        "Meow! I've analyzed your spending, but I'm having trouble coming up with specific advice. Let's work on your budget together!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-catty-light-gray">
      <Navbar />

      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className={`flex items-center mb-8 ${
              animate ? "pounce-appear" : "opacity-0"
            }`}
          >
            <img
              src="/src/images/pounce_ok.png"
              alt="Sir Pounce"
              className="w-24 h-24 object-contain mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-catty-brown">
                Sir Pounce's Budget Analyzer
              </h1>
              <p className="text-catty-gray mt-2">
                Upload your bank statement CSV and I'll help you identify
                savings opportunities with AI!
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!financialData ? (
            <div
              className={`max-w-md mx-auto ${
                animate ? "pounce-card" : "opacity-0"
              }`}
            >
              <FileUpload onFileUploaded={handleFileUploaded} accept=".csv" />

              <div
                className={`mt-6 text-center ${
                  animate ? "stagger-appear" : "opacity-0"
                }`}
              >
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="bg-white border-catty-orange text-catty-brown hover:bg-catty-peach"
                >
                  Go Back Home
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={`${animate ? "pounce-card" : "opacity-0"}`}>
                <Dashboard data={financialData} />
              </div>

              <div
                className={`mt-6 flex justify-center ${
                  animate ? "stagger-appear" : "opacity-0"
                }`}
              >
                <Button
                  onClick={() => setFinancialData(null)}
                  variant="outline"
                  className="bg-white border-catty-orange text-catty-brown hover:bg-catty-peach mr-4"
                >
                  Upload Another CSV
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="bg-white border-catty-orange text-catty-brown hover:bg-catty-peach"
                >
                  Go Back Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <CatAdvisor
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(!advisorOpen)}
        advice={catAdvice}
      />

      {financialData && (
        <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom">
          <img
            src="/src/images/pounce_ok.png"
            alt="Sir Pounce"
            className="w-64 h-64 object-contain transform scale-150"
          />
        </div>
      )}
    </div>
  );
}
