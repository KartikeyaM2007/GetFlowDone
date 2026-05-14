import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Myagents from "./Myagents";

function AgentTab() {
  return (
    <div className=" px-10 md:px-24 lg:px-32 mt-14 ">
      <Tabs defaultValue="agent" className="w-full">
        <TabsList>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        <TabsContent value="agent">
          <Myagents/>
        </TabsContent>
        <TabsContent value="template">A ready to use template.</TabsContent>
      </Tabs>
    </div>
  );
}

export default AgentTab;