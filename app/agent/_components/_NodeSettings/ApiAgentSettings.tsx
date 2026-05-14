// app/agent/[agentId]/_components/ApiAgentSettings.tsx
'use client'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { FileJson, Plus, Trash2, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiAgentSettingsProps {
  selectedNode?: any;
  updatedFormData?: (data: any) => void;
}

const ApiAgentSettings = ({ selectedNode, updatedFormData }: ApiAgentSettingsProps) => {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET',
    url: '',
    apiKey: '',
    includeApiKey: false,
    apiKeyLocation: 'query',
    apiKeyParamName: 'access_key',
    queryParams: [] as Array<{name: string, value: string, description: string, isDynamic: boolean}>,
    headerParams: [] as Array<{name: string, value: string, description: string}>,
    bodyParams: '',
  });

  useEffect(() => {
    if (selectedNode && selectedNode?.data?.settings) {
      setFormData({
        ...selectedNode.data.settings,
        queryParams: selectedNode.data.settings.queryParams || [],
        headerParams: selectedNode.data.settings.headerParams || [],
      });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const addQueryParam = () => {
    setFormData(prev => ({
      ...prev,
      queryParams: [...prev.queryParams, { name: '', value: '', description: '', isDynamic: false }]
    }));
  };

  const updateQueryParam = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      queryParams: prev.queryParams.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const removeQueryParam = (index: number) => {
    setFormData(prev => ({
      ...prev,
      queryParams: prev.queryParams.filter((_, i) => i !== index)
    }));
  };

  const addHeaderParam = () => {
    setFormData(prev => ({
      ...prev,
      headerParams: [...prev.headerParams, { name: '', value: '', description: '' }]
    }));
  };

  const updateHeaderParam = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      headerParams: prev.headerParams.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const removeHeaderParam = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headerParams: prev.headerParams.filter((_, i) => i !== index)
    }));
  };

  const onSave = () => {
    if (!formData.name) {
      toast.error('Please enter a name for the API');
      return;
    }
    if (!formData.url) {
      toast.error('Please enter the API URL');
      return;
    }

    console.log('Saving API settings:', formData);
    if (updatedFormData) {
      updatedFormData(formData);
      toast.success("API Agent Settings Updated!");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className='text-lg font-semibold'>API Agent</h2>
        <p className='text-gray-500 text-sm mt-1'>
          Configure external API endpoint with custom parameters
        </p>
      </div>

      {/* Scrollable Content - Use max-h with specific value */}
      <div className="overflow-y-auto space-y-4 py-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {/* Name */}
        <div className='space-y-1'>
          <Label>API Name</Label>
          <Input
            placeholder='Weather API'
            value={formData?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        {/* Method */}
        <div className='space-y-1'>
          <Label>Request Method</Label>
          <Select
            value={formData?.method}
            onValueChange={(value) => handleChange('method', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URL */}
        <div className='space-y-1'>
          <Label>Base API URL</Label>
          <Input
            placeholder='https://api.weatherstack.com/current'
            value={formData?.url}
            onChange={(e) => handleChange('url', e.target.value)}
          />
          <p className='text-xs text-gray-500 flex items-center gap-1'>
            <Info className='h-3 w-3' />
            Don't include query parameters in the URL - add them below
          </p>
        </div>

        {/* API Key Configuration */}
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className='flex justify-between items-center'>
            <Label className="text-base font-semibold">API Key Configuration</Label>
            <Switch
              checked={formData?.includeApiKey}
              onCheckedChange={(checked) => handleChange('includeApiKey', checked)}
            />
          </div>

          {formData?.includeApiKey && (
            <>
              <div className='space-y-1'>
                <Label>API Key</Label>
                <Input
                  type='password'
                  placeholder='Enter your API key'
                  value={formData?.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                />
              </div>

              <div className='space-y-1'>
                <Label>API Key Parameter Name</Label>
                <Input
                  placeholder='access_key'
                  value={formData?.apiKeyParamName}
                  onChange={(e) => handleChange('apiKeyParamName', e.target.value)}
                />
                <p className='text-xs text-gray-500'>
                  What the API calls the key (e.g., "access_key", "apiKey", "key", "appid")
                </p>
              </div>

              <div className='space-y-1'>
                <Label>Where to send API Key</Label>
                <Select
                  value={formData?.apiKeyLocation}
                  onValueChange={(value) => handleChange('apiKeyLocation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="query">Query Parameter</SelectItem>
                    <SelectItem value="header">Authorization Header</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-xs text-gray-500'>
                  {formData.apiKeyLocation === 'query' && `Will send as ?${formData.apiKeyParamName}=YOUR_KEY`}
                  {formData.apiKeyLocation === 'header' && 'Will send as Authorization: Bearer YOUR_KEY'}
                  {formData.apiKeyLocation === 'both' && 'Will send in both query and header'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Query Parameters */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className='flex justify-between items-center'>
            <div>
              <Label className="text-base font-semibold">Query Parameters</Label>
              <p className='text-xs text-gray-500 mt-1'>
                Define parameters that will be added to the URL
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addQueryParam}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add
            </Button>
          </div>

          {formData.queryParams.length === 0 ? (
            <div className='text-center py-4 text-gray-500 text-sm border-2 border-dashed rounded-lg'>
              No query parameters defined. Click "Add" to create one.
            </div>
          ) : (
            <div className='space-y-3'>
              {formData.queryParams.map((param, index) => (
                <div key={index} className='border rounded-lg p-3 space-y-2 bg-white'>
                  <div className='flex gap-2'>
                    <div className='flex-1 space-y-1'>
                      <Label className="text-xs">Parameter Name</Label>
                      <Input
                        placeholder='query'
                        value={param.name}
                        onChange={(e) => updateQueryParam(index, 'name', e.target.value)}
                        className='h-8'
                      />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <Label className="text-xs">Value / Variable</Label>
                      <Input
                        placeholder='{city}'
                        value={param.value}
                        onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                        className='h-8'
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQueryParam(index)}
                      className='mt-5 h-8 w-8'
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                  <div className='space-y-1'>
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder='City name for weather lookup'
                      value={param.description}
                      onChange={(e) => updateQueryParam(index, 'description', e.target.value)}
                      className='h-8'
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={param.isDynamic}
                      onCheckedChange={(checked) => updateQueryParam(index, 'isDynamic', checked)}
                    />
                    <Label className="text-xs text-gray-600">
                      Dynamic parameter (will be extracted by AI from user input)
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1'>
            <p className='font-semibold text-blue-900'>💡 Tips:</p>
            <ul className='list-disc list-inside space-y-1 text-blue-800'>
              <li>Use <code className='bg-blue-100 px-1 rounded'>{'{variableName}'}</code> for dynamic values</li>
              <li>For static values, just enter the value directly</li>
              <li>Mark as "Dynamic" if the AI should extract this from user input</li>
            </ul>
          </div>
        </div>

        {/* Header Parameters */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className='flex justify-between items-center'>
            <div>
              <Label className="text-base font-semibold">Custom Headers</Label>
              <p className='text-xs text-gray-500 mt-1'>
                Additional headers to send with the request
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addHeaderParam}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add
            </Button>
          </div>

          {formData.headerParams.length === 0 ? (
            <div className='text-center py-4 text-gray-500 text-sm border-2 border-dashed rounded-lg'>
              No custom headers defined.
            </div>
          ) : (
            <div className='space-y-2'>
              {formData.headerParams.map((param, index) => (
                <div key={index} className='flex gap-2 items-end'>
                  <div className='flex-1 space-y-1'>
                    <Label className="text-xs">Header Name</Label>
                    <Input
                      placeholder='Content-Type'
                      value={param.name}
                      onChange={(e) => updateHeaderParam(index, 'name', e.target.value)}
                      className='h-8'
                    />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <Label className="text-xs">Value</Label>
                    <Input
                      placeholder='application/json'
                      value={param.value}
                      onChange={(e) => updateHeaderParam(index, 'value', e.target.value)}
                      className='h-8'
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHeaderParam(index)}
                    className='h-8 w-8'
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body Params (Only for POST) */}
        {formData?.method === 'POST' && (
          <div className="border rounded-lg p-4 space-y-3">
            <Label className="text-base font-semibold">Request Body (JSON)</Label>
            <Textarea
              placeholder='{\n  "param1": "value1",\n  "param2": "{dynamicValue}"\n}'
              value={formData?.bodyParams}
              onChange={(e) => handleChange('bodyParams', e.target.value)}
              rows={6}
            />
            <p className='text-xs text-gray-500 flex gap-2 items-center'>
              <FileJson className='h-3 w-3' />
              Use <code className='bg-gray-100 px-1 rounded'>{'{variableName}'}</code> for dynamic values
            </p>
          </div>
        )}

        {/* Preview */}
        <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
          <Label className="text-base font-semibold">Request Preview</Label>
          <div className='text-xs font-mono bg-white p-3 rounded border space-y-2'>
            <div>
              <span className='text-blue-600 font-bold'>{formData.method}</span>{' '}
              <span className='text-green-600'>{formData.url || 'https://api.example.com/endpoint'}</span>
            </div>
            
            {formData.queryParams.length > 0 && (
              <div className='pl-4 space-y-1'>
                <div className='text-gray-500'>Query Params:</div>
                {formData.queryParams.map((param, i) => (
                  <div key={i} className='text-purple-600'>
                    ?{param.name}={param.value || '{value}'}
                  </div>
                ))}
              </div>
            )}

            {formData.includeApiKey && (
              <div className='pl-4 space-y-1'>
                <div className='text-gray-500'>API Key:</div>
                <div className='text-orange-600'>
                  {formData.apiKeyLocation === 'query' && `?${formData.apiKeyParamName}=***`}
                  {formData.apiKeyLocation === 'header' && 'Authorization: Bearer ***'}
                  {formData.apiKeyLocation === 'both' && `Both query (?${formData.apiKeyParamName}=***) and header`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t">
        <Button className='w-full' onClick={onSave}>
          Save API Configuration
        </Button>
      </div>
    </>
  );
};

export default ApiAgentSettings;