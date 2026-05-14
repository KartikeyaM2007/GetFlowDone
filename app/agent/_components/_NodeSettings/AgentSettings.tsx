import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { FileJson } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const AgentSettings = ({ selectedNode, updatedFormData }: any) => {
    const [formData, setFormData] = React.useState({
    name: "",
    instruction: "",
    includeChatHistory: true,
    model: "",
    outputFormat: "Text",
    jsonSchema: "",
  });
  
  useEffect(() => {
    if (selectedNode && selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      // Reset to default values if no settings exist
      setFormData({
        name: "",
        instruction: "",
        includeChatHistory: true,
        model: "",
        outputFormat: "Text",
        jsonSchema: "",
      });
    }
  }, [selectedNode]);


  const handelChange = (key:string ,value:any)=>{
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  const onSave = () => {
    console.log("Saved Data:", formData);
    updatedFormData(formData)
    toast.success("Settings Saved")
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Agent Settings</h2>
      <p className="text-grey-500 mt-1">
        Call the ai model with your instructions
      </p>
      <div className="mt-3 space-y-1">
        <Label>Name</Label>
        <Input placeholder="Agent Name" value={formData?.name || ""} onChange={event=>handelChange("name", event.target.value)}></Input>
      </div>
      <div className="mt-3 space-y-1">
        <Label>Instruction</Label>
        <Textarea placeholder="Agent Instruction" value={formData?.instruction || ""} onChange={event=>handelChange("instruction", event.target.value)}></Textarea>
        <h2 className="text-sm p-1 flex gap-2 items-center">
          Add Context
          <FileJson className="h-3 w-3" />
        </h2>
      </div>
      <div className="mt-3 space-y-1 flex items-center justify-between">
        <Label>Include Chat History</Label>
        <Switch checked={formData?.includeChatHistory}
        onCheckedChange={(checked) => handelChange("includeChatHistory", checked)}/>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Label className=" mb-1">Model</Label>
        <Select value={formData?.model || ""} onValueChange={(value)=> handelChange('model', value)}>
          <SelectTrigger>
            <SelectValue placeholder="choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemnini 2.5 pro">gemnini 2.5 pro</SelectItem>
            <SelectItem value="gemnini 1.0">gemnini 1.0</SelectItem>
            <SelectItem value="gpt-4 turbo">gpt-4 turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3 space-y-1">
        <Label>Output Format</Label>
        <Tabs value={formData?.outputFormat || "Text"} className="w-[400px]" onValueChange={(value)=> handelChange('outputFormat', value)}>
          <TabsList >
            <TabsTrigger value="Text">Text</TabsTrigger>
            <TabsTrigger value="Json">Json</TabsTrigger>
          </TabsList>
          <TabsContent value="Text">
            <h2 className="text-sm text-gray-500 mt-1">
              Output will be text
            </h2>
          </TabsContent>
          <TabsContent value="Json">
            <Label className="text-sm text-gray-600">Json Schema</Label>
            <Textarea placeholder="Define your json schema here" 
            value={formData?.jsonSchema || ""}
            onChange={event=>handelChange("jsonSchema", event.target.value)}
            className="max-w-[300px] mt-1"></Textarea>
          </TabsContent>
        </Tabs>
      </div>
      <Button className="mt-4 w-full" onClick={onSave}>Save Settings</Button>
    </div>
  );
};

export default AgentSettings;