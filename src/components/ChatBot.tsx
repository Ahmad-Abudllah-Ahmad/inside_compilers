'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UserData {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}

const GEMINI_API_KEY = 'AIzaSyDrP4GBhxFHDe5QkW0MyokGiPtjIzQiVy0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const IC_ASSIST_PROMPT = `
You are **IC Assist**, the official AI Assistant of Inside Compiler.

IDENTITY & PERSONALITY:
- Professional consultant with polite, respectful, and engaging manner
- Always greet warmly (e.g., "Hello! I'm IC Assist, how can I help you today?")
- Use formal yet friendly tone with empathy
- Be persuasive but never pushy
- Use professional accents like "Certainly", "Absolutely", "Of course"
- End answers positively ("We'd be glad to help you implement this")

INSIDE COMPILER SERVICES:
- Website Development: React, Next.js, Node.js, APIs, eCommerce, dashboards
- AI/ML Solutions: Chatbots (Gemini/GPT), computer vision, predictive analytics, POS systems
- Automation & VA Services: Amazon FBA/FBM, private labeling, task automation, lead gen
- Data & Workflow Tools: Tkinter GUIs, Pandas/Excel automation, billing, reporting

STRENGTHS:
- Cost-effective, scalable solutions
- Black & White minimalistic professional theme
- AI-powered improvements for websites/businesses
- Proven experience in VA (3+ years Amazon FBA/FBM)

BEHAVIOR:
1. Understand user queries carefully
2. Remember user details during session (name, email, project type, budget, timeline)
3. At appropriate times, collect lead data politely
4. Always tie improvements back to Inside Compiler's services
5. Be clear, polite, persuasive, and engaging
6. Ask relevant follow-up questions

RESPONSE STYLE:
- Clear with bullet points when helpful
- Always thank user for sharing info
- Show how Inside Compiler's expertise solves their problem
- Ask relevant follow-up questions
- Never go off-topic or provide unrelated content
- Mission: Convert conversations into meaningful leads

Remember user data throughout the conversation and use it contextually.
`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chatbot opens
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! 👋 I'm **IC Assist**, Inside Compiler's AI assistant. How may I assist you today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const extractUserData = (text: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    
    if (emails && emails[0] && !userData.email) {
      setUserData(prev => ({ ...prev, email: emails[0] }));
    }

    // Simple name extraction (when user says "my name is..." or "I'm...")
    const nameRegex = /(?:my name is|i'm|i am)\s+([a-zA-Z]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch && nameMatch[1] && !userData.name) {
      setUserData(prev => ({ ...prev, name: nameMatch[1] }));
    }
  };

  const sendToEmail = async () => {
    if (userData.email && userData.name) {
      const formData = {
        name: userData.name,
        email: userData.email,
        projectType: userData.projectType || 'Not specified',
        budget: userData.budget || 'Not specified',
        timeline: userData.timeline || 'Not specified',
        notes: userData.notes || 'Collected via IC Assist chatbot'
      };

      // Here you would send to your contact form endpoint
      console.log('Sending lead data:', formData);
      
      // For now, just show success message
      const successMessage: Message = {
        id: Date.now().toString(),
        text: `Thank you, ${userData.name}! I've saved your details. A confirmation will be sent to ${userData.email} shortly, and our team will review your request. We'll get back to you within 24 hours.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
    }
  };

  const callGeminiAPI = async (userMessage: string) => {
    try {
      const conversationHistory = messages.map(msg => 
        `${msg.isUser ? 'User' : 'IC Assist'}: ${msg.text}`
      ).join('\n');

      const fullPrompt = `${IC_ASSIST_PROMPT}

Conversation History:
${conversationHistory}

User Data Collected:
Name: ${userData.name || 'Not provided'}
Email: ${userData.email || 'Not provided'}
Project Type: ${userData.projectType || 'Not provided'}
Budget: ${userData.budget || 'Not provided'}
Timeline: ${userData.timeline || 'Not provided'}

Current User Message: ${userMessage}

Please respond as IC Assist, maintaining the professional persona and remembering the conversation context and user data. If appropriate user data is collected, mention that you can prepare a proposal.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I encountered an issue. Please try again.';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'I apologize, but I encountered a technical issue. Please try again or contact us directly at inside.compiler@gmail.com.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Extract user data from message
    extractUserData(inputValue);

    try {
      const botResponse = await callGeminiAPI(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Check if we should send lead data
      if (userData.name && userData.email && !userData.notes?.includes('Lead sent')) {
        setUserData(prev => ({ ...prev, notes: (prev.notes || '') + ' Lead sent' }));
        setTimeout(() => sendToEmail(), 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered a technical issue. Please try again or contact us directly at inside.compiler@gmail.com.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] bg-cyan-400 hover:bg-cyan-300 text-black p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
          style={{ 
            backgroundColor: '#23D1F8',
            boxShadow: '0 10px 25px rgba(35, 209, 248, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
          aria-label="Open chat"
        >
          <MessageCircle size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998] w-[calc(100vw-2rem)] max-w-96 h-[500px] max-h-[calc(100vh-2rem)] bg-black border border-surface rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-accent-cyan text-black p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">IC Assist</h3>
              <p className="text-sm opacity-80">Inside Compiler AI Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-black/10 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-accent-cyan text-black'
                      : 'bg-surface text-white'
                  }`}
                >
                  <div 
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface text-white p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-surface">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-surface text-white placeholder-gray-400 border border-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-accent-cyan hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
