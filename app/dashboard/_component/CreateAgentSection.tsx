'use client'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Plus } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from 'convex/react' 
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { UserDetails } from '@/context/UserData';
import { toast } from 'sonner';
import { useAuth } from "@clerk/nextjs";
import { Id } from '@/convex/_generated/dataModel';

function CreateAgentSection() {

  const route = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const CreateAgentMutation = useMutation(api.agent.createAgent)
  const [agentName, setAgentName] = useState<string>()
  const [loader, setLoader] = useState(false)
  const { userDetails } = useContext(UserDetails)
  const { has } = useAuth();
  
  const hasPremiumAccess = has && has({ plan: "unlimited_plan" });


  const userAgents = useQuery(api.agent.GetUserAgents, 
    userDetails?._id ? { userId: userDetails._id as Id<"UserTable"> } : "skip"
  );
 
  const CreateAgent = async () => {
 
    const currentAgentCount = userAgents?.length || 0;


    if (!hasPremiumAccess && currentAgentCount >= 2) {
      toast.error("You have reached the limit of free agents. Please upgrade to premium.");
      setOpenDialog(false);
      return;
    }

    if (!userDetails?._id) {
      toast.error("User data not loaded");
      return;
    }

    setLoader(true)
    const agentId = uuidv4()

    try {
      await CreateAgentMutation({
        agentId: agentId,
        name: agentName ?? "New Agent",
        userId: userDetails._id
      })
      setLoader(false)
      setOpenDialog(false)
      toast.success("Agent created successfully!");
      route.push('/agent/' + agentId)
    } catch (error) {
      console.error("Error creating agent:", error)
      setLoader(false)
      toast.error("Failed to create agent.")
    }
  }

  return (
    <div className='space-y-3 flex flex-col justify-center items-center mt-20' >
      <h2 className='font-bold text-2xl' >Create Ai Agent Workflow</h2>
      <p className='text-lg'>Build an ai agent workflow with logic and tools</p>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
    
          <Button size={'lg'} onClick={() => {
   
              if (!hasPremiumAccess && (userAgents?.length || 0) >= 2) {
                 toast.error("Free limit reached (2 Agents). Upgrade to create more.");
              } else {
                 setOpenDialog(true);
              }
          }}>
            <Plus /> Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Agent name</DialogTitle>
            <DialogDescription>
              <Input placeholder='Agent name' onChange={(e) => setAgentName(e.target.value)} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'ghost'} >Cancel</Button>
            </DialogClose>
            <Button onClick={CreateAgent} disabled={loader} >
              {loader && <Loader2Icon className='animate-spin' />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateAgentSection