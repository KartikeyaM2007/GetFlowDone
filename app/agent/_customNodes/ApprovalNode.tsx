import React from 'react'
import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { ThumbsUp } from 'lucide-react'

const ApprovalNode = ({ data }: any) => {
  return (
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl px-5 py-4 border-2 border-[#eab308]/40 text-white hover:border-[#eab308] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_25px_rgba(234,179,8,0.12)] cursor-pointer min-w-[200px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#eab308]/20 to-[#fb923c]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10" />
      
      <div className="flex gap-3 items-center pb-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[#eab308]/10 border border-[#eab308]/30 flex items-center justify-center text-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.2)]">
          <ThumbsUp className="h-4 w-4 fill-[#eab308]/10"/>
        </div>
        <div>
          <h2 className="text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[#eab308]">Gatekeeper</h2>
          <h3 className="text-xs font-extrabold font-sans tracking-wide text-gray-100 mt-0.5">{data?.label || 'Approval Gate'}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <div className="relative flex items-center">
          <Input 
            placeholder="APPROVED Pipeline" 
            className="h-8 text-[10px] bg-white/5 border-white/10 text-gray-400 font-mono uppercase tracking-wider pointer-events-none text-left pl-2 pr-7" 
            disabled 
          />
          <span className="absolute right-2 text-[8px] font-black text-emerald-500 font-mono">OK</span>
        </div>
        
        <div className="relative flex items-center">
          <Input 
            placeholder="REJECTED Pipeline" 
            className="h-8 text-[10px] bg-white/5 border-white/10 text-gray-400 font-mono uppercase tracking-wider pointer-events-none text-left pl-2 pr-7" 
            disabled 
          />
          <span className="absolute right-2 text-[8px] font-black text-rose-500 font-mono">X</span>
        </div>
      </div>

      <Handle type='target' position={Position.Left} className="!w-3.5 !h-3.5 !bg-black !border-2 !border-[#eab308] !shadow-[0_0_6px_#eab308] hover:scale-125 transition-transform" />
      
      <Handle 
        type='source' 
        position={Position.Right} 
        id='if' 
        className="!w-3.5 !h-3.5 !bg-black !border-2 !border-emerald-500 !shadow-[0_0_6px_#10b981] hover:scale-125 transition-transform"
        style={{ top: 88 }}
      />
      
      <Handle 
        type='source' 
        position={Position.Right} 
        id='else' 
        className="!w-3.5 !h-3.5 !bg-black !border-2 !border-rose-500 !shadow-[0_0_6px_#f43f5e] hover:scale-125 transition-transform"
        style={{ top: 128 }}
      />
    </div>
  )
}

export default ApprovalNode