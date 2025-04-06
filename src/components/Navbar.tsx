"use client";
import React, { useState, useEffect } from "react";
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from "../../firebase/client";
import { signOut, onAuthStateChanged, User } from "firebase/auth"; // Added User type import

interface NavBarItemProps {
  title: string;
  href: string;
  classprops?: string;
}

interface NavbarProps {
  toggleTheme: () => void;
  currentTheme: string;
}

const NavBarItem: React.FC<NavBarItemProps> = ({ title, href, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>
    <Link href={href} className="hover:text-[#2546bd] transition-colors">
      {title}
    </Link>
  </li>
);

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, currentTheme }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Added user state declaration

  const menuItems = [
    { title: "Liquidity", href: "/liquidity" },
    { title: "Buy/Sell", href: "/onramper" },
    { title: "Swap", href: "/" },
    { title: "Services", href: "/services" },
    { title: "Goul", href: "/pancake" },
    { title: "Ai", href: "/goulai" }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear any additional storage if needed
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to open MetaMask
  const openMetaMask = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => {
          console.log("MetaMask is connected");
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.error("Error connecting to MetaMask:", error.message);
          } else {
            console.error("Unknown error connecting to MetaMask");
          }
        });
    } else {
      alert("Please install MetaMask.");
    }
  };

  return (
    <nav className="w-full flex md:justify-between justify-between items-center p-4 bg-transparent">
      {/* Logo Section - Left Aligned */}
      <div className="logo-container flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/assets/gouldex-logo.png" 
            alt="Gould Dex" 
            width={50} 
            height={24} 
            className="logo"
            priority
          />
          <span className="logo-title ml-2 text-white text-xl font-semibold">Goul Exchange</span>
        </Link>
      </div>

      {/* Desktop Menu - Centered */}
      <ul className="text-white md:flex hidden list-none flex-row justify-center items-center flex-1">
        {menuItems.map((item, index) => (
          <NavBarItem key={`${item.href}-${index}`} title={item.title} href={item.href} />
        ))}
       <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] text-white">
          {user ? (
            <button onClick={handleLogout} className="block w-full h-full">
              Logout
            </button>
          ) : (
            <Link href="/login" className="block w-full h-full">
              Login
            </Link>
          )}
        </li>
      </ul>

      {/* Mobile Menu Toggle - Right Aligned */}
      <div className="md:hidden flex items-center">
        {!toggleMenu ? (
          <HiMenuAlt4 
            fontSize={28} 
            className="text-white cursor-pointer" 
            onClick={() => setToggleMenu(true)} 
          />
        ) : (
          <AiOutlineClose 
            fontSize={28} 
            className="text-white cursor-pointer" 
            onClick={() => setToggleMenu(false)} 
          />
        )}

        {/* Mobile Menu */}
        {toggleMenu && (
          <ul
            className="z-10 fixed top-14 right-0 p-3 w-[70vw] h-screen shadow-2xl
            flex flex-col justify-start items-end bg-gradient-to-b from-gray-900 to-gray-800 
            text-white animate-slide-in"
          >
            <li className="text-xl w-full mb-4 pr-4 text-right">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {menuItems.map((item, index) => (
              <NavBarItem 
                key={`mobile-${item.href}-${index}`} 
                title={item.title} 
                href={item.href}
                classprops="my-2 text-lg w-full pr-4 text-right" 
              />
            ))}
          <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] text-white">
            {user ? (
              <button onClick={handleLogout} className="block w-full h-full">
                Logout
              </button>
            ) : (
              <Link href="/login" className="block w-full h-full">
                Login
              </Link>
            )}
          </li>
             <li className="p-2 w-full pr-4 text-right">
           <button 
          onClick={toggleTheme}
         className="text-2xl text-white"
         >
                {currentTheme === 'dark' ? '🌞' : '🌙'}
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
