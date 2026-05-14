import React from 'react'
import {
    Play
}from 'lucide-react'
import { Handle, Position } from '@xyflow/react'


const StartNodes = () => {
  return (
    <div className = "bg-white rounded-2xl px-4 p-3 border border-gray-200 shadow-md  hover:shadow-lg cursor-pointer" >
        <div className = "flex gap-2 items-center">
            <Play className='p-2 rounded-lg h-8 w-8 bg-yellow-100'/>
            <h2>Start</h2>
            <Handle type='source' position={Position.Right} />
        </div>
    </div>
  )
}

export default StartNodes