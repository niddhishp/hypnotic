import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  Mic,
  ChevronRight
} from 'lucide-react';
import { useChatStore, useUIStore, useProjectsStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const quickActions = [
  { label: 'Research a brand', action: 'research' },
  { label: 'Generate a deck', action: 'deck' },
  { label: 'Create an image', action: 'image' },
  { label: 'Schedule content', action: 'schedule' },
];

const mockResponses: Record<string, string> = {
  'research': 'I can help you research a brand or idea. What would you like to explore? Enter a brand name, product, or strategic question.',
  'deck': 'I\'ll help you create a strategy deck. What\'s the campaign about? Give me a brief description or link to an Insight report.',
  'image': 'Let\'s create an image. Describe what you want to see, or I can generate something based on your current project.',
  'schedule': 'I can help schedule your content. Which platforms do you want to post to, and when?',
  'default': 'I\'m here to help with your creative workflow. I can assist with research, strategy, content generation, and scheduling. What would you like to work on?',
};

export function ChatAssistant() {
  const { 
    messages, 
    isOpen, 
    isTyping, 
    addMessage, 
    setIsOpen, 
    setIsTyping,
    context 
  } = useChatStore();
  const { activeModule } = useUIStore();
  const { currentProject } = useProjectsStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    });

    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = mockResponses.default;
      
      if (lowerInput.includes('research') || lowerInput.includes('brand')) {
        response = mockResponses.research;
      } else if (lowerInput.includes('deck') || lowerInput.includes('strategy')) {
        response = mockResponses.deck;
      } else if (lowerInput.includes('image') || lowerInput.includes('generate')) {
        response = mockResponses.image;
      } else if (lowerInput.includes('schedule') || lowerInput.includes('post')) {
        response = mockResponses.schedule;
      }

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const messageMap: Record<string, string> = {
      'research': 'I want to research a brand',
      'deck': 'Create a strategy deck',
      'image': 'Generate an image',
      'schedule': 'Schedule content',
    };

    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: messageMap[action],
      timestamp: new Date().toISOString(),
    });

    setIsTyping(true);

    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponses[action] || mockResponses.default,
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] rounded-full shadow-lg shadow-[#D8A34A]/20 transition-all hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Ask AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D8A34A]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D8A34A]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#F6F6F6]">Hypnotic AI</div>
                <div className="text-xs text-[#666]">
                  {currentProject ? `Project: ${currentProject.name}` : 'No project selected'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#A7A7A7] hover:text-[#F6F6F6] hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-sm text-[#A7A7A7] text-center py-4">
                  How can I help you today?
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.action}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-[#A7A7A7] hover:text-[#F6F6F6] transition-all group"
                    >
                      {action.label}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                    message.role === 'user'
                      ? "bg-[#D8A34A] text-[#0B0B0D] rounded-br-md"
                      : "bg-white/10 text-[#F6F6F6] rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-[#F6F6F6] px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#A7A7A7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#A7A7A7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#A7A7A7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#A7A7A7] hover:text-[#F6F6F6] hover:bg-white/10 rounded-lg transition-all">
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-[#F6F6F6] placeholder:text-[#666] focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-[#D8A34A] hover:bg-[#e5b55c] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0B0D] rounded-lg transition-all"
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
