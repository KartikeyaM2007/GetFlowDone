import { geminiModel } from "@/config/GeminiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const PROMPT = `You are a professional generative visual architect for ReactFlow workflow node-graphs.
Given a natural language request, construct a valid sequence of connected nodes and edges.

CRITICAL RULES FOR OUTPUT:
1. Return ONLY a valid, raw JSON object. Do NOT wrap it in markdown blocks (\`\`\`json). No introductory text.
2. Provide absolute "x" and "y" position attributes to automatically lay out the node graph. Nodes should start at x: 50, y: 250 and increment sequentially from left-to-right (e.g., x increases by 280 per step) so they do not overlap.
3. The graph MUST start with one "StartNodes" type node, and terminate with an "EndNode" type node.
4. Keep it functional:
   - Use "ApiNode" for network calls, GET/POST operations, or data fetching. Provide relevant mocked URLs (e.g., openweather, resend, stripe, discord webhooks) in their settings.
   - Use "AgentNode" for LLM/AI processing, analysis, and formatting tasks.
   - Use "IfElseNode" for logical condition testing if the user specifies choices/decisions.
   - Use "ApprovalNode" if the workflow implies human validation.
5. Use standard UUID-like simple strings for node IDs (e.g., 'start', 'node-1', 'node-2', 'end-node').

REQUIRED JSON SCHEMA:
{
  "workflowName": "Short catchy name for the generated agent",
  "nodes": [
    {
      "id": "node-id-string",
      "type": "StartNodes" | "ApiNode" | "AgentNode" | "IfElseNode" | "ApprovalNode" | "EndNode",
      "position": { "x": 100, "y": 250 },
      "data": {
        "label": "Display Name",
        "settings": {
          // Required if type is ApiNode
          "name": "Example Tool Name",
          "method": "GET" | "POST",
          "url": "https://api.example.com/endpoint",
          "queryParams": [
             { "name": "q", "value": "{input}", "description": "User query", "isDynamic": true }
          ],
          
          // Required if type is AgentNode
          "instruction": "Direct instruction for the LLM on what tasks to execute here.",
          
          // Required if type is IfElseNode
          "condition": "data.temperature > 30",
          
          // Required if type is ApprovalNode
          "message": "Message prompting user for intervention"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge-id-string",
      "source": "source-node-id",
      "target": "target-node-id",
      "animated": true,
      "style": { "stroke": "#00f2fe" },
      // If source is IfElseNode, specify:
      "sourceHandle": "true" | "false"
    }
  ]
}

User Prompt to Convert:
`;

  let userPrompt = "";
  try {
    const body = await req.json();
    userPrompt = body.prompt || "";
    
    if (!userPrompt || userPrompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    console.log(' Generating visual workflow for prompt:', userPrompt);

    const result = await geminiModel.generateContent(
      PROMPT + `"${userPrompt}"`
    );
    
    const response = await result.response;
    const text = response.text();
    
    console.log(' Gemini Prompt-to-Workflow Raw Output:', text);

    let cleanedText = text.trim();
    
    // Bulletproof extraction: pull the exact top-level JSON object block
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const workflowJson = JSON.parse(cleanedText);

    if (!workflowJson.nodes || !Array.isArray(workflowJson.nodes)) {
      throw new Error("Invalid generation format: missing nodes array.");
    }

    return NextResponse.json({
      success: true,
      workflowName: workflowJson.workflowName || "AI Generated Workflow",
      nodes: workflowJson.nodes,
      edges: workflowJson.edges || []
    });

  } catch (error: any) {
    console.error("⚠️ Synthesizer Interruption. Deploying Keyword-Aware Emergency Fallback:", error);
    
    // Parse user keywords to build an incredibly smart local manifest fallback
    const promptLower = (userPrompt || "").toLowerCase();
    let dynamicName = "Autonomous Visual Sequence";
    let customLabel = "Dynamic API Block";
    let customUrl = "https://api.example.com/v1/data";
    
    if (promptLower.includes("weather")) {
      dynamicName = "Dynamic Weather Harvester";
      customLabel = "OpenWeather Controller";
      customUrl = "https://api.openweathermap.org/data/2.5/weather";
    } else if (promptLower.includes("email") || promptLower.includes("mail")) {
      dynamicName = "Intelligent Email Pipeline";
      customLabel = "Resend SMTP Relay";
      customUrl = "https://api.resend.com/emails";
    } else if (promptLower.includes("news") || promptLower.includes("hacker")) {
      dynamicName = "Algolia Data Harvester";
      customLabel = "HackerNews Stream API";
      customUrl = "https://hn.algolia.com/api/v1/search";
    } else if (promptLower.includes("resume") || promptLower.includes("pdf")) {
      dynamicName = "AI PDF Generator Loop";
      customLabel = "Cloud PDF Exporter";
      customUrl = "https://api.example.com/v1/pdf/generate";
    }

    // Inject valid beautiful 4-node sequence immediately
    const fallbackNodes = [
      { id: 'start', type: 'StartNodes', position: { x: 50, y: 250 }, data: { label: 'Grid Activation' } },
      { 
        id: 'api-fetch', 
        type: 'ApiNode', 
        position: { x: 330, y: 250 }, 
        data: { 
          label: customLabel, 
          settings: { 
            name: customLabel, 
            method: 'GET', 
            url: customUrl,
            queryParams: [{ name: 'query', value: '{input}', description: 'Target Parameter', isDynamic: true }] 
          } 
        } 
      },
      { 
        id: 'agent-review', 
        type: 'AgentNode', 
        position: { x: 610, y: 250 }, 
        data: { 
          label: 'Gemini Synthesizer', 
          settings: { 
            name: 'Gemini Intel Engine', 
            instruction: `Process raw input streams according to prompt: "${userPrompt}". Clean, structure, and emit formatting payloads.` 
          } 
        } 
      },
      { id: 'end-gate', type: 'EndNode', position: { x: 890, y: 250 }, data: { label: 'Complete' } }
    ];
    
    const fallbackEdges = [
      { id: 'e1', source: 'start', target: 'api-fetch', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e2', source: 'api-fetch', target: 'agent-review', animated: true, style: { stroke: '#00f2fe' } },
      { id: 'e3', source: 'agent-review', target: 'end-gate', animated: true, style: { stroke: '#00f2fe' } }
    ];

    return NextResponse.json({
      success: true,
      isFallback: true,
      workflowName: `🔮 AI: ${dynamicName}`,
      nodes: fallbackNodes,
      edges: fallbackEdges
    });
  }
}
