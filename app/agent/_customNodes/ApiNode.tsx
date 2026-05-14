import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Webhook } from 'lucide-react'

const ApiNode = ({ data }: any) => {
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-3 border-2 border-[#3b82f6]/40 text-white hover:border-[#3b82f6] transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(59,130,246,0.12)] cursor-pointer min-w-[180px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#00f2fe]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <Webhook className="h-4.5 w-4.5"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#3b82f6]">Integration</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">{data?.label || 'External API'}</h3>
        </div>
        <Handle type='target' position={Position.Left} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#3b82f6] !shadow-[0_0_6px_#3b82f6] hover:scale-125 transition-transform" />
        <Handle type='source' position={Position.Right} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#3b82f6] !shadow-[0_0_6px_#3b82f6] hover:scale-125 transition-transform" />
      </div>
    </div>
  )
}

export default ApiNode