'use client'
import React, { useContext, useEffect, useState } from 'react'
import { UserDetails } from '@/context/UserData';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import { GitBranchIcon } from 'lucide-react';
import moment from 'moment'
import Link from 'next/link';



function Myagents() {

  const {userDetails} = useContext(UserDetails)
  const [agentList, setAgentList] = useState<Agent[]>([])
  const convex = useConvex()

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

  return (
    <div className='w-full mt-5' >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {agentList.map((a) => (
            <Link 
              href={'/agent/'+a.agentId} 
              key={a._id} 
              className="relative group p-6 bg-black/50 border border-white/10 hover:border-[#00f2fe]/40 rounded-2xl mt-5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,242,254,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-48" 
            >
                <div className="absolute -inset-px bg-gradient-to-r from-[#00f2fe]/10 to-[#4facfe]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#00f2fe]/10 border border-[#00f2fe]/20 rounded-xl text-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.15)] group-hover:scale-105 group-hover:bg-[#00f2fe]/15 transition-all">
                      <GitBranchIcon className="h-5 w-5 drop-shadow-[0_0_4px_currentColor]" />
                    </div>
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-[#00f2fe]/80 mt-1">
                      SYSTEM_PIPELINE
                    </span>
                  </div>
                  
                  <h2 className="text-base font-black tracking-tight text-gray-100 group-hover:text-white transition-colors truncate">
                    {a.name || 'Untitled Agent'}
                  </h2>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                    {moment(a._creationTime).fromNow()}
                  </span>
                  <span className="text-[10px] font-black text-[#00f2fe] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-mono uppercase tracking-widest">
                    Launch &rarr;
                  </span>
                </div>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default Myagents
