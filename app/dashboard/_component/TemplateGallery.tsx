'use client';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { UserDetails } from '@/context/UserData';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { Id } from '@/convex/_generated/dataModel';
import { 
  Globe, 
  Mail, 
  FileText, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Bot,
  GitMerge,
  CheckCircle
} from 'lucide-react';

const PreBuiltTemplates = [
  {
    id: 'hn-scholar',
    title: 'AI Knowledge Hub Harvester',
    desc: 'Fetch real-time tech data from HackerNews API, summarize key trends via LLM, and dispatch a briefing newsletter.',
    icon: Globe,
    color: '#f97316',
    tag: 'DATA PIPELINE',
    nodes: [
      { id: 'start', type: 'StartNodes', position: { x: 50, y: 200 }, data: { label: 'Start' } },
      { 
        id: 'hn-fetch', 
        type: 'ApiNode', 
        position: { x: 300, y: 200 }, 
        data: { 
          label: 'Fetch HackerNews API', 
          settings: { 
            name: 'Algolia Search API', 
            method: 'GET', 
            url: 'https://hn.algolia.com/api/v1/search',
            queryParams: [{ name: 'query', value: 'artificial intelligence', description: 'Keyword topics', isDynamic: true }] 
          } 
        } 
      },
      { 
        id: 'gemini-rank', 
        type: 'AgentNode', 
        position: { x: 580, y: 200 }, 
        data: { 
          label: 'Summarize Lessons', 
          settings: { 
            name: 'Gemini Reviewer', 
            instruction: 'Extract the top 10 highest quality courses from the raw JSON. Format title, channel, and 1-sentence takeaway.' 
          } 
        } 
      },
      { 
        id: 'email-dispatch', 
        type: 'ApiNode', 
        position: { x: 860, y: 200 }, 
        data: { 
          label: 'Dispatch Newsletter', 
          settings: { 
            name: 'Send Email API', 
            method: 'POST', 
            url: 'https://api.resend.com/emails' 
          } 
        } 
      },
      { id: 'end-node', type: 'EndNode', position: { x: 1140, y: 200 }, data: { label: 'Delivered' } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'hn-fetch', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e2', source: 'hn-fetch', target: 'gemini-rank', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e3', source: 'gemini-rank', target: 'email-dispatch', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e4', source: 'email-dispatch', target: 'end-node', animated: true, style: { stroke: '#00f2fe' } },
    ]
  },
  {
    id: 'inbox-defender',
    title: 'Smart Automated Inbox Responder',
    desc: 'Analyzes support emails via LLM. High confidence drafts are auto-sent; ambiguous inquiries trigger Human Approval.',
    icon: Mail,
    color: '#eab308',
    tag: 'AUTONOMOUS OPS',
    nodes: [
      { id: 'start', type: 'StartNodes', position: { x: 50, y: 250 }, data: { label: 'Start' } },
      { 
        id: 'llm-draft', 
        type: 'AgentNode', 
        position: { x: 280, y: 250 }, 
        data: { 
          label: 'Draft Response', 
          settings: { 
            name: 'Inbox Assistant', 
            instruction: 'Analyze tone and construct a premium resolution draft. Output confidence score.' 
          } 
        } 
      },
      { 
        id: 'logic-gate', 
        type: 'IfElseNode', 
        position: { x: 560, y: 250 }, 
        data: { 
          label: 'Check Conf > 90%', 
          settings: { condition: 'confidence >= 0.90' } 
        } 
      },
      // Auto Dispatch Route (TRUE)
      { id: 'auto-send', type: 'ApiNode', position: { x: 840, y: 100 }, data: { label: 'Auto Resend API', settings: { method: 'POST' } } },
      { id: 'end-true', type: 'EndNode', position: { x: 1120, y: 100 }, data: { label: 'Auto Replied' } },
      // Human Review Route (FALSE)
      { id: 'human-verify', type: 'ApprovalNode', position: { x: 840, y: 400 }, data: { label: 'Review Needed', settings: { name: 'Human Manager', message: 'Review draft before dispatching.' } } },
      { id: 'manual-send', type: 'ApiNode', position: { x: 1120, y: 400 }, data: { label: 'Deliver Approved', settings: { method: 'POST' } } },
      { id: 'end-false', type: 'EndNode', position: { x: 1400, y: 400 }, data: { label: 'Manually Replied' } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'llm-draft', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e2', source: 'llm-draft', target: 'logic-gate', animated: true, style: { stroke: '#00f2fe' } },
      // True Path
      { id: 'e-true', source: 'logic-gate', sourceHandle: 'true', target: 'auto-send', animated: true, style: { stroke: '#22c55e' } },
      { id: 'e-t-end', source: 'auto-send', target: 'end-true', animated: true, style: { stroke: '#00f2fe' } },
      // False Path
      { id: 'e-false', source: 'logic-gate', sourceHandle: 'false', target: 'human-verify', animated: true, style: { stroke: '#ef4444' } },
      { id: 'e-f-rev', source: 'human-verify', target: 'manual-send', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e-f-end', source: 'manual-send', target: 'end-false', animated: true, style: { stroke: '#00f2fe' } },
    ]
  },
  {
    id: 'resume-tailor',
    title: 'Resume Auto-Tailor & Exporter',
    desc: 'Submit a Job Description, automatically rewrite experience bullets to match JD keywords, and trigger a PDF download.',
    icon: FileText,
    color: '#3b82f6',
    tag: 'PRODUCTIVITY',
    nodes: [
      { id: 'start', type: 'StartNodes', position: { x: 50, y: 200 }, data: { label: 'Start' } },
      { 
        id: 'jd-scan', 
        type: 'AgentNode', 
        position: { x: 300, y: 200 }, 
        data: { 
          label: 'Scan JD Keywords', 
          settings: { 
            name: 'Skill Scanner', 
            instruction: 'Review JD and list core technical keywords, tools, and required experience levels.' 
          } 
        } 
      },
      { 
        id: 'cv-rewrite', 
        type: 'AgentNode', 
        position: { x: 580, y: 200 }, 
        data: { 
          label: 'Rewrite CV Points', 
          settings: { 
            name: 'CV Optimizer', 
            instruction: 'Rephrase bullet points on user resume using the extracted keywords to maximize ATS scores.' 
          } 
        } 
      },
      { 
        id: 'pdf-gen', 
        type: 'ApiNode', 
        position: { x: 860, y: 200 }, 
        data: { 
          label: 'PDF Generation REST', 
          settings: { 
            name: 'CV Exporter API', 
            method: 'POST', 
            url: 'https://api.resume-generator.com/v1/build' 
          } 
        } 
      },
      { id: 'end-node', type: 'EndNode', position: { x: 1140, y: 200 }, data: { label: 'Ready to Download' } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'jd-scan', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e2', source: 'jd-scan', target: 'cv-rewrite', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e3', source: 'cv-rewrite', target: 'pdf-gen', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e4', source: 'pdf-gen', target: 'end-node', animated: true, style: { stroke: '#00f2fe' } },
    ]
  }
];

export default function TemplateGallery() {
  const route = useRouter();
  const [provisioningId, setProvisioningId] = useState<string | null>(null);
  
  const { userDetails } = useContext(UserDetails);
  const CreateAgentMutation = useMutation(api.agent.createAgent);
  const UpdateDetailsMutation = useMutation(api.agent.UpdateDetails);
  const { has } = useAuth();
  
  const hasPremiumAccess = has && has({ plan: "unlimited_plan" });
  
  const userAgents = useQuery(api.agent.GetUserAgents, 
    userDetails?._id ? { userId: userDetails._id as Id<"UserTable"> } : "skip"
  );

  const provisionFromTemplate = async (template: typeof PreBuiltTemplates[0]) => {
    const currentAgentCount = userAgents?.length || 0;

    if (!hasPremiumAccess && currentAgentCount >= 20) {
      toast.error("Free plan limit reached (20 Workspaces). Please upgrade to Premium!");
      return;
    }

    if (!userDetails?._id) {
      toast.error("Establishing connection... retry in a moment.");
      return;
    }

    setProvisioningId(template.id);
    const agentId = uuidv4();

    try {
      // Phase 1: Provision active agent registry wrapper
      const _id = await CreateAgentMutation({
        agentId: agentId,
        name: `[TEMPLATE] ${template.title}`,
        userId: userDetails._id
      });

      // Phase 2: Populate static layout vectors to database
      if (_id) {
        await UpdateDetailsMutation({
          id: _id,
          nodes: template.nodes,
          edges: template.edges
        });
      }

      toast.success(`Workspace generated from ${template.title}! Opening Canvas...`);
      
      // Phase 3: Fast redirect
      setTimeout(() => {
        route.push('/agent/' + agentId);
      }, 800);

    } catch (error) {
      console.error("Template installation failed:", error);
      toast.error("Error loading predefined blueprints into database.");
      setProvisioningId(null);
    }
  };

  return (
    <div className="w-full pb-20 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-black text-white tracking-tight mb-1 uppercase">
          AI Blueprints Gallery
        </h2>
        <p className="text-sm text-gray-400">
          Provision fully connected interactive agent workspaces in under a second.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {PreBuiltTemplates.map((t) => {
          const isDeploying = provisioningId === t.id;
          return (
            <div 
              key={t.id}
              className="glass-cyber p-6 rounded-2xl border border-white/10 hover:border-[#00f2fe]/30 flex flex-col justify-between relative overflow-hidden h-[280px] group shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300"
            >
              {/* Glowing corner backing */}
              <div 
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-15 transition-all duration-500"
                style={{ backgroundColor: t.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="text-[9px] font-mono font-black uppercase tracking-[0.15em] border border-transparent bg-white/5 px-2.5 py-1 rounded-full text-gray-300"
                    style={{ borderColor: t.color + '25', color: t.color }}
                  >
                    {t.tag}
                  </span>
                  <t.icon className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-all" style={{ color: t.color }} />
                </div>

                <h3 className="text-base font-black tracking-wide text-white group-hover:text-[#00f2fe] transition-colors mb-2 leading-tight">
                  {t.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 pr-2">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                {/* Micro Node Counter Visual */}
                <div className="flex items-center gap-1.5 opacity-60">
                  <GitMerge className="h-3.5 w-3.5 text-[#00f2fe]" />
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {t.nodes.length} Nodes
                  </span>
                </div>

                <button
                  onClick={() => provisionFromTemplate(t)}
                  disabled={provisioningId !== null}
                  className="flex items-center gap-2 text-[11px] font-black font-mono uppercase tracking-wider text-[#00f2fe] bg-[#00f2fe]/5 hover:bg-[#00f2fe]/15 border border-[#00f2fe]/20 hover:border-[#00f2fe]/60 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      Use Blueprint
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
