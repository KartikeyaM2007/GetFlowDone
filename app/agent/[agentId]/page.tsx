'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '../_components/Header'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, MiniMap, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '@/lib/utils'
import StartNodes from '../_customNodes/StartNodes';
import AgentNode from '../_customNodes/AgentNode';
import EndNode from '../_customNodes/EndNodes';
import ElseNode from '../_customNodes/ElseNode'
import WhileNode from '../_customNodes/WhileNode';
import ApprovalNode from '../_customNodes/ApprovalNode';
import ApiNode from '../_customNodes/ApiNode';
import AgentToolsPanel from '../_components/AgentToolsPanel';
import { WorkflowContext } from '@/context/WorkflowContext';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import SettingPanel from '../_components/SettingPanel';
import { useOnSelectionChange, OnSelectionChangeParams } from '@xyflow/react';
import { Id } from '@/convex/_generated/dataModel';

export const nodeTypes = {
  StartNodes: StartNodes,
  AgentNode: AgentNode,
  EndNode: EndNode,
  IfElseNode: ElseNode,
  WhileNode: WhileNode,
  ApprovalNode: ApprovalNode,
  ApiNode: ApiNode,
}

const defaultEdgeOptions = {
  animated: true,
  style: { 
    stroke: 'oklch(0.72 0.25 205)', 
    strokeWidth: 2.5,
    filter: 'drop-shadow(0px 0px 5px oklch(0.72 0.25 205 / 0.5))'
  },
};

