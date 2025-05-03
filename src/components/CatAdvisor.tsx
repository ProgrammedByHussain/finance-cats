
import React, { useState, useEffect } from 'react';
import { Cat, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CatAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  advice?: string;
}

export function CatAdvisor({ isOpen, onClose, advice }: CatAdvisorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState(advice || "Meow! Upload your bank statement and I'll analyze your spending habits!");
  
  useEffect(() => {
    if (advice) {
      setCurrentAdvice(advice);
    }
  }, [advice]);
  
  useEffect(() => {
    // Random animations
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, Math.random() * (15000 - 8000) + 8000); // Random interval between 8-15 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <Button 
        onClick={onClose}
        className="fixed bottom-4 right-4 rounded-full h-16 w-16 bg-catty-peach hover:bg-catty-orange text-catty-brown shadow-lg"
        aria-label="Chat with your cat financial advisor"
      >
        <Cat size={32} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-[350px] z-10 animate-in fade-in">
      <Card className="p-4 bg-catty-peach border-catty-brown border-2 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 bg-catty-orange">
              <Cat size={24} className="text-white" />
            </Avatar>
            <div>
              <h3 className="font-bold text-catty-brown">Whiskers</h3>
              <p className="text-xs text-catty-gray">Financial Purr-fessional</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-catty-gray hover:text-catty-brown">
            <X size={18} />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <div className="flex mb-6">
            {/* Cat advisor character */}
            <div className="relative w-20 h-24">
              {/* Cat body */}
              <div className="absolute bottom-0 w-16 h-12 bg-catty-orange rounded-full"></div>
              
              {/* Cat head */}
              <div className="absolute bottom-8 w-14 h-14 bg-catty-orange rounded-full">
                {/* Eyes */}
                <div className="absolute top-4 left-2 w-2 h-2 bg-white rounded-full">
                  <div className={cn("absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full", isAnimating && "animate-blink")}></div>
                </div>
                <div className="absolute top-4 right-2 w-2 h-2 bg-white rounded-full">
                  <div className={cn("absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full", isAnimating && "animate-blink")}></div>
                </div>
                
                {/* Ears */}
                <div className="absolute -top-3 -left-1 w-4 h-4 bg-catty-orange rounded-md transform rotate-45"></div>
                <div className="absolute -top-3 -right-1 w-4 h-4 bg-catty-orange rounded-md transform rotate-45"></div>
                
                {/* Nose */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-catty-brown rounded-md"></div>
                
                {/* Whiskers */}
                <div className="absolute top-7 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-0.5 bg-white rounded-full mb-0.5"></div>
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Tail */}
              <div 
                className={cn("absolute bottom-2 -left-2 w-6 h-1.5 bg-catty-orange rounded-full", 
                  isAnimating ? "animate-tail-wag" : "")}
                style={{ transformOrigin: "0% 50%" }}
              ></div>
              
              {/* Paws */}
              <div className="absolute bottom-0 left-2 w-3 h-1.5 bg-catty-cream rounded-full"></div>
              <div className="absolute bottom-0 right-2 w-3 h-1.5 bg-catty-cream rounded-full"></div>
            </div>
            
            {/* Dollar sign icon */}
            <div className="relative h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md animate-float">
              <DollarSign size={24} className="text-catty-orange" />
            </div>
          </div>
          
          {/* Speech bubble */}
          <div className="bg-white p-3 rounded-lg shadow-md relative ml-5">
            <div className="absolute -left-2 top-2 w-4 h-4 bg-white transform rotate-45"></div>
            <p className="text-sm text-catty-brown">{currentAdvice}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CatAdvisor;
