import { Handle, Position } from '@xyflow/react'
import { Webhook } from 'lucide-react'
import React from 'react'

const ApiNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl px-4 p-3 border border-gray-200 shadow-md hover:shadow-lg cursor-pointer">
      <div className="flex gap-2 items-center">
        <Webhook 
          className='p-2 rounded-lg h-8 w-8' 
          style={{ backgroundColor: data?.bgColor || '#D1F0FF' }}
        />
        <h2>{data?.label || 'API'}</h2>
        <Handle type='target' position={Position.Left} />
        <Handle type='source' position={Position.Right} />
      </div>
    </div>
  )
}

export default ApiNode