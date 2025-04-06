// src/components/Footer.tsx
"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  const linkStyle = "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-base text-center mx-2 cursor-pointer transition-colors";
  
  const footerLinks = [
    { title: "Post", path: "/postimg" },
    { title: "Liquidity", path: "/liquidity" },
    { title: "Buy/Sell", path: "/onramper" },
    { title: "Swap", path: "/" },
    { title: "Services", path: "/services" },
    { title: "Login", path: "/login" }
  ];

  return (
    <div className="container">
      <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg bg-white dark:bg-gray-900 border-t">
        <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
          <div className="flex flex-[0.5] justify-center items-center">
            <Link href="/">
              <Image 
                src="/assets/gouldex-logo.png" 
                alt="Gould Dex" 
                width={90} 
                height={50} 
                className="logo cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
            {footerLinks.map((item) => (
               <Link 
               key={item.title} 
               href={{ pathname: item.path }} // ✅ Wrap in UrlObject
               className={linkStyle}
             >
               {item.title}
             </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center flex-col mt-5">
          <p className="text-gray-400 text-sm text-center">
            Come join us and become a pioneer in Goul. Swap your BNB for Goul
          </p>
          <p className="text-gray-400 text-sm text-center font-medium mt-2">
            support@goul.io
          </p>
        </div>

        <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />

        <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
          <p className="text-gray-400 text-left text-xs">@Goul Exchange 2025</p>
          <p className="text-gray-400 text-right text-xs">All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;