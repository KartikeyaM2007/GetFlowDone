import React from 'react';
import {
  Square,
  Merge,
  Repeat,
  ThumbsUp,
  Webhook,
  MousePointer2,
} from 'lucide-react';
import { WorkflowContext } from '@/context/WorkflowContext';

type AgentTool = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  id: string;
  type: string;
  desc: string;
};

const AgentTools = [
  {
    name: 'Agent',
    icon: MousePointer2,
    color: '#111111',
    bgColor: 'rgba(17, 17, 17, 0.1)',
    borderColor: 'rgba(17, 17, 17, 0.3)',
    id: 'agent',
    type: 'AgentNode',
    desc: 'AI Worker Module',
  },
  {
    name: 'End',
    icon: Square,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    id: 'end',
    type: 'EndNode',
    desc: 'Termination Node',
  },
  {
    name: 'If / Else',
    icon: Merge,
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    id: 'ifElse',
    type: 'IfElseNode',
    desc: 'Conditional Branch',
  },
  {
    name: 'While',
    icon: Repeat,
    color: '#4b5563',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    id: 'while',
    type: 'WhileNode',
    desc: 'Iteration Loop',
  },
  {
    name: 'Approval',
    icon: ThumbsUp,
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    id: 'approval',
    type: 'ApprovalNode',
    desc: 'Human In The Loop',
  },
  {
    name: 'API Integration',
    icon: Webhook,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    id: 'api',
    type: 'ApiNode',
    desc: 'External Endpoints',
  },
];

const AgentToolsPanel = () => {
  const { setAddedNode } = React.useContext(WorkflowContext);

  const onAgentToolClick = (tool: AgentTool) => {
    setAddedNode((prev: Array<{ id: string }>) => {
      let nextIndex = prev.filter((node) => node.id.startsWith(`${tool.id}-`)).length + 1;
      while (prev.some((node) => node.id === `${tool.id}-${nextIndex}`)) {
        nextIndex += 1;
      }
      const newNode = {
        id: `${tool.id}-${nextIndex}`,
        position: { x: 100, y: 100 },
        data: { label: tool.name, bgColor: tool.bgColor, id: tool.id, type: tool.type },
        type: tool.type,
      };

      return [...prev, newNode];
    });
  };

  return (
    <div className="glass-cyber border border-[#111111]/20 rounded-2xl shadow-[0_0_40px_rgba(17,17,17,0.12)] p-5 w-[240px] space-y-4 text-white select-none">
      <div className="w-full border-b border-white/10 pb-3 mb-2">
        <h2 className="text-xs font-black font-mono uppercase tracking-[0.2em] text-center bg-gradient-to-r from-[#111111] to-[#111111] bg-clip-text text-transparent">
          Module Library
        </h2>
      </div>

      <div className="space-y-2 overflow-y-auto overflow-x-hidden max-h-[42vh] pr-1 [&::-webkit-scrollbar]:w-0 [scrollbar-width:none]">
        {AgentTools.map((tool) => (
          <button
            key={tool.id}
            className="w-full flex items-center gap-4 p-3 rounded-xl border border-transparent bg-white/0 hover:bg-white/5 hover:border-[#111111]/30 text-left transition-all duration-300 group cursor-pointer"
            onClick={() => onAgentToolClick(tool)}
          >
            {/* Dynamic Glowing Icon container */}
            <div
              className="p-2.5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_var(--glow-color)]"
              style={{
                backgroundColor: tool.bgColor,
                borderColor: tool.borderColor,
                borderWidth: '1px',
                color: tool.color,
                '--glow-color': `${tool.color}40`,
              } as React.CSSProperties}
            >
              <tool.icon className="h-4 w-4 drop-shadow-[0_0_4px_currentColor]" />
            </div>

            <div>
              <span className="block text-sm font-bold tracking-wide text-gray-200 group-hover:text-white transition-colors">
                {tool.name}
              </span>
              <span className="block text-[10px] font-mono text-gray-500 group-hover:text-[#111111]/70 mt-0.5 uppercase transition-colors">
                {tool.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentToolsPanel;
