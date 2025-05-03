import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import CatAdvisor from '@/components/CatAdvisor';
import Dashboard from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cat } from 'lucide-react';

const Index = () => {
  const [financialData, setFinancialData] = useState<any>(null);
  const [advisorOpen, setAdvisorOpen] = useState(true);
  const [catAdvice, setCatAdvice] = useState<string | undefined>(undefined);

  const handleFileUploaded = (data: any) => {
    setFinancialData(data);
    
    // Generate cat advice based on the data
    const tips = [
      `Meow! I notice you're spending $${data.expenses.food} on food. Purr-haps you could save by cooking more at home?`,
      `Your biggest expense is ${data.spendingInsights.highestCategory}. Maybe it's time to pounce on some savings there!`,
      `You're saving ${data.savingsRate}% of your income. Let's try to improve that to 20%! That would be the cat's meow!`,
      `I see some unusual expenses in entertainment. Remember, the best things in life are free, like napping in sunbeams!`,
      `Your spending on shopping seems a bit high. Try to pause before purchasing - ask if you really need it, or if you're just chasing a shiny object!`
    ];
    
    // Select a random tip
    setCatAdvice(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <div className="min-h-screen bg-catty-light-gray">
      <Navbar />
      <Hero />
      
      <div className="container py-12 px-4 md:px-6">
        <h2 className="text-2xl font-bold text-catty-brown mb-8 text-center">Your Financial Dashboard</h2>
        
        <Tabs defaultValue={financialData ? "dashboard" : "upload"} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-catty-peach/20">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-catty-orange data-[state=active]:text-white"
              >
                Upload Statement
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-catty-orange data-[state=active]:text-white"
                disabled={!financialData}
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="mt-0">
            <div className="max-w-md mx-auto">
              <FileUpload onFileUploaded={handleFileUploaded} />
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard data={financialData} />
          </TabsContent>
        </Tabs>
      </div>
      
      <CatAdvisor 
        isOpen={advisorOpen} 
        onClose={() => setAdvisorOpen(!advisorOpen)}
        advice={catAdvice}
      />
      
      <footer className="bg-white border-t border-catty-cream py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-catty-peach p-2 rounded-full">
                <Cat size={20} className="text-catty-brown" />
              </div>
              <span className="font-bold text-catty-brown">Kitty Cash Counselor</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <a href="#" className="text-catty-gray hover:text-catty-brown text-sm">Terms</a>
              <a href="#" className="text-catty-gray hover:text-catty-brown text-sm">Privacy</a>
              <a href="#" className="text-catty-gray hover:text-catty-brown text-sm">Support</a>
            </div>
            
            <div className="mt-4 md:mt-0 text-xs text-catty-gray">
              © {new Date().getFullYear()} Kitty Cash Counselor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
