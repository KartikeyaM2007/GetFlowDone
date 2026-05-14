import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ApprovalSettingProps {
  selectedNode?: any;
  updatedFormData?: (data: any) => void;
}

const ApprovalSetting = ({ selectedNode, updatedFormData }: ApprovalSettingProps) => {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  useEffect(() => {
    if (selectedNode && selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings);
    } else {
      setFormData({
        name: '',
        message: ''
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    console.log("Saved Data:", formData);
    if (updatedFormData) {
      updatedFormData(formData);
      toast.success("Settings Saved");
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold'>User Approval</h2>
      <p className='text-gray-500 text-sm mt-1'>
        Pause for a human to approve or reject a step
      </p>

      <div className='mt-4 space-y-4'>
        <div className='space-y-2'>
          <Label className='font-medium'>Name</Label>
          <Input 
            placeholder='Name' 
            value={formData?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label className='font-medium'>Message</Label>
          <Textarea 
            placeholder='Describe the message to show to the user'
            value={formData?.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            className='min-h-[100px] resize-none'
          />
        </div>
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

export default ApprovalSetting