'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '../_components/Header'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, MiniMap, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
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
      <div style={{ width: '100vw', height: '90vh' }}>
        <ReactFlow
          nodes={addedNode || []}
          edges={nodeEdges || []}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls/>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position='top-left'>
            <AgentToolsPanel/>
          </Panel>
          <Panel position='top-right'>
            <SettingPanel/>
          </Panel>
          <Panel position='top-center'>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              gap: '12px',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <button 
                onClick={SaveNodesAndEdges}
                disabled={isSaving || !hasUnsavedChanges}
                style={{
                  padding: '10px 24px',
                  background: hasUnsavedChanges ? '#3b82f6' : '#f3f4f6',
                  color: hasUnsavedChanges ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (isSaving || !hasUnsavedChanges) ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {isSaving ? 'Saving...' : 'Save Workflow'}
              </button>
              
              {hasUnsavedChanges && !isSaving && (
                <span style={{ 
                  color: '#f59e0b',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    background: '#f59e0b', 
                    borderRadius: '50%',
                  }}></span>
                  Unsaved changes
                </span>
              )}
              
              {!hasUnsavedChanges && !isInitialLoad && !isSaving && (
                <span style={{ 
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  All changes saved
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