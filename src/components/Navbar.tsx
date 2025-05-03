import React from "react";
import { Link } from "react-router-dom";
import { Cat } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-catty-cream bg-white">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-catty-peach p-2 rounded-full">
            <Cat size={24} className="text-catty-brown" />
          </div>
          <h1 className="font-bold text-xl text-catty-brown">FinanceCats</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-catty-gray hover:text-catty-brown text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/bartholomew"
            className="text-catty-gray hover:text-catty-brown text-sm font-medium"
          >
            Investment
          </Link>
          <Link
            to="/pounce"
            className="text-catty-gray hover:text-catty-brown text-sm font-medium"
          >
            Budgeting
          </Link>
          <Link
            to="/clawdia"
            className="text-catty-gray hover:text-catty-brown text-sm font-medium"
          >
            Planning
          </Link>
        </nav>
      </div>
    </header>
  );
}
