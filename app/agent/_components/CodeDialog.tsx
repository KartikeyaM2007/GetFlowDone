// app/agent/_components/CodeDialog.tsx
'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Copy, Check, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

type Props = {
  isOpen: boolean
  onClose: () => void
  agentId: string
}

type Language = 'typescript' | 'javascript' | 'fetch'

function CodeDialog({ isOpen, onClose, agentId }: Props) {
  const [copied, setCopied] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('typescript')
  const { user } = useUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const userId = user?.id || 'your-user-id'

  const codeTemplates = {
    typescript: `// Install axios if not already installed
// npm install axios

import axios from 'axios';

async function getAgentConfig() {
  try {
    const response = await axios.post('${baseUrl}/api/agent/publish', {
      userId: '${userId}',
      agentId: '${agentId}'
    });
    
    const { agentToolConfig } = response.data;
    
    // Use the config to initialize your agent
    return agentToolConfig;
  } catch (error) {
    console.error('Failed to fetch agent config:', error);
    throw error;
  }
}

// Usage
getAgentConfig().then(config => {
  console.log('Agent loaded successfully!');
});`,

    javascript: `// Install axios if not already installed
// npm install axios

const axios = require('axios');

async function getAgentConfig() {
  try {
    const response = await axios.post('${baseUrl}/api/agent/publish', {
      userId: '${userId}',
      agentId: '${agentId}'
    });
    
    const { agentToolConfig } = response.data;
    
    // Use the config to initialize your agent
    return agentToolConfig;
  } catch (error) {
    console.error('Failed to fetch agent config:', error);
    throw error;
  }
}

// Usage
getAgentConfig().then(config => {
  console.log('Agent loaded successfully!');
});`,

    fetch: `// Using native fetch API (no installation required)

async function getAgentConfig() {
  try {
    const response = await fetch('${baseUrl}/api/agent/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '${userId}',
        agentId: '${agentId}'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch agent config');
    }
    
    const { agentToolConfig } = await response.json();
    
    return agentToolConfig;
  } catch (error) {
    console.error('Failed to fetch agent config:', error);
    throw error;
  }
}

// Usage
getAgentConfig().then(config => {
  console.log('Agent loaded successfully!');
});`
  }

  const languageLabels = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    fetch: 'Fetch API'
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeTemplates[selectedLanguage])
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang)
    setShowLanguageDialog(false)
  }

  return (
    <>
      <Dialog open={isOpen && !showLanguageDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[700px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Integrate Agent in Your Project</DialogTitle>
            <DialogDescription>
              Copy this code to integrate the agent into your application
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-2 pb-3 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLanguageDialog(true)}
              className="gap-2"
            >
              <Code2 className="h-4 w-4" />
              {languageLabels[selectedLanguage]}
            </Button>
            
            <Button
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          
          <div className="flex-1 overflow-hidden">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg h-full overflow-auto">
              <code className="text-sm font-mono whitespace-pre">
                {codeTemplates[selectedLanguage]}
              </code>
            </pre>
          </div>

          </DialogContent>
      </Dialog>

      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Language</DialogTitle>
            <DialogDescription>
              Select the code format you prefer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {(Object.keys(codeTemplates) as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleLanguageChange(lang)}
              >
                <div className="font-semibold">{languageLabels[lang]}</div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CodeDialog