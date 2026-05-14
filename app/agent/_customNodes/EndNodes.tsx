import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'
import React from 'react'

const EndNode = ({ data }: any) => {  
  return (
    <div className="bg-white rounded-2xl px-4 p-3 border border-gray-200 shadow-md hover:shadow-lg cursor-pointer">
      <div className="flex gap-2 items-center">
        <Square 
          className='p-2 rounded-lg h-8 w-8' 
          style={{ backgroundColor: data?.bgColor || '#FFE3E3' }} 
        />
        <h2>{data?.label || 'End'}</h2>  
        <Handle type='target' position={Position.Left} />
      </div>
    </div>
  )
}

export default EndNode