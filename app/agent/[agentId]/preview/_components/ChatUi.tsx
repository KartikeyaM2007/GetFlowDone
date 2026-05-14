// app/agent/[agentId]/preview/_components/ChatUi.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Trash2, RotateCw } from 'lucide-react';
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
   
      <div className='p-3 border-b bg-white flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {agentDetails?.agentToolConfig ? (
            <span className='text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium'>
              ● Ready
            </span>
          ) : (
            <span className='text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium'>
              ● Not Loaded
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReloadAgent}
          disabled={isReloading}
          className='h-8 text-xs'
        >
          <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${isReloading ? 'animate-spin' : ''}`} />
          {isReloading ? 'Loading...' : 'Reload'}
        </Button>
      </div>

    
      <div className='flex-1 p-4 overflow-y-auto space-y-3'>
        {messages.length === 0 ? (
          <div className='text-center mt-10'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Send className='w-6 h-6 text-blue-600' />
            </div>
            <p className='text-gray-500 text-sm'>Send a message to start testing</p>
            {!agentDetails?.agentToolConfig && (
              <p className='text-amber-500 text-sm mt-2'>⚠️ Please reload the agent first</p>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
                <p className='text-xs opacity-70 mt-1'>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 rounded-lg px-4 py-2'>
              <div className='flex gap-1 items-center'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span className='text-sm text-gray-600'>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className='p-4 border-t bg-gray-50'>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className='mb-2 w-full text-gray-600'
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Clear Chat History
          </Button>
        )}
        <div className='flex gap-2'>
          <input 
            type="text" 
            placeholder={agentDetails?.agentToolConfig ? "Type a message..." : "Reload agent first..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className='flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed'
            disabled={loading || !agentDetails?.agentToolConfig}
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || loading || !agentDetails?.agentToolConfig}
            size="icon"
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
          </Button>
        </div>
      </div>
    </>
  );
}


export default ChatUi;
