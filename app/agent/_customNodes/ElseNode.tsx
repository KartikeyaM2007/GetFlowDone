import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { Merge } from 'lucide-react'
import React from 'react'

const handlestyle={
  top:110
}

const IfElseNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl px-4 p-3 border border-gray-200 shadow-md hover:shadow-lg cursor-pointer">
      <div className="flex gap-2 items-center">
        <Merge 
          className='p-2 rounded-lg h-8 w-8' 
          style={{ backgroundColor: data?.bgColor || '#FFF3CD' }}
        />
        <h2>{data?.label || 'If / Else'}</h2>
        </div>
        <div className='max-widh-[140px] flex flex-col gap-2 mt-2'>
          <Input placeholder='If condition' className='text-sm bg-white' disabled></Input>
          <Input placeholder='Else condition' className='text-sm bg-white' disabled></Input>
        </div>
        <Handle type='target' position={Position.Left} />
        <Handle type='source' position={Position.Right} id={'if'}/>
        <Handle type='source' position={Position.Right} id={'else'}
        style={handlestyle}
        />
      
    </div>
  )
}

export default IfElseNode