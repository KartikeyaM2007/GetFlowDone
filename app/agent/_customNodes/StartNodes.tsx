import React from 'react'
import { Play } from 'lucide-react'
import { Handle, Position } from '@xyflow/react'

const StartNodes = () => {
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-3 border-2 border-[#22c55e]/40 text-white hover:border-[#22c55e] transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(34,197,94,0.12)] cursor-pointer min-w-[160px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22c55e]/20 to-[#4ade80]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.2)]">
          <Play className="h-4 w-4 fill-[#22c55e]/20"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#22c55e]">Entry Node</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">Start</h3>
        </div>
        <Handle type='source' position={Position.Right} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#22c55e] !shadow-[0_0_6px_#22c55e] hover:scale-125 transition-transform" />
      </div>
    </div>
  )
}

export default StartNodes