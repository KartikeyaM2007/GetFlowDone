import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import schema from '@/convex/schema'

interface EndSettingsProps {
  selectedNode?: any;
  updatedFormData?: (data: any) => void;
}

const EndSettings = ({ selectedNode, updatedFormData }: EndSettingsProps) => {
  const [formData, setFormData] = useState({
    schema: ''
  });

  useEffect(() => {
    if (selectedNode && selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        schema: ''
      });
    }
  }, [selectedNode]);

  const handleChange = (value: string) => {
    setFormData({ schema: value });
  };

  const onSave = () => {
    if (updatedFormData) {
      updatedFormData(formData);
      toast.success("End node settings saved");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">End</h2>
      <p className="text-gray-500 text-sm mb-4">
        Choose the workflow output
      </p>
      
      <div className="space-y-2">
        <Label>Output</Label>
        <Textarea 
          placeholder="{name:string}"
          value={formData?.schema || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[80px] font-mono text-sm"
        />
      </div>

      <Button 
        className="w-full mt-4" 
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  )
}

export default EndSettings