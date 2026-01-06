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
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}

// API key is now stored securely on server-side in /api/chat route

const IC_ASSIST_PROMPT = `
You are **IC Assist**, the official AI Assistant of Inside Compiler.

IDENTITY & PERSONALITY:
- Professional consultant with polite, respectful, and engaging manner
- ALWAYS remember and use the user's name once provided (e.g., "Hi Ahmad!", "Great question, Ahmad!")
- Use formal yet friendly tone with empathy
- Be persuasive but never pushy
- Use professional accents like "Certainly", "Absolutely", "Of course"
- End answers positively ("We'd be glad to help you implement this")

INSIDE COMPILER SERVICES (ONLY discuss these topics):
- Website Development: React, Next.js, Node.js, APIs, eCommerce, dashboards
- AI/ML Solutions: Chatbots (Gemini/GPT), computer vision, predictive analytics, POS systems
- Automation & VA Services: Amazon FBA/FBM, private labeling, task automation, lead gen
- Data & Workflow Tools: Tkinter GUIs, Pandas/Excel automation, billing, reporting

COMPANY INFO:
- Email: inside.compiler@gmail.com
- Social: GitHub, LinkedIn, Instagram (@aaahmad_the_dev)
- Theme: Black & White minimalistic professional design
- Founded: 2023
- Expertise: Cost-effective, scalable AI-powered solutions

STRICT RULES:
1. ONLY answer questions related to Inside Compiler's services, web development, AI/ML, automation, LLMs, LangChains, MCP, AI integrated CRMs or business inquiries
2. If user asks about unrelated topics, politely redirect to services
3. NEVER provide information outside the context of Inside Compiler
4. Always greet the user by name once they share it
5. Remember and reference user details throughout the conversation
6. COLLECT ALL LEAD DATA: name, email, phone number, project requirements, AND timeline (deadline)
7. Ask: "What's your preferred timeline for this project?"

PRICING (Use current 2024 market rates):
- Simple Landing Page: $500-$1,500
- Multi-page Website: $2,000-$5,000
- E-commerce Website: $5,000-$15,000
- Web Application: $10,000-$50,000
- AI/ML Integration: $3,000-$15,000
- Chatbot Development: $2,000-$8,000
- Automation Tools: $1,500-$5,000
- SEO Services: $500-$2,000/month
- Maintenance: $200-$500/month

PROPOSAL GENERATION:
When user has discussed their project requirements:
1. ALWAYS generate and show a formatted proposal in chat
2. Use this exact format:
   Project: [Project title based on discussion]
   Timeline: [User's timeline or suggested timeline]
   Budget: [Price based on market rates above]
   Scope: [List each deliverable on new line]
   Deliverables: [List what they will receive]
   Next Steps: Share email and phone to receive formal proposal

RESPONSE STYLE:
- BE CONCISE: Keep responses SHORT (2-4 sentences max)
- Get straight to the point
- One clear question per response
- Mission: Collect requirements → Show proposal → Get contact info

GREETING BEHAVIOR:
- First message: "Hello! 👋 I'm IC Assist. May I know your name?"
- After name: "Nice to meet you, [Name]! What project can I help you with?"
- Keep greetings brief and warm
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
      // Welcome message when chatbot opens - ask for name
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! 👋 I'm **IC Assist**, Inside Compiler's AI assistant. May I know your name so I can assist you better?",
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

    // Phone number extraction - handles various formats
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex);
    if (phones && phones[0] && !userData.phone) {
      setUserData(prev => ({ ...prev, phone: phones[0] }));
    }

    // Improved name extraction - handles multiple patterns
    const namePatterns = [
      /(?:my name is|i'm|i am|this is|call me|it's|its)\s+([a-zA-Z]+)/i,
      /^([a-zA-Z]{2,15})$/i,
      /^hi,?\s*(?:i'm|i am|this is)?\s*([a-zA-Z]+)/i,
      /^([a-zA-Z]+)\s+here$/i
    ];

    if (!userData.name) {
      for (const pattern of namePatterns) {
        const nameMatch = text.trim().match(pattern);
        if (nameMatch && nameMatch[1]) {
          const extractedName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase();
          setUserData(prev => ({ ...prev, name: extractedName }));
          break;
        }
      }
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

  const callGroqAPI = async (userMessage: string) => {
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const systemPrompt = `${IC_ASSIST_PROMPT}

