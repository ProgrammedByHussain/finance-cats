
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cat } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-catty-cream bg-white">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-catty-peach p-2 rounded-full">
            <Cat size={24} className="text-catty-brown" />
          </div>
          <h1 className="font-bold text-xl text-catty-brown">Kitty Cash Counselor</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-catty-gray hover:text-catty-brown text-sm font-medium">Home</a>
          <a href="#" className="text-catty-gray hover:text-catty-brown text-sm font-medium">About</a>
          <a href="#" className="text-catty-gray hover:text-catty-brown text-sm font-medium">How It Works</a>
          <a href="#" className="text-catty-gray hover:text-catty-brown text-sm font-medium">Privacy</a>
        </nav>
        
        <Button className="bg-catty-orange hover:bg-catty-brown text-white">
          Sign In
        </Button>
      </div>
    </header>
  );
}
