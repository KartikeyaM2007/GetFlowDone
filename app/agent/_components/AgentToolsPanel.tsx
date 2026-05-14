import React from 'react';
import {
  Square,
  Merge,
  Repeat,
  ThumbsUp,
  Webhook,
  MousePointer2,
  Play,
} from 'lucide-react';
import { WorkflowContext } from '@/context/WorkflowContext';
import { useContext } from 'react';

const AgentTools = [
  {
    name: 'Agent',
    icon: MousePointer2,
    bgColor: '#CDF7E3',
    id: 'agent',
    type: 'AgentNode',
  },
  
  {
    name: 'End',
    icon: Square,
    bgColor: '#FFE3E3',
    id: 'end',
    type: 'EndNode',
  },
  {
    name: 'If / Else',
    icon: Merge,
    bgColor: '#FFF3CD',
    id: 'ifElse',
    type: 'IfElseNode',
  },
  {
    name: 'While',
    icon: Repeat,
    bgColor: '#E3F2FD',
    id: 'while',
    type: 'WhileNode',
  },
  {
    name: 'User Approval',
    icon: ThumbsUp,
    bgColor: '#EADCF8',
    id: 'approval',
    type: 'ApprovalNode',
  },
  {
    name: 'API',
    icon: Webhook,
    bgColor: '#D1F0FF',
    id: 'api',
    type: 'ApiNode',
  },
];

const AgentToolsPanel = () => {
    const {addedNode,setAddedNode} = React.useContext(WorkflowContext);

    const onAgentToolClick = (tool:any) => {
        const newNode = {
            id:`${tool.id}-${Date.now()}`,
            position:{x:0,y:100},
            data:{label:tool.name,bgColor:tool.bgColor , id:tool.id, type:tool.type },
            type:tool.type
        }
        setAddedNode((prev:any)=>[...prev,newNode]);
    }

  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-3">
      <div className="w-full flex justify-center mb-2">
        <h2 className="font-bold">Agent Tools</h2>
      </div>

      {AgentTools.map((tool) => (
        <div
          key={tool.id}
          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100"
          onClick={()=>onAgentToolClick(tool)}
        >
          
          <div
            className="p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: tool.bgColor }}
          >
            <tool.icon className="h-5 w-5" />
          </div>

          
          <span className="font-medium">{tool.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AgentToolsPanel;
