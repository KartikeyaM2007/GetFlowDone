import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface WhileSettingProps {
  selectedNode?: any;
  updatedFormData?: (data: any) => void;
}

const WhileSetting = ({ selectedNode, updatedFormData }: WhileSettingProps) => {
  const [formData, setFormData] = useState({
    condition: ''
  });

  useEffect(() => {
    if (selectedNode && selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        condition: ''
      });
    }
  }, [selectedNode]);

  const handleChange = (value: string) => {
    setFormData({ condition: value });
  };

  const onSave = () => {
    if (!formData.condition.trim()) {
      toast.error("Please enter a condition");
      return;
    }

    if (updatedFormData) {
      updatedFormData(formData);
      toast.success("While loop condition saved");
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold'>While</h2>
      <p className='text-gray-500 text-sm mt-1'>Loop your logic</p>

      <div className='mt-4 space-y-2'>
        <Label className='font-medium'>while</Label>
        <Input 
          placeholder="Enter condition e.g output=='any condition'" 
          value={formData?.condition || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      <Button 
        className='w-full mt-6' 
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  )
}

export default WhileSetting