import React from 'react'
import { Square } from 'lucide-react'
import { Handle, Position } from '@xyflow/react'

const EndNode = ({ data }: any) => {  
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-3 border-2 border-[#ef4444]/40 text-white hover:border-[#ef4444] transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(239,68,68,0.12)] cursor-pointer min-w-[160px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ef4444]/20 to-[#f43f5e]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <Square className="h-3.5 w-3.5 fill-[#ef4444]/20"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#ef4444]">Terminator</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">{data?.label || 'End Output'}</h3>
        </div>
        <Handle type='target' position={Position.Left} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#ef4444] !shadow-[0_0_6px_#ef4444] hover:scale-125 transition-transform" />
      </div>
    </div>
  )
}

export default EndNode