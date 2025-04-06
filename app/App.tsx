'use client';

import { Navbar, Footer } from "../src/components";
import React from 'react';


interface AppProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  currentTheme: 'dark' | 'light';
}

const App: React.FC<AppProps> = ({ children, toggleTheme, currentTheme }) => { 
  return (
    <div className="min-h-screen flex flex-col">
      <div className="gradient-bg-welcome">
        <Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default App;

