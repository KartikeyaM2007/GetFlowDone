'use client'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Plus, Sparkles, Wand2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useRouter } from "next/navigation";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from 'convex/react' 
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { UserDetails } from '@/context/UserData';
import { toast } from 'sonner';
import { useAuth } from "@clerk/nextjs";
import { Id } from '@/convex/_generated/dataModel';

function CreateAgentSection() {

  const route = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const CreateAgentMutation = useMutation(api.agent.createAgent)
  const UpdateAgentMutation = useMutation(api.agent.UpdateDetails)
  
  const [agentName, setAgentName] = useState<string>('')
  const [aiPrompt, setAiPrompt] = useState<string>('')
  const [loader, setLoader] = useState(false)
  
  const { userDetails } = useContext(UserDetails)
  const { has } = useAuth();
  const hasPremiumAccess = has && has({ plan: "unlimited_plan" });

  const userAgents = useQuery(api.agent.GetUserAgents, 
    userDetails?._id ? { userId: userDetails._id as Id<"UserTable"> } : "skip"
  );
 
  const handleCreateManualAgent = async () => {
    const currentAgentCount = userAgents?.length || 0;
    if (!hasPremiumAccess && currentAgentCount >= 20) {
      toast.error("Limit reached (20 Agents). Upgrade to proceed.");
      setOpenDialog(false);
      return;
    }

    if (!userDetails?._id) {
      toast.error("User credentials not loaded.");
      return;
    }

    setLoader(true)
    const agentId = uuidv4()

    try {
      await CreateAgentMutation({
        agentId: agentId,
        name: agentName || "New Agent",
        userId: userDetails._id
      });
      toast.success("Manual workspace launched!");
      setLoader(false);
      setOpenDialog(false);
      route.push('/agent/' + agentId);
    } catch (error) {
      console.error("Error creating agent:", error);
      setLoader(false);
      toast.error("Failed to create manual grid.");
    }
  }

  const handleManifestWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      toast.error("Please input a sequence prompt.");
      return;
    }

    const currentAgentCount = userAgents?.length || 0;
    if (!hasPremiumAccess && currentAgentCount >= 20) {
      toast.error("Workspace cap reached. Purge old flows first.");
      return;
    }

    if (!userDetails?._id) {
      toast.error("Authentication session loading...");
      return;
    }

    setLoader(true)
    const agentId = uuidv4()
    const toastId = 'ai-gen';

    try {
      toast.loading("🔮 AI Command Received. Compiling workflow schema...", { id: toastId });
      
      const genResponse = await axios.post('/api/prompt-to-workflow', {
        prompt: aiPrompt
      });

      if (!genResponse.data.success) {
        throw new Error(genResponse.data.error || "Synthesizer logic error.");
      }

      const { workflowName, nodes, edges } = genResponse.data;

      // 1. Insert shell
      const insertedDbId = await CreateAgentMutation({
        agentId: agentId,
        name: workflowName || "AI Generated Loop",
        userId: userDetails._id
      });

      // 2. Store node geometry
      await UpdateAgentMutation({
        id: insertedDbId,
        nodes: nodes,
        edges: edges
      });

      toast.success("💥 Pipeline manifested in database! Redirecting...", { id: toastId });
      route.push('/agent/' + agentId);
    } catch (error: any) {
      console.error("Generative failure:", error);
      toast.error(error.message || "Upstream compiler failure.", { id: toastId });
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-20 px-4 w-full max-w-4xl mx-auto' >
      <div className="flex items-center gap-2 mb-2 bg-[#00f2fe]/5 border border-[#00f2fe]/10 px-4 py-1.5 rounded-full animate-pulse">
        <Sparkles className="h-3.5 w-3.5 text-[#00f2fe]" />
        <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[#00f2fe]">AI Generative Command Center</span>
      </div>

      <h2 className='font-extrabold text-4xl md:text-5xl tracking-tight text-white text-center uppercase font-mono bg-gradient-to-r from-[#00f2fe] via-blue-400 to-[#4facfe] bg-clip-text text-transparent mb-2' >
        Design Flow Instantaneously
      </h2>
      <p className='text-gray-500 text-xs md:text-sm font-mono tracking-wider uppercase text-center mb-10 max-w-xl'>
        Type anything you want to build and watch Gemini physically synthesize the visual logic nodes instantly.
      </p>
      
      {/* STANDALONE INTEGRATED COMMAND PROMPT BAR */}
      <form 
        onSubmit={handleManifestWorkflow} 
        className="w-full max-w-2xl relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#a855f7] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative flex items-center bg-black/80 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl focus-within:border-[#00f2fe]/40 transition-all w-full">
          <input 
            type="text"
            value={aiPrompt}
            disabled={loader}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="🔮 e.g., 'Fetch weather of Mumbai, check if >30C, then email me'"
            className="flex-1 bg-transparent text-white placeholder:text-gray-600 outline-none border-none px-4 font-medium text-sm md:text-base"
          />
          <Button 
            type="submit"
            disabled={loader || !aiPrompt.trim()}
            className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black tracking-wider uppercase text-xs px-6 h-12 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer transition-all duration-300 shrink-0 border-none"
          >
            {loader ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            {loader ? 'Compiling...' : 'Manifest'}
          </Button>
        </div>
      </form>

      {/* MANUAL GRID FALLBACK CONTROL */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest flex items-center gap-2">
          <span>OR WANT ABSOLUTE CONTROL?</span>
        </p>

        <Dialog open={openDialog} onOpenChange={(val) => { setOpenDialog(val); if(val) { setAgentName(''); } }}>
          <DialogTrigger asChild>
            <button 
              onClick={() => {
                if (!hasPremiumAccess && (userAgents?.length || 0) >= 20) {
                   toast.error("Cap reached (20). Clear old grids first.");
                } else {
                   setOpenDialog(true);
                }
              }}
              className="text-xs font-bold tracking-wider uppercase text-gray-400 hover:text-[#00f2fe] transition-all flex items-center gap-1.5 cursor-pointer bg-transparent border-none focus:outline-none"
            >
              <Plus className="h-3 w-3" /> Deploy Manual Grid
            </button>
          </DialogTrigger>
          
          <DialogContent className="glass-cyber border border-white/10 text-white bg-black/95 max-w-md shadow-2xl shadow-black/80 p-6 rounded-3xl relative z-50">
            <DialogHeader className="border-b border-white/5 pb-4 mb-4">
              <DialogTitle className="font-black tracking-wider text-lg uppercase text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-white" /> 
                Manual Grid Setup
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-[10px] font-mono">
                Launch an pristine empty workspace and drag-n-drop custom logic manually.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <label className="text-[9px] font-black font-mono uppercase tracking-widest text-gray-400 pl-1">Workspace Label</label>
              <Input 
                placeholder='e.g. Supply Chain Optimizer' 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)} 
                className="bg-black/50 border border-white/10 rounded-xl h-12 text-white focus:border-[#00f2fe]/50 placeholder:text-gray-700 transition-all shadow-inner font-medium text-sm"
              />
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
              <DialogClose asChild>
                <Button variant={'ghost'} className="text-xs font-mono text-gray-500 hover:text-white uppercase tracking-widest">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleCreateManualAgent} 
                disabled={loader || !agentName.trim()} 
                className="bg-white text-black hover:bg-gray-200 h-11 px-6 font-black uppercase tracking-wider text-xs rounded-xl transition-all duration-300 border-none"
              >
                {loader && <Loader2Icon className='animate-spin h-4 w-4 mr-2' />}
                Deploy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CreateAgentSection