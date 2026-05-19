import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { MousePointer2 } from 'lucide-react'

const AgentNode = () => {
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-3 border-2 border-[#111111]/40 text-white hover:border-[#111111] transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(17,17,17,0.12)] cursor-pointer min-w-[180px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#111111]/20 to-[#111111]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-lg bg-[#111111]/10 border border-[#111111]/30 flex items-center justify-center text-[#111111] shadow-[0_0_10px_rgba(17,17,17,0.2)]">
          <MousePointer2 className="h-4.5 w-4.5"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#111111]">AI Worker</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">Gemini Agent</h3>
        </div>
        <Handle type='target' position={Position.Left} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#111111] !shadow-[0_0_6px_#111111] hover:scale-125 transition-transform" />
        <Handle type='source' position={Position.Right} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#111111] !shadow-[0_0_6px_#111111] hover:scale-125 transition-transform" />
      </div>
    </div>
  )
}

export default AgentNode