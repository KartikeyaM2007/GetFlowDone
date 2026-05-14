'use client'
import { Button } from '@/components/ui/button'
import { Agent } from '@/types/AgentType'
import { ChevronLeft, Code2, Play, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CodeDialog from './CodeDialog'

type Props = {
  agentDetails: Agent | undefined,
  previewHeader?: boolean
}

function Header({ agentDetails, previewHeader = false }: Props) {
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)

  return (
    <>
      <div className='w-full p-3 flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <ChevronLeft className='h-8 w-8' />
          <h2 className='text-xl'>{agentDetails?.name}</h2>
        </div>
        <div className='flex items-center gap-3'>
          <Button 
            variant={'ghost'} 
            onClick={() => setIsCodeDialogOpen(true)}
          >
            <Code2 className='mr-2 h-4 w-4' />
            Code
          </Button>

          {!previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}/preview`}>
              <Button>
                <Play className='mr-2 h-4 w-4' />
                Preview
              </Button>
            </Link>
          )}

          {previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}`}>
              <Button variant={'outline'}>
                <X className='mr-2 h-4 w-4' />
                Close Preview
              </Button>
            </Link>
          )}

          <Button>Publish</Button>
        </div>
      </div>

      <CodeDialog 
        isOpen={isCodeDialogOpen}
        onClose={() => setIsCodeDialogOpen(false)}
        agentId={agentDetails?.agentId || ''}
      />
    </>
  )
}

export default Header