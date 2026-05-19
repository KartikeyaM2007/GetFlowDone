// app/agent/[agentId]/preview/_components/ChatUi.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Trash2, RotateCw, FileDown } from 'lucide-react';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import { toast } from 'sonner';


type Props = {
  agentDetails: Agent | undefined;
  onReloadAgent: () => Promise<void>; 
  isReloading?: boolean; 
}


function ChatUi({ agentDetails, onReloadAgent, isReloading = false }: Props) {
  
  const extractDownloadUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    if (matches) {
      return matches.find(url => 
        url.toLowerCase().includes('.pdf') || 
        url.toLowerCase().includes('download') || 
        url.toLowerCase().includes('drive.google') ||
        url.toLowerCase().includes('dropbox') ||
        url.toLowerCase().includes('res.cloudinary') ||
        url.toLowerCase().includes('drive.usercontent')
      );
    }
    return null;
  };
  const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp: number}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const convex = useConvex();
  const saveMessage = useMutation(api.agent.SaveMessage);
  const clearMessages = useMutation(api.agent.ClearMessages);


  
  useEffect(() => {
    if (agentDetails?.agentId) {
      loadChatHistory();
    }
  }, [agentDetails?.agentId]);


  const loadChatHistory = async () => {
    if (!agentDetails?.agentId) return;
    
    try {
      const history = await convex.query(api.agent.GetMessages, {
        agentId: agentDetails.agentId
      });
      setMessages(history || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };


  const sendMessage = async () => {
    if (!input.trim() || loading) return;


    if (!agentDetails?.agentToolConfig) {
      toast.error('Please reload the agent first!');
      return;
    }


    const userMessage = input.trim();
    setInput('');


    const userMsg = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);


    try {
      
      await saveMessage({
        agentId: agentDetails.agentId,
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      });


      const response = await axios.post('/api/chat', {
        message: userMessage,
        agentId: agentDetails.agentId,
        agentConfig: agentDetails.agentToolConfig,
        conversationHistory: messages
      });


      const assistantMsg = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      };


      setMessages(prev => [...prev, assistantMsg]);


      await saveMessage({
        agentId: agentDetails.agentId,
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      });


    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg = {
        role: 'assistant',
        content: error.response?.data?.error || 'Sorry, I encountered an error.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };


  const handleClearChat = async () => {
    if (!agentDetails?.agentId) return;
    
    try {
      await clearMessages({ agentId: agentDetails.agentId });
      setMessages([]);
      toast.success('Chat history cleared!');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };


  return (
    <>
      {/* Sub-Header Actions Console */}
      <div className='p-4 border-b border-white/5 bg-black/30 flex items-center justify-between backdrop-blur-sm relative z-20'>
        <div className='flex items-center gap-2'>
          {agentDetails?.agentToolConfig ? (
            <span className='text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full tracking-widest uppercase flex items-center gap-1.5 animate-pulse'>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              Ready
            </span>
          ) : (
            <span className='text-[10px] font-black font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full tracking-widest uppercase flex items-center gap-1.5'>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Needs Sync
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReloadAgent}
          disabled={isReloading}
          className='h-8 text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
        >
          <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${isReloading ? 'animate-spin' : ''}`} />
          {isReloading ? 'Compiling...' : 'Re-Sync'}
        </Button>
      </div>

      {/* Interactive Stream Container */}
      <div className='flex-1 p-4 overflow-y-auto space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-[#111111]/10'>
        {messages.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-center px-4 opacity-80 py-10'>
            <div className='w-14 h-14 bg-[#111111]/5 border-2 border-dashed border-[#111111]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse'>
              <Send className='w-6 h-6 text-[#111111]' />
            </div>
            <p className='text-white font-black text-sm uppercase tracking-wider mb-1'>Test Chat Ready</p>
            <p className='text-gray-500 text-[11px] leading-relaxed'>
              Send a request and the workflow will run the configured tools.
            </p>
            {!agentDetails?.agentToolConfig && (
              <p className='text-amber-400 font-mono font-bold text-[10px] mt-4 border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 rounded-lg uppercase tracking-widest'>
                Sync Required
              </p>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => {
            const downloadUrl = msg.role !== 'user' ? extractDownloadUrl(msg.content) : null;
            return (
              <div 
                key={idx} 
                className={`flex w-full animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg relative group/msg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-[#111111] to-[#111111] text-black font-extrabold rounded-tr-none shadow-[0_0_25px_rgba(17,17,17,0.2)]' 
                      : 'bg-black/40 border border-white/10 text-white rounded-tl-none hover:border-[#111111]/30 transition-all'
                  }`}
                >
                  <p className='text-sm whitespace-pre-wrap font-medium leading-relaxed'>{msg.content}</p>
                  
                  {downloadUrl && (
                    <a 
                      href={downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-between group/dl transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50 no-underline block relative z-30 shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-pulse cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover/dl:scale-110 transition-transform shrink-0">
                          <FileDown className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start text-left leading-tight">
                          <span className="text-[10px] font-black font-mono uppercase tracking-wider text-emerald-300">Execute Download</span>
                          <span className="text-[9px] text-emerald-500/70 mt-0.5 font-medium truncate max-w-[160px]">Save Tailored PDF</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 group-hover/dl:translate-x-1 transition-all font-bold">&rarr;</span>
                    </a>
                  )}

                  <div className={`text-[9px] font-mono font-bold uppercase tracking-widest mt-2 opacity-60 text-right ${msg.role === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className='flex justify-start w-full animate-in fade-in'>
            <div className='bg-black/30 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex gap-3 items-center'>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-bounce" />
              </div>
              <span className='text-[10px] font-black font-mono text-[#111111] uppercase tracking-widest'>Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Input Gateway */}
      <div className='p-4 border-t border-white/5 bg-black/40 relative z-20 backdrop-blur-md'>
        {messages.length > 0 && (
          <button 
            onClick={handleClearChat}
            className='mb-3 w-full py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black font-mono uppercase tracking-widest text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer'
          >
            <Trash2 className='h-3.5 w-3.5' />
            Clear Chat
          </button>
        )}
        <div className='flex gap-3 relative items-center'>
          <input 
            type="text" 
            placeholder={agentDetails?.agentToolConfig ? "Ask this workflow to do something..." : "Sync the workflow first..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className='flex-1 px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 placeholder:text-xs font-medium tracking-wide focus:outline-none focus:border-[#111111]/50 focus:ring-1 focus:ring-[#111111]/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all pr-12 shadow-inner'
            disabled={loading || !agentDetails?.agentToolConfig}
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || loading || !agentDetails?.agentToolConfig}
            className='absolute right-2 top-2 bg-gradient-to-r from-[#111111] to-[#111111] text-black p-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(17,17,17,0.2)] hover:shadow-[0_0_25px_rgba(17,17,17,0.4)] hover:scale-105 disabled:opacity-40 disabled:scale-100 disabled:shadow-none cursor-pointer flex items-center justify-center h-8 w-8'
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4 font-black' />}
          </button>
        </div>
      </div>
    </>
  );
}


export default ChatUi;
