import React from 'react'
import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { Repeat } from 'lucide-react'

const WhileNode = ({ data }: any) => {
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-4 border-2 border-[#a855f7]/40 text-white hover:border-[#a855f7] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_25px_rgba(168,85,247,0.12)] cursor-pointer min-w-[200px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center pb-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          <Repeat className="h-4.5 w-4.5 animate-[spin_10s_linear_infinite]"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#a855f7]">Iterator</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">{data?.label || 'While Loop'}</h3>
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <Input 
          placeholder="UNTIL condition_met" 
          className="h-8 text-[10px] bg-white/5 border-white/10 text-[#a855f7] font-mono uppercase tracking-wider pointer-events-none text-center border-dashed" 
          disabled 
        />
      </div>

      <Handle type='target' position={Position.Left} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#a855f7] !shadow-[0_0_6px_#a855f7] hover:scale-125 transition-transform" />
      <Handle type='source' position={Position.Right} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#a855f7] !shadow-[0_0_6px_#a855f7] hover:scale-125 transition-transform" />
    </div>
  )
}

export default WhileNode