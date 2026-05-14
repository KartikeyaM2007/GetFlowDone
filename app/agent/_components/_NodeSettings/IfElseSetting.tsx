import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface IfElseSettingProps {
  selectedNode?: any;
  updatedFormData?: (data: any) => void;
}

const IfElseSetting = ({ selectedNode, updatedFormData }: IfElseSettingProps) => {
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
      toast.success("If/Else condition saved");
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold'>If / Else</h2>
      <p className='text-gray-500 text-sm mt-1'>Configure the conditions for branching</p>

      <div className='mt-4 space-y-2'>
        <Label className='font-medium'>If Condition</Label>
        <Input 
          placeholder='e.g., user.age > 18' 
          value={formData?.condition || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
        <p className='text-xs text-gray-500 mt-1'>
          Enter a boolean condition to determine the workflow path
        </p>
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

export default IfElseSetting