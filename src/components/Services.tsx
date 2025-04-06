import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";




interface ServiceCardProps {
    color: string;
    title: string;
    icon: React.ReactNode;
    subtitle: string;
  }
  

const ServiceCard: React.FC<ServiceCardProps> = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services: React.FC = () => (
  <div className="flex w-full justify-center items-center gradient-bg-welcome">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-dark-900 text-3xl sm:text-5xl py-2 text-gradient ">
          Goul Token GU
          <br />
          A Community based Token
        </h1>
        <p className="text-left my-2 text-gray font-light md:w-9/12 w-11/12 text-base">
          Our token is not made for fun and dump. Goul (GU) is not a rug pull token. Rest assured the value of your tokens 
          will increase overtime. 
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Security gurantee"
          icon={<BsShieldFillCheck fontSize={21} className="text-gray" />}
          subtitle="Your security is our top priority. Our contract has the ability to retrieve your lost tokens in most cases."
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Best exchange rates"
          icon={<BiSearchAlt fontSize={21} className="text-gray" />}
          subtitle="Swap your BNB for GU with low gas fees. Same as swap your goul tokens for BNB. The choice is yours."
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Fastest Growing Community"
          icon={<RiHeart2Fill fontSize={21} className="text-gray" />}
          subtitle="We take pride in our community to enhance the quality life of our members. We are open to new ideas."
        />
      </div>
    </div>
  </div>
);

export default Services;