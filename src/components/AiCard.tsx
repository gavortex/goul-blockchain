'use client';


interface AiCardProps {
    title: string;
    icon: React.ReactNode;
    response: string;
  }
  
  const AiCard: React.FC<AiCardProps> = ({ title, icon, response }) => (
    <div className="flex flex-col justify-start items-start bg-white p-6 m-4 rounded-xl shadow-xl w-full max-w-2xl">
      <div className="flex flex-row justify-start items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="mt-4 text-gray-600 text-sm">{response}</p>
    </div>
  );
  
  export default AiCard;
  