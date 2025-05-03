import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Cat } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-catty-light-gray">
      <Navbar />
      <Hero />

      <footer className="bg-white border-t border-catty-cream py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-catty-peach p-2 rounded-full">
                <Cat size={20} className="text-catty-brown" />
              </div>
              <span className="font-bold text-catty-brown">FinanceCats</span>
            </div>

            <div className="mt-4 md:mt-0 text-xs text-catty-gray">
              © {new Date().getFullYear()} FinanceCats. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
