import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import CatAdvisor from "@/components/CatAdvisor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PouncePage() {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState<any>(null);
  const [advisorOpen, setAdvisorOpen] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [catAdvice, setCatAdvice] = useState<string | undefined>(
    "Meow! Upload your spending history CSV, and I'll help you optimize your budget!"
  );

  useEffect(() => {
    // Trigger animation after component mount
    setAnimate(true);
  }, []);

  const handleFileUploaded = (data: any) => {
    console.log('Received data from FileUpload:', data);
    setFinancialData(data);

    // Generate cat advice based on the data
    const tips = [
      `Meow! I notice you're spending $${data.expenses?.food || 0} on food. Purr-haps you could save by cooking more at home?`,
      `Your biggest expense is ${data.spendingInsights?.highestCategory || 'unknown'}. Maybe it's time to pounce on some savings there!`,
      `You're saving ${data.savingsRate || 0}% of your income. Let's try to improve that to 20%! That would be the cat's meow!`,
      `I see some unusual expenses in entertainment. Remember, the best things in life are free, like napping in sunbeams!`,
      `Your spending on shopping seems a bit high. Try to pause before purchasing - ask if you really need it, or if you're just chasing a shiny object!`,
    ];

    // Select a random tip
    setCatAdvice(tips[Math.floor(Math.random() * tips.length)]);
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
                Upload your spending history and I'll help you identify savings
                opportunities!
              </p>
            </div>
          </div>

          {!financialData ? (
            <div className={`max-w-md mx-auto ${animate ? "pounce-card" : "opacity-0"}`}>
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
    </div>
  );
}
