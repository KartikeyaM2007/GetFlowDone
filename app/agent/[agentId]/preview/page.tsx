// app/agent/[agentId]/preview/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../_components/Header'
import '@xyflow/react/dist/style.css';
import { useConvex, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Agent } from '@/types/AgentType'
import { toast } from 'sonner'
import { ReactFlow, Background, BackgroundVariant, Controls } from '@xyflow/react';
import { nodeTypes } from '../page';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import axios from 'axios';
import ChatUi from './_components/ChatUi';
import { Id } from '@/convex/_generated/dataModel';


const PreviewAgent = () => {
  const { agentId } = useParams()
  const [agentDetails, setAgentDetails] = useState<Agent>()
  const [flowConfig, setFlowConfig] = useState<any>(null)
  const [loading, setLoading] = useState(false);
  const updateAgentConfig = useMutation(api.agent.UpdateAgentConfig)
  
  const convex = useConvex()


  const GetAgentDetails = async () => {
    try {
      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string
      })
      setAgentDetails(result)
    } catch (error) {
      console.error('Failed to load agent details:', error)
      toast.error('Failed to load agent details')
    }
  }


  useEffect(() => {
    if (agentId) {
      GetAgentDetails()
    }
  }, [agentId])


  useEffect(() => {
    if (agentDetails) {
      GenerateWorkflow()
    }
  }, [agentDetails])


  const GenerateWorkflow = () => {
    const edgeMap = agentDetails?.edge?.reduce((acc: any, edge: any) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge);
      return acc;
    }, {});


    const flow = agentDetails?.node?.map((node: any) => {
      const connectedEdges = edgeMap[node.id] || [];
      let next: any = null;


      switch (node.type) {
        case "IfElseNode": {
          const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
          const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");
          next = {
            if: ifEdge?.target || null,
            else: elseEdge?.target || null,
          };
          break;
        }
        case "AgentNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }
        case "ApiNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }
        case "StartNodes": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }
        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }
      }


      return {
        id: node.id,
        type: node.type,
        label: node.data?.label || node.type,
        settings: node.data?.settings || {},
        next,
      };
    });


    const startNode = agentDetails?.node?.find((n: any) => n.type === "StartNodes");


    const workflowConfig = {
      startNode: startNode?.id || null,
      flow,
    };


    console.log("🎯 Generated Workflow Config:", workflowConfig);
    setFlowConfig(workflowConfig);
  }


  const GenerateAgentConfig = async () => {
    if (!agentDetails?._id) {
      toast.error('Agent details not loaded');
      return;
    }


    if (!flowConfig) {
      toast.error('Workflow config not generated');
      return;
    }


    try {
      setLoading(true);
      console.log('Generating config for agent:', agentDetails._id);
      
      const response = await axios.post('/api/generate-agent', {
        jsonConfig: flowConfig
      });
      
      console.log("Generated Agent Config:", response.data);
      
      await updateAgentConfig({
        id: agentDetails._id as Id<"AgentTable">,
        agentToolConfig: response.data  
      });
      
      toast.success('Agent configuration updated!');
      await GetAgentDetails();
      
    } catch (error) {
      console.error("Error generating agent config:", error);
      toast.error('Failed to generate agent configuration');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header previewHeader={true} agentDetails={agentDetails}/>


      <div className='flex-1 grid grid-cols-4 gap-4 p-4 overflow-hidden'>
        {/* Workflow Preview */}
        <div className='col-span-3 border rounded-lg shadow-sm bg-white flex flex-col overflow-hidden'>
          <div className='p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50'>
            <h2 className='font-semibold text-lg text-gray-800'>Workflow Preview</h2>
            <p className='text-sm text-gray-600 mt-1'>Visual representation of your agent workflow</p>
          </div>
          <div className='flex-1 relative'>
            <ReactFlow
              nodes={agentDetails?.node || []}
              edges={agentDetails?.edge || []}
              fitView
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </div>


        {/* Chat UI */}
        <div className="col-span-1 border rounded-lg shadow-sm bg-white flex flex-col overflow-hidden">
          <div className='p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50'>
            <h2 className='font-semibold text-lg text-gray-800'>Test Agent</h2>
            <p className='text-sm text-gray-600 mt-1'>Try your workflow</p>
          </div>
          
          {!agentDetails?.agentToolConfig && (
            <div className="p-4 border-b bg-amber-50">
              <Button 
                onClick={GenerateAgentConfig}
                disabled={loading}
                className='w-full'
              >
                <RefreshCcwIcon className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`} />
                {loading ? 'Loading Agent...' : 'Load Agent'}
              </Button>
              <p className='text-xs text-amber-700 mt-2 text-center'>
                Click to prepare the agent for testing
              </p>
            </div>
          )}
          
          <ChatUi 
            agentDetails={agentDetails} 
            onReloadAgent={GenerateAgentConfig}
            isReloading={loading}
          />
        </div>
      </div>
    </div>
  )
}


export default PreviewAgent
