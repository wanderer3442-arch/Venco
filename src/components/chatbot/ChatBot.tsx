'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, MessageCircle, Bot, User, Sparkles, Minimize2 } from 'lucide-react';
import { getChatResponse } from '@/lib/ai-service';
import { hasApiKey } from '@/lib/food-recognition';
import { findResponse, getFollowUps } from '@/lib/chatbot-responses';
import { useSubscription } from '@/lib/subscription-context';
import { useStore } from '@/lib/store-context';
import { useAuth } from '@/lib/auth-context';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  followUps?: string[];
}

interface ChatBotProps {
  mode?: 'floating' | 'inline';
  onClose?: () => void;
}

const FREE_DAILY_LIMIT = 30;

function getChatCountKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `gymathome_chat_count_${today}`;
}

function getDailyCount(): number {
  if (typeof window === 'undefined') return 0;
  const key = getChatCountKey();
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function incrementDailyCount(): number {
  const key = getChatCountKey();
  const current = getDailyCount();
  localStorage.setItem(key, String(current + 1));
  return current + 1;
}

function getGeminiKeyForPaid(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('gemini_api_key');
}

export default function ChatBot({ mode = 'floating', onClose }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm V, your Gym at Home AI Health Assistant. How can I help you today?",
      timestamp: '10:30 AM',
      followUps: ['Analyze my progress', 'Suggest a meal', 'Give me exercise tips'],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isPro, isPremium } = useSubscription();
  const isPaid = isPro || isPremium;
  const { user } = useAuth();
  const { profile, meals, waterLogs, calculations, bodyMetrics, workoutPlan } = useStore();

  // Build personalized context for AI
  const chatContext = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter((m: any) => m.loggedAt?.startsWith(today));
    const todayCalories = todayMeals.reduce((sum: number, m: any) => sum + (m.calories || 0), 0);
    const todayProtein = todayMeals.reduce((sum: number, m: any) => sum + (m.protein || 0), 0);
    const todayWater = waterLogs
      .filter((w: any) => w.date?.startsWith(today))
      .reduce((sum: number, w: any) => sum + (w.amount || 0), 0) / 1000;
    const recentMealNames = todayMeals.slice(-3).map((m: any) => m.foodName).join(', ');

    return {
      profile: profile ? {
        bmi: calculations?.bmi || null,
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        activityLevel: profile.activityLevel || 'moderate',
        targetCalories: calculations?.targetCalories,
      } : null,
      recentMeals: recentMealNames || undefined,
      healthGoal: profile?.goal || undefined,
      dailyCalories: todayCalories || undefined,
      dailyProtein: todayProtein || undefined,
      dailyWater: todayWater || undefined,
    };
  }, [profile, meals, waterLogs, calculations]);

  useEffect(() => {
    setDailyCount(getDailyCount());
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const sendText = text || message.trim();
    if (!sendText) return;

    const currentCount = getDailyCount();
    if (!isPaid && currentCount >= FREE_DAILY_LIMIT) {
      const limitMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: `You've reached the daily limit of ${FREE_DAILY_LIMIT} messages for free users. Upgrade to Pro for unlimited messages, or try again tomorrow.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        followUps: ['Upgrade to Pro'],
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: sendText,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      let response: string;
      let followUps: string[] = [];

      if (hasApiKey() || (isPaid && getGeminiKeyForPaid())) {
        response = await getChatResponse(sendText, chatContext, isPaid);
        followUps = getFollowUps(sendText);
        incrementDailyCount();
      } else {
        response = findResponse(sendText);
        followUps = getFollowUps(sendText);
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp,
        followUps,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const response = findResponse(sendText);
      const followUps = getFollowUps(sendText);

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp,
        followUps,
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (mode === 'inline') {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-on-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-on-surface">V AI Assistant</h3>
              <p className="text-xs text-on-surface-variant">
                {hasApiKey() ? 'AI Powered' : isPaid ? 'Gemini AI • Upgrade for OpenRouter' : `Free • ${dailyCount}/${FREE_DAILY_LIMIT} messages today`}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-lg">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-sm'
                      : 'bg-surface-container text-on-surface rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{msg.timestamp}</p>
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.followUps.map((followUp, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(followUp)}
                        className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-secondary font-medium transition-colors"
                      >
                        {followUp}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              'How much protein should I eat?',
              'Suggest a meal',
              'Full body workout',
              'Sleep tips',
              'How much water should I drink?',
              'Create a meal plan',
            ].map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-on-surface-variant font-medium whitespace-nowrap transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-outline-variant/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask V anything..."
              className="flex-1 h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!message.trim() || isTyping}
              className="h-10 px-4 bg-primary text-on-primary rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Floating mode
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-on-surface text-surface-container rotate-0'
            : 'bg-gradient-to-br from-primary to-primary-light text-on-primary hover:scale-110'
        }`}
      >
        {isOpen ? (
          <Minimize2 className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-surface rounded-2xl shadow-elevated border border-outline-variant/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-on-primary">V AI Assistant</h3>
                  <p className="text-xs text-on-primary/80">
                    {hasApiKey() ? 'AI Powered • Online' : isPaid ? 'Gemini AI • Online' : `Free • ${dailyCount}/${FREE_DAILY_LIMIT} messages`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-on-primary" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-on-primary rounded-tr-sm'
                        : 'bg-surface-container text-on-surface rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{msg.timestamp}</p>
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.followUps.map((followUp, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(followUp)}
                          className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-secondary font-medium transition-colors"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                'How much protein should I eat?',
                'Suggest a meal',
                'Full body workout',
                'Sleep tips',
              ].map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-on-surface-variant font-medium whitespace-nowrap transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask V anything..."
                className="flex-1 h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!message.trim() || isTyping}
                className="h-10 px-4 bg-primary text-on-primary rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
