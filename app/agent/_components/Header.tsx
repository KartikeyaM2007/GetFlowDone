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
  const [isPublishing, setIsPublishing] = useState(false)
  const DeleteMutation = useMutation(api.agent.DeleteAgent)
  const UpdatePublishedMutation = useMutation(api.agent.UpdatePublished)
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

  const handlePublishAgent = async () => {
    if (!agentDetails?._id) return;

    setIsPublishing(true);
    try {
      await UpdatePublishedMutation({
        id: agentDetails._id as Id<"AgentTable">,
        published: true,
      });
      toast.success("Agent published successfully.");
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error("Failed to publish agent.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <>
      <div className="w-full bg-black/80 backdrop-blur-lg border-b border-white/10 text-white py-3 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-50 shadow-lg shadow-black/30">
        <div className="flex gap-3 items-center min-w-0">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-base font-black tracking-wide text-white truncate max-w-[260px] lg:max-w-[360px]">
              {agentDetails?.name || 'Untitled Workspace'}
            </h2>
            <span className="text-[10px] font-black font-mono text-[#111111] uppercase tracking-widest opacity-80">
              Agent Console
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto max-w-[70vw] pb-1">
          {/* New: Delete Workspace Action */}
          <Button 
            variant="ghost"
            onClick={handleDeleteAgent}
            disabled={isDeleting || !agentDetails}
            className="bg-rose-950/20 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold uppercase tracking-wider text-xs h-10 px-3 lg:px-4 rounded-lg transition-all shrink-0"
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
            className="bg-black/50 border border-white/15 text-gray-200 hover:text-white hover:bg-[#111111]/5 hover:border-[#111111]/60 font-bold uppercase tracking-wider text-xs h-10 px-3 lg:px-5 rounded-lg shadow-lg shadow-black/30 hover:shadow-[0_0_20px_rgba(17,17,17,0.15)] shrink-0"
          >
            <Code2 className="mr-2 h-4 w-4 text-[#111111]" />
            Export Config
          </Button>

          {!previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}/preview`}>
              <Button disabled={!agentDetails?.agentId} className="bg-black/50 border border-white/15 text-gray-200 hover:text-white hover:bg-[#4b5563]/5 hover:border-[#4b5563]/60 font-bold uppercase tracking-wider text-xs h-10 px-3 lg:px-5 rounded-lg shadow-lg shadow-black/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] disabled:opacity-60 shrink-0">
                <Play className="mr-2 h-4 w-4 text-[#4b5563]" />
                Preview Pipeline
              </Button>
            </Link>
          )}

          {previewHeader && (
            <Link href={`/agent/${agentDetails?.agentId}`}>
              <Button className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold uppercase tracking-wider text-xs h-10 px-3 lg:px-5 rounded-lg shrink-0">
                <X className="mr-2 h-4 w-4" />
                Exit Preview
              </Button>
            </Link>
          )}

          <Button
            onClick={handlePublishAgent}
            disabled={!agentDetails || isPublishing}
            className="bg-gradient-to-r from-[#111111] to-[#111111] text-black font-black uppercase tracking-wider text-xs h-10 px-4 lg:px-6 rounded-lg shadow-[0_0_20px_rgba(17,17,17,0.3)] hover:shadow-[0_0_30px_rgba(17,17,17,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border-none disabled:opacity-60 shrink-0"
          >
            {isPublishing ? 'Publishing...' : 'Publish Agent'}
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
