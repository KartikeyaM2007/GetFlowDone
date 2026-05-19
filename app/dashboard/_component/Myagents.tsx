'use client'
import React, { useContext, useEffect, useState } from 'react'
import { UserDetails } from '@/context/UserData';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import { GitBranchIcon, Trash2, Loader2 } from 'lucide-react';
import moment from 'moment'
import Link from 'next/link';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';

function Myagents() {

  const {userDetails} = useContext(UserDetails)
  const [agentList, setAgentList] = useState<Agent[]>([])
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const convex = useConvex()
  const DeleteMutation = useMutation(api.agent.DeleteAgent)

  const GetUserAgents = async () => {
    if (!userDetails?._id) return;
    const result = await convex.query(api.agent.GetUserAgents, {
        userId: userDetails._id
    })
    console.log("User's Agents",result)
    setAgentList(result)
  }

  useEffect(() => {
    if (userDetails?._id) {
      const fetchAgents = async () => {
        await GetUserAgents();
      };
      fetchAgents();
    }
  }, [userDetails?._id])

  const handleDeleteAgent = async (e: React.MouseEvent, agentDbId: string, agentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to permanently delete "${agentName}"?`)) {
      return;
    }

    setIsDeleting(agentDbId);
    try {
      await DeleteMutation({ id: agentDbId as Id<"AgentTable"> });
      toast.success(`"${agentName}" deleted successfully.`);
      await GetUserAgents(); // Reload list
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete workspace.");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className='w-full mt-5' >
      {agentList.length === 0 ? (
        <div className="w-full text-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
          <p className="text-gray-500 font-mono font-semibold tracking-widest text-sm uppercase">
            No active workspaces found. Create one above!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {agentList.map((a) => (
              <Link 
                href={'/agent/'+a.agentId} 
                key={a._id} 
                className="relative group p-6 bg-black/50 border border-white/10 hover:border-[#111111]/40 rounded-2xl mt-5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(17,17,17,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-48" 
              >
                  <div className="absolute -inset-px bg-gradient-to-r from-[#111111]/10 to-[#111111]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#111111]/10 border border-[#111111]/20 rounded-xl text-[#111111] shadow-[0_0_12px_rgba(17,17,17,0.15)] group-hover:scale-105 group-hover:bg-[#111111]/15 transition-all">
                        <GitBranchIcon className="h-5 w-5 drop-shadow-[0_0_4px_currentColor]" />
                      </div>
                      
                      {/* Delete Action Trigger */}
                      <button 
                        onClick={(e) => handleDeleteAgent(e, a._id, a.name || 'Untitled Agent')}
                        disabled={isDeleting !== null}
                        className="p-2 rounded-lg text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all relative z-20 group/del cursor-pointer"
                        title="Delete Workspace"
                      >
                        {isDeleting === a._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <h2 className="text-base font-black tracking-tight text-gray-100 group-hover:text-white transition-colors truncate pr-2">
                      {a.name || 'Untitled Agent'}
                    </h2>
                    <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-[#111111]/50 group-hover:text-[#111111] transition-colors mt-1.5 block">
                      SYSTEM_PIPELINE
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                      {moment(a._creationTime).fromNow()}
                    </span>
                    <span className="text-[10px] font-black text-[#111111] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-mono uppercase tracking-widest">
                      Launch &rarr;
                    </span>
                  </div>
              </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Myagents
