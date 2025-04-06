"use client";
import { useState } from "react";
import { FiSend } from "react-icons/fi";

const Goulai = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAIResponse = async () => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { sender: "user", text: prompt }]);

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: error instanceof Error ? error.message : "Failed to fetch response",
        },
      ]);
    } finally {
      setPrompt("");
      setIsLoading(false);
    }
  };

  const renderAIMessage = (text: string) => {
    const paragraphs = text.split("\n\n").filter((p) => p.trim() !== "");
    const colors = [
      "text-blue-300",
      "text-purple-300",
      "text-green-300",
      "text-yellow-300",
      "text-pink-300",
      "text-cyan-300",
    ];

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className={`${colors[idx % colors.length]} mb-4 last:mb-0`}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
      <div className="w-full max-w-3xl bg-black rounded-lg shadow-lg overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === "user" ? "gradient-bg-services text-white" : "gradient-bg-services"
                }`}
              >
                {msg.sender === "ai" ? (
                  renderAIMessage(msg.text)
                ) : (
                  <p className="break-words">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 p-3 rounded-lg gradient-bg-services text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && !isLoading && fetchAIResponse()}
            />
            <button
              onClick={fetchAIResponse}
              disabled={isLoading}
              className={`gradient-bg text-white px-6 py-3 rounded-lg ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              } transition duration-300 flex items-center justify-center`}
            >
              {isLoading ? <div className="animate-spin">⏳</div> : <FiSend size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goulai;