import { NextRequest } from 'next/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
    const {userId , agentId} = await req.json();

    const agentDetails = await fetchQuery(api.agent.GetAgentById,{
        agentId: agentId
    })
    console.log(agentDetails?.agentToolConfig);

    

    
    
    return new Response(JSON.stringify({ 
        agentToolConfig: agentDetails?.agentToolConfig 
    }), {
        status: 200
    });
}
