'use client'
import { Button } from '@/components/ui/button'
import { Agent } from '@/types/AgentType'
import { ChevronLeft, Code2, Play, X, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CodeDialog from './CodeDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Id } from '@/convex/_generated/dataModel'

type Props = {
  agentDetails: Agent | undefined,
  previewHeader?: boolean
}

function Header({ agentDetails, previewHeader = false }: Props) {
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const DeleteMutation = useMutation(api.agent.DeleteAgent)
  const router = useRouter()

  const handleDeleteAgent = async () => {
    if (!agentDetails?._id) return;

    const name = agentDetails?.name || "Untitled Workspace";
    if (!confirm(`Are you absolutely sure you want to delete "${name}"? This action is permanent and cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await DeleteMutation({ id: agentDetails._id as Id<"AgentTable"> });
      toast.success(`Workspace "${name}" successfully deleted.`);
      // Fast redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Critical: Failed to purge workspace.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="w-full bg-black/80 backdrop-blur-lg border-b border-white/10 text-white py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-2xl shadow-black/40">
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-lg font-black tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate max-w-[250px]">
              {agentDetails?.name || 'Untitled Workspace'}
            </h2>
            <span className="text-[10px] font-black font-mono text-[#00f2fe] uppercase tracking-widest opacity-80">
              Agent Console
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* New: Delete Workspace Action */}
          <Button 
            variant="ghost"
            onClick={handleDeleteAgent}
            disabled={isDeleting || !agentDetails}
            className="bg-rose-950/20 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold uppercase tracking-wider text-xs h-10 px-4 rounded-lg transition-all"
            title="Permanently Purge Workspace"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Agent
          </Button>

          <Button 
            variant="outline"
            onClick={() => setIsCodeDialogOpen(true)}
            className="bg-black/50 border border-white/15 text-gray-200 hover:text-white hover:bg-[#00f2fe]/5 hover:border-[#00f2fe]/60 font-bold uppercase tracking-wider text-xs h-10 px-5 rounded-lg shadow-lg shadow-black/30 hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]"
          >
            <Code2 className="mr-2 h-4 w-4 text-[#00f2fe]" />
            Export Config
          </Button>

          {!previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}/preview`}>
              <Button className="bg-black/50 border border-white/15 text-gray-200 hover:text-white hover:bg-[#a855f7]/5 hover:border-[#a855f7]/60 font-bold uppercase tracking-wider text-xs h-10 px-5 rounded-lg shadow-lg shadow-black/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <Play className="mr-2 h-4 w-4 text-[#a855f7]" />
                Preview Pipeline
              </Button>
            </Link>
          )}

          {previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}`}>
              <Button className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold uppercase tracking-wider text-xs h-10 px-5 rounded-lg">
                <X className="mr-2 h-4 w-4" />
                Exit Preview
              </Button>
            </Link>
          )}

          <Button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider text-xs h-10 px-6 rounded-lg shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border-none">
            Publish Agent
          </Button>
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