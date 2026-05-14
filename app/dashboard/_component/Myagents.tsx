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
        {agentList.map((a,) => (
            <Link href={'/agent/'+a.agentId} key={a._id} className='p-3 border rounded-2xl shadow mt-5' >
                <GitBranchIcon className='bg-yellow-100 p-2 h-8 w-8 rounded-sm ' />
                <h2 className='mt-3' >{a.name}</h2>
                <h2 className='text-sm text-gray-400 mt-2' >{moment(a._creationTime).fromNow()}</h2>
            </Link>
            ))}
      </div>
    </div>
  )
}

export default Myagents