function AgentBuilder() {
  const {addedNode, setAddedNode, nodeEdges, setNodeEdges,selectedNode, setSelectedNode} = useContext(WorkflowContext);
  const {agentId} = useParams();
  const UpdateAgentDetail = useMutation(api.agent.UpdateDetails);
  const [agentDetails, setAgentDetails] = useState<Agent>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);

  const convex = useConvex();

  const GetAgentDetails = async () => {
    try {
      // console.log( agentId);
      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string
      })
    
      setAgentDetails(result);
    } catch (error) {
      
      toast.error('Failed to load workflow');
    }
  }

  
  useEffect(() => {
    if (agentId && agentId !== currentAgentId) {
      
      
      //reset
      setAddedNode([{
        id:'start',
        position:{x:0,y:0},
        data:{label:'Start'},
        type:'StartNodes'
      }]);
      
      setNodeEdges([]);
      setIsInitialLoad(true);
      setHasUnsavedChanges(false);
      setAgentDetails(undefined);
      setCurrentAgentId(agentId as string);
      
      
      GetAgentDetails();
    }
  }, [agentId]);

  useEffect(() => {
    if (agentDetails && isInitialLoad) {
     
      
      if (agentDetails.node && agentDetails.node.length > 0) {
        setAddedNode(agentDetails.node);
      } else {
        console.log('No saved nodes, keeping default start node');
      }
      
      if (agentDetails.edge && agentDetails.edge.length > 0) {
        setNodeEdges(agentDetails.edge);
      }
      
      setIsInitialLoad(false);
    }
  }, [agentDetails, isInitialLoad]);

  // Track changes
  useEffect(() => {
    if (!isInitialLoad) {
      setHasUnsavedChanges(true);
    }
  }, [addedNode, nodeEdges, isInitialLoad])

  // alert
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const SaveNodesAndEdges = async() => {
    if (!agentDetails?._id) {
      toast.error('Cannot save: Agent details not loaded');
      return;
    }
    
    setIsSaving(true);
    try {
      console.log(' Saving workflow:', { 
        id: agentDetails._id,
        name: agentDetails.name,
        nodes: addedNode, 
        edges: nodeEdges 
      });
      
      await UpdateAgentDetail({
        id: agentDetails._id  as Id<"AgentTable">,
        nodes: addedNode,
        edges: nodeEdges
      })
      setHasUnsavedChanges(false);
      toast.success("Workflow saved successfully!")
    } catch (error) {
      
      toast.error("Failed to save. Please try again.")
    } finally {
      setIsSaving(false);
    }
  }
  
  const onNodesChange = useCallback(
    (changes: any) => {
      const updated = applyNodeChanges(changes, addedNode || [])
      setAddedNode(updated);
    },
    [addedNode, setAddedNode],
  );
  
  const onEdgesChange = useCallback(
    (changes: any) => {
      const updated = applyEdgeChanges(changes, nodeEdges || [])
      setNodeEdges(updated);
    },
    [nodeEdges, setNodeEdges],
  );
  
  const onConnect = useCallback(
    (params: any) => {
      const updated = addEdge(params, nodeEdges || [])
      setNodeEdges(updated);
    },
    [nodeEdges, setNodeEdges],
  );

  const onNodeSelect = useCallback(({nodes,edges}:OnSelectionChangeParams)=>{
    setSelectedNode(nodes[0]);
    console.log("Selected Node:",nodes[0]);
  },[selectedNode])
  useOnSelectionChange({
    onChange:onNodeSelect
  })

  return (
    <div>
      <Header agentDetails={agentDetails}/>
      <div className="relative bg-[#030303]" style={{ width: '100vw', height: '90vh' }}>
        <ReactFlow
          nodes={addedNode || []}
          edges={nodeEdges || []}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          proOptions={{ hideAttribution: true }}
        >
          <Controls 
            position="bottom-right"
            className="!bg-black/95 !border-2 !border-[#00f2fe]/25 !rounded-xl !shadow-[0_0_30px_rgba(0,242,254,0.15)] !flex !flex-col !gap-1.5 !p-1 [&_button]:!bg-transparent [&_button]:!text-[#00f2fe] [&_svg]:!fill-[#00f2fe] [&_button]:!border-none hover:[&_button]:!bg-[#00f2fe]/20 [&_button]:!transition-all"
          />
          <Background variant={BackgroundVariant.Lines} gap={24} size={1} color="rgba(0, 242, 254, 0.04)" style={{ backgroundColor: '#000000' }} />
          <Panel position="top-left" className="!flex !flex-col !gap-4 !m-0 !h-[calc(90vh-30px)] !pointer-events-none justify-between">
            <div className="!pointer-events-auto shrink-0">
              <AgentToolsPanel />
            </div>
            <div className="!pointer-events-auto shrink-0">
              <MiniMap 
                position="bottom-left"
                className="!relative !left-0 !bottom-0 !m-0 !bg-black/90 !border-2 !border-[#00f2fe]/25 !rounded-xl !shadow-[0_0_30px_rgba(0,242,254,0.15)] !w-[200px] !h-[120px]" 
                maskColor="rgba(0, 242, 254, 0.08)"
                nodeColor={(n: any) => {
                  if (n.type === 'AgentNode') return '#00f2fe';
                  if (n.type === 'EndNode') return '#ef4444';
                  if (n.type === 'StartNodes') return '#22c55e';
                  if (n.type === 'IfElseNode') return '#f97316';
                  if (n.type === 'WhileNode') return '#a855f7';
                  if (n.type === 'ApprovalNode') return '#eab308';
                  if (n.type === 'ApiNode') return '#3b82f6';
                  return '#333';
                }}
                nodeStrokeColor="transparent"
                nodeBorderRadius={8}
              />
            </div>
          </Panel>
          <Panel position='top-right'>
            <SettingPanel/>
          </Panel>
          <Panel position='top-center'>
            <div className="glass-cyber rounded-2xl px-6 py-3 flex items-center gap-5 shadow-[0_0_30px_rgba(0,242,254,0.15)]">
              <button 
                onClick={SaveNodesAndEdges}
                disabled={isSaving || !hasUnsavedChanges}
                className={cn(
                  "px-6 py-2.5 rounded-full font-black text-xs tracking-wider uppercase transition-all duration-300",
                  hasUnsavedChanges 
                    ? "bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black shadow-[0_0_15px_rgba(0,242,254,0.4)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0" 
                    : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                )}
              >
                {isSaving ? 'SYNCING...' : 'SAVE WORKFLOW'}
              </button>
              
              {hasUnsavedChanges && !isSaving && (
                <span className="text-amber-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  UNSAVED
                </span>
              )}
              
              {!hasUnsavedChanges && !isInitialLoad && !isSaving && (
                <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_4px_#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  SYNCED
                </span>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

export default AgentBuilder