User Data Collected:
Name: ${userData.name || 'Not provided'}
Email: ${userData.email || 'Not provided'}
Phone: ${userData.phone || 'Not provided'}
Project Type: ${userData.projectType || 'Not provided'}
Budget: ${userData.budget || 'Not provided'}
Timeline: ${userData.timeline || 'Not provided'}

IMPORTANT: If name, email and phone are all collected, you can offer to send a detailed proposal. If any are missing, politely ask for them before sending proposal.`;

      // Use server-side API route to keep API key secure
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || 'I apologize, but I encountered an issue. Please try again.';
    } catch (error) {
      console.error('Error calling Groq API:', error);
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
      const botResponse = await callGroqAPI(inputValue);

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
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors text-black"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 max-h-96">
            {messages.map((message) => {
              // Check if this is a proposal message
              const isProposal = message.text.includes('Project:') && (message.text.includes('Budget:') || message.text.includes('Timeline:') || message.text.includes('Scope:'));

              return (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {isProposal && !message.isUser ? (
                    // Professional Proposal Card
                    <div className="max-w-[95%] w-full">
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-cyan-500/30 shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            <h3 className="text-black font-bold text-sm">PROJECT PROPOSAL</h3>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                          {(() => {
                            // Parse proposal sections
                            const text = message.text;
                            const sections: { title: string; content: string[] }[] = [];
                            let currentSection = { title: 'Overview', content: [] as string[] };

                            const lines = text.split(/[\n*]+/).map(l => l.trim()).filter(l => l);

                            lines.forEach(line => {
                              const sectionMatch = line.match(/^(Project|Timeline|Budget|Scope|Deliverables|Features|Tech Stack|Next Steps|Payment):\s*(.*)/i);
                              if (sectionMatch) {
                                if (currentSection.content.length > 0 || currentSection.title !== 'Overview') {
                                  sections.push({ ...currentSection });
                                }
                                currentSection = {
                                  title: sectionMatch[1],
                                  content: sectionMatch[2] ? [sectionMatch[2]] : []
                                };
                              } else if (line && !line.match(/^Here's|^proposal|^Ahmad|^updated/i)) {
                                currentSection.content.push(line);
                              }
                            });
                            if (currentSection.content.length > 0) {
                              sections.push(currentSection);
                            }

                            const sectionIcons: Record<string, string> = {
                              'Project': '🎯',
                              'Timeline': '⏱️',
                              'Budget': '💰',
                              'Scope': '📋',
                              'Deliverables': '📦',
                              'Features': '✨',
                              'Tech Stack': '🛠️',
                              'Next Steps': '👉',
                              'Payment': '💳',
                              'Overview': '📌'
                            };

                            return sections.map((section, idx) => (
                              <div key={idx} className="bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/50">
                                  <span className="text-lg">{sectionIcons[section.title] || '📌'}</span>
                                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider">{section.title}</h4>
                                </div>
                                <div className="space-y-2">
                                  {section.content.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 text-gray-200 text-sm">
                                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                      <span className="leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-800/50 px-4 py-3 border-t border-gray-700">
                          <p className="text-xs text-gray-400 text-center">
                            💡 Reply with any questions or adjustments needed
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Message
                    <div
                      className={`max-w-[85%] p-3 rounded-xl shadow-lg ${message.isUser
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black ml-auto'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700'
                        }`}
                    >
                      <div
                        className="text-sm whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: message.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>')
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
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
