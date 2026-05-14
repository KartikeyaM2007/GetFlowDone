"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs';
import  {api }from '../convex/_generated/api';
import { useMutation } from 'convex/react';
import { UserDetails } from '@/context/UserData';
import { WorkflowContext } from '@/context/WorkflowContext';
import { ReactFlowProvider } from '@xyflow/react';

function Provider({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const { user } = useUser();
    const createUser = useMutation(api.user.CreateNewUser)
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [addedNode,setAddedNode] = useState(
    [{
      id:'start',
      position:{x:0,y:0},
      data:{label:'Start'},
      type:'StartNodes'
    }]
  )
  const [nodeEdges,setNodeEdges] = useState([])

  useEffect(() => {
    const CreateAndGetUser = async () => {
      if (!user) {
        setUserDetails(null);
        return;
      }

      try {
        const result = await createUser({
          name: user.fullName ?? '',
          email: user.primaryEmailAddress?.emailAddress ?? '',
        });
        setUserDetails(result ?? user);
      } catch (e) {
        setUserDetails(user);
        console.error('Error creating or fetching user:', e);
      }
    };

    CreateAndGetUser();
  }, [user, createUser]);

//   console.log("User Details in Provider:", userDetails);
  return (
    <UserDetails.Provider value={{ userDetails, setUserDetails }}>
      <ReactFlowProvider>
        <WorkflowContext.Provider value={{addedNode,setAddedNode,nodeEdges,setNodeEdges ,selectedNode,setSelectedNode}}>
          <div>{children}</div>
        </WorkflowContext.Provider>
      </ReactFlowProvider>
    </UserDetails.Provider>
  )
}

export default Provider