"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { RobotIcon } from "@/components/RobotIcon";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputValueRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const placeholders = [
    "What's the weather like today?",
    "Can you help me write an email?",
    "Explain quantum computing in simple terms",
    "Tell me a fun fact about space",
    "How do I learn Python programming?",
  ];

  const suggestedQuestions = [
    "✨ Tell me a joke",
    "💡 Give me a productivity tip",
    "📝 Write a poem about AI",
    "🔮 Predict the future of tech",
    "🎨 Explain art to me",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValueRef.current = e.target.value;
    setError(null);
  };

const handleSuggestedQuestion = async (question: string) => {
  if (isLoading) return;

  const userMessage = { role: "user", content: question };

  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages,
        message: question,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
  } catch (error: any) {
    console.error("Error:", error);
    setError(error.message);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputValueRef.current;

    if (!message || isLoading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    inputValueRef.current = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages,
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-purple-400 to-pink-300 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Title - Perfectly Centered at Top */}
<div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
            Synapse
          </h1>
          <p className="text-white/50 text-sm mt-1">where ideas connect ✨</p>
        </motion.div>
      </div>

      {/* Chat Messages Container - No Scrollbar, Just Scroll */}
      <div className="flex-1 max-w-3xl mx-auto w-full mt-32 mb-40 px-4 overflow-y-auto scrollbar-hide">
        {messages.length === 0 ? (
          // Welcome Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {/* Welcome Message with Robot Icon */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-4">
                <RobotIcon className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Synapse
              </h2>
              <p className="text-white/70">
                Your cute AI companion. Ask me anything!
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="mt-8">
              <p className="text-white/60 text-sm mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((question, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    onClick={() => handleSuggestedQuestion(question.slice(3))}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Chat History
          <div className="space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 p-1.5">
                      <RobotIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-br-sm"
                        : "bg-gray-800/80 text-white backdrop-blur-sm rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                      👤
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-1.5">
                    <RobotIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-800/80 p-4 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/40 text-xs text-center mt-3"
          >
            Press Enter to send • Powered by Groq AI
          </motion.p>
        </div>
      </div>
    </div>
  );
}
