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
import { ReactFlow, Background, BackgroundVariant, Controls, useReactFlow } from '@xyflow/react';
import { nodeTypes } from '../page';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import axios from 'axios';
import ChatUi from './_components/ChatUi';
import { Id } from '@/convex/_generated/dataModel';

const previewEdgeStyle = {
  stroke: 'var(--theme-accent)',
  strokeWidth: 3.5,
  filter: 'drop-shadow(0px 0px 6px var(--theme-shadow))',
};

const PreviewAgent = () => {
  const { agentId } = useParams()
  const [agentDetails, setAgentDetails] = useState<Agent>()
  const [flowConfig, setFlowConfig] = useState<any>(null)
  const [loading, setLoading] = useState(false);
  const updateAgentConfig = useMutation(api.agent.UpdateAgentConfig)
  
  const convex = useConvex()
  const { fitView } = useReactFlow();


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

  useEffect(() => {
    if (agentDetails?.node?.length) {
      const timeout = window.setTimeout(() => {
        fitView({ padding: 0.25, duration: 500, maxZoom: 1 });
      }, 150);

      return () => window.clearTimeout(timeout);
    }
  }, [agentDetails?.node, fitView]);

  useEffect(() => {
    if (flowConfig && agentDetails && !agentDetails.agentToolConfig && !loading) {
      GenerateAgentConfig();
    }
  }, [flowConfig, agentDetails?.agentToolConfig]);


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
          const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if" || e.sourceHandle === "true");
          const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else" || e.sourceHandle === "false");
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


    console.log("Generated Workflow Config:", workflowConfig);
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
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Premium sticky header */}
      <div className="relative z-20">
        <Header previewHeader={true} agentDetails={agentDetails}/>
      </div>

      <div className='workflow-screen flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5 p-5 overflow-hidden relative z-10'>
        {/* Workflow Preview Frame */}
        <div className='glass-cyber rounded-xl border border-white/10 shadow-xl flex flex-col overflow-hidden group/preview transition-all duration-500 hover:border-[#111111]/30 min-h-0'>
          <div className='p-5 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex justify-between items-center'>
            <div>
              <h2 className='font-black text-xs tracking-[0.2em] uppercase text-white'>
                Workflow Preview
              </h2>
              <p className='text-[10px] font-mono text-gray-400 mt-1 font-semibold'>
                Saved nodes and live execution path
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#111111] bg-[#111111]/5 px-2.5 py-1 border border-[#111111]/10 rounded-full uppercase tracking-widest opacity-80">
              Preview
            </span>
          </div>
          
          <div className='flex-1 relative'>
            <ReactFlow
              nodes={agentDetails?.node || []}
              edges={(agentDetails?.edge || []).map((edge: any) => ({
                ...edge,
                animated: edge.animated ?? true,
                style: {
                  ...(edge.style || {}),
                  ...previewEdgeStyle,
                },
              }))}
              fitView
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              fitViewOptions={{ padding: 0.25, maxZoom: 1 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background 
                variant={BackgroundVariant.Lines} 
                gap={24} 
                size={1} 
                color="rgba(56, 189, 248, 0.16)" 
                style={{ backgroundColor: 'var(--theme-bg)' }} 
              />
            <Controls 
              position="bottom-right"
              className="!bg-[var(--theme-panel-solid)] !border !border-[var(--theme-border)] !rounded-lg !shadow-lg !flex !flex-col !gap-1 !p-1 [&_button]:!bg-transparent [&_button]:!text-[var(--theme-text)] [&_svg]:!fill-[var(--theme-text)] [&_button]:!border-none hover:[&_button]:!bg-[var(--theme-bg-soft)] [&_button]:!transition-all"
            />
            </ReactFlow>
          </div>
        </div>

        {/* Simulator Console UI */}
        <div className="glass-cyber rounded-xl border border-white/10 shadow-xl flex flex-col overflow-hidden group/chat transition-all duration-500 hover:border-[#111111]/30 min-h-0">
          <div className='p-5 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent'>
            <h2 className='font-black text-xs tracking-[0.2em] uppercase text-[#111111] flex items-center gap-2'>
              <span className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-ping" />
              Workflow Chat
            </h2>
            <p className='text-[10px] font-mono text-gray-400 mt-1 font-semibold'>
              Test the workflow with real inputs
            </p>
          </div>
          
          {!agentDetails?.agentToolConfig && (
            <div className="p-4 border-b border-amber-500/10 bg-amber-500/[0.02]">
              <Button 
                onClick={GenerateAgentConfig}
                disabled={loading}
                className='w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 font-black uppercase tracking-wider text-xs h-10'
              >
                <RefreshCcwIcon className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`} />
                {loading ? 'Syncing...' : 'Sync Workflow'}
              </Button>
              <p className='text-[10px] font-semibold font-mono text-amber-500/70 mt-2 text-center uppercase tracking-widest'>
                Sync once before testing
              </p>
            </div>
          )}
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatUi 
              agentDetails={agentDetails} 
              onReloadAgent={GenerateAgentConfig}
              isReloading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


export default PreviewAgent
