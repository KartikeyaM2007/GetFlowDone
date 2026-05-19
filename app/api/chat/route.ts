// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createChatSession } from "@/config/GeminiModel";
import axios from 'axios';

const actionWords = [
  'fetch', 'find', 'search', 'send', 'email', 'export', 'download', 'generate',
  'create', 'summarize', 'analyze', 'tailor', 'rewrite', 'optimize', 'run', 'get'
];

function looksActionable(message: string) {
  const normalized = String(message || '').toLowerCase();
  return actionWords.some((word) => normalized.includes(word));
}

function inferToolParams(tool: any, message: string) {
  const inferredParams: Record<string, string> = {};

  Object.keys(tool?.parameters || {}).forEach((key) => {
    inferredParams[key] = message;
  });

  (tool?.queryParams || []).forEach((param: any) => {
    const placeholder = String(param?.value || '').match(/\{([A-Za-z0-9_.-]+)\}/)?.[1];
    if (param?.isDynamic && placeholder && !inferredParams[placeholder]) {
      inferredParams[placeholder] = message;
    }
  });

  const bodyPlaceholders = String(tool?.bodyParams || '').match(/\{([A-Za-z0-9_.-]+)\}/g) || [];
  bodyPlaceholders.forEach((match) => {
    const key = match.slice(1, -1);
    if (!inferredParams[key]) {
      inferredParams[key] = message;
    }
  });

  if (Object.keys(inferredParams).length === 0) {
    inferredParams.input = message;
    inferredParams.query = message;
    inferredParams.topic = message;
    inferredParams.location = message;
  }

  return inferredParams;
}

function parseToolCall(text: string) {
  try {
    let cleanedResponse = String(text || '').trim();
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedResponse);
    return parsed?.useTool ? parsed : null;
  } catch {
    return null;
  }
}

async function executeWorkflowTool(tool: any, parameters: Record<string, string>) {
  const toolResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/execute-tool`, {
    tool,
    params: parameters
  });

  return toolResponse.data;
}

function findWorkflowTool(agentConfig: any, toolCall: any) {
  let tool = agentConfig.tools?.find((t: any) => t.id === toolCall.toolId);
  if (!tool && toolCall.toolName) {
    tool = agentConfig.tools?.find((t: any) => t.name === toolCall.toolName);
  }
  return tool;
}

function rawToolResponse(toolName: string, toolResult: any) {
  if (!toolResult?.success) {
    return `Tool execution failed: ${toolResult?.error || 'Unknown error'}`;
  }

  const fallbackNote = toolResult.fallback
    ? `\n\nFallback mode: ${toolResult.fallback}.`
    : '';

  return `Workflow tool "${toolName}" executed successfully.${fallbackNote}\n\nRaw node output:\n\`\`\`json\n${JSON.stringify(toolResult.data, null, 2)}\n\`\`\``;
}

async function formatToolResult(chat: any, tool: any, toolResult: any, userMessage: string) {
  try {
    const finalResult = await chat.sendMessage(
      `The workflow tool "${tool.name}" returned this data: ${JSON.stringify(toolResult.data, null, 2)}.\n\nUser request: ${userMessage}\n\nIf another available tool must run next, respond only with the JSON tool block for that next tool. Otherwise provide a helpful natural language response. If this was a sandbox fallback, clearly say it was prepared locally and not actually delivered.`
    );
    const finalResponse = await finalResult.response;
    return finalResponse.text();
  } catch (finalError: any) {
    console.error('Gemini formatting failed, fallback to raw output:', finalError);
    return rawToolResponse(tool.name, toolResult);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, agentId, agentConfig, conversationHistory } = await req.json();

    console.log(' New message:', message);
    console.log('Agent config:', agentConfig);

    if (!agentConfig) {
      return NextResponse.json(
        { error: 'Agent configuration not found. Please reload the agent.' },
        { status: 400 }
      );
    }

    const primaryAgent = agentConfig.agents?.find((a: any) => 
      a.name === agentConfig.primaryAgentName
    ) || agentConfig.agents?.[0];

    if (!primaryAgent) {
      return NextResponse.json(
        { error: 'No agent found in configuration' },
        { status: 400 }
      );
    }

    const chat = createChatSession(conversationHistory || []);

    let fullInstruction = `${agentConfig.systemPrompt}\n\n${primaryAgent.instruction}`;

    if (agentConfig.tools && agentConfig.tools.length > 0) {
      fullInstruction += '\n\n=== AVAILABLE TOOLS ===\n';
      agentConfig.tools.forEach((tool: any) => {
        fullInstruction += `\nTool ID: "${tool.id}"\n`;
        fullInstruction += `Tool Name: "${tool.name}"\n`;
        fullInstruction += `Description: ${tool.description}\n`;
        fullInstruction += `Method: ${tool.method}\n`;
        fullInstruction += `Parameters: ${JSON.stringify(tool.parameters)}\n`;
        fullInstruction += `---\n`;
      });
      fullInstruction += '\n\n=== IMPORTANT INSTRUCTIONS (READ CAREFULLY) ===\n';
      fullInstruction += 'CRITICAL BEHAVIOR RULES:\n';
      fullInstruction += '1. YOU ARE NOT A GENERIC CHATBOT. You are the Execution Gate for an active workflow node graph.\n';
      fullInstruction += '2. DO NOT SAY "Give me a moment to process", "Wait while I do this", or make polite stalling statements. You cannot "wait" or run code in the background!\n';
      fullInstruction += '3. IF THE USER ASKS FOR ANY ACTION (fetch, analyze, email, export, tailor, optimize) WHICH A TOOL BELOW CAN PROVIDE, YOU MUST IMMEDIATELY AND EXCLUSIVELY RESPOND WITH THE JSON TOOL BLOCK.\n';
      fullInstruction += '4. You MUST output ONLY raw JSON, with absolutely no conversational pre-text, no markdown enclosures, and no concluding remarks.\n\n';
      fullInstruction += 'JSON EXECUTION FORMAT:\n';
      fullInstruction += '{\n';
      fullInstruction += '  "useTool": true,\n';
      fullInstruction += '  "toolId": "exact-tool-id-from-above",\n';
      fullInstruction += '  "parameters": {"paramName": "value"},\n';
      fullInstruction += '  "reasoning": "why you need this tool"\n';
      fullInstruction += '}\n\n';
      fullInstruction += 'CRITICAL: Use the exact Tool ID. Match the required parameters explicitly.\n\n';
    }

    fullInstruction += '\nIf the user is only greeting you or asking a generic conceptual question where no action/tool is relevant, only then respond naturally to assist them.\n';

    console.log(' Full instruction:', fullInstruction);

    let agentResponse = "";
    try {
      const result = await chat.sendMessage(fullInstruction + '\n\nUser message: ' + message);
      const response = await result.response;
      agentResponse = response.text();
    } catch (geminiError: any) {
      console.error('Upstream Gemini Error:', geminiError);

      const fallbackTool = looksActionable(message) ? agentConfig.tools?.[0] : null;
      if (fallbackTool) {
        try {
          const inferredParams = inferToolParams(fallbackTool, message);
          const toolResult = await executeWorkflowTool(fallbackTool, inferredParams);

          return NextResponse.json({
            response: rawToolResponse(fallbackTool.name, toolResult),
            toolResult,
            timestamp: Date.now()
          });
        } catch (fallbackError: any) {
          console.error('Deterministic fallback execution failed:', fallbackError);
        }
      }
      
      // Handle specific safety blocks or missing text
      if (geminiError.message?.includes('SAFETY') || geminiError.message?.includes('blocked')) {
        return NextResponse.json({
          response: "Upstream security alert: The AI model's content safety filter was triggered. Please rephrase your prompt to comply with safety policies.",
          toolResult: null,
          timestamp: Date.now()
        });
      }

      return NextResponse.json({
        response: `Gemini AI orchestration failed: ${geminiError.message || 'Unknown model response error.'}. Please verify your workspace limits and prompt structure.`,
        toolResult: null,
        timestamp: Date.now()
      });
    }

    console.log(' Raw agent response:', agentResponse);

    let toolResult = null;
    let usedTool = false;

    try {
      const parsed = parseToolCall(agentResponse);
      if (!parsed) {
        throw new Error('No tool call JSON found');
      }
      console.log(' Parsed tool call:', parsed);

      if (parsed.useTool) {
        usedTool = true;
        console.log(' Agent wants to use tool');

        const tool = findWorkflowTool(agentConfig, parsed);
        
        if (!tool) {
          console.error(' Tool not found:', parsed.toolId || parsed.toolName);
          console.log('Available tools:', agentConfig.tools?.map((t: any) => ({ id: t.id, name: t.name })));
          agentResponse = `I tried to use a tool (${parsed.toolId || parsed.toolName}), but it's not available. Available tools are: ${agentConfig.tools?.map((t: any) => t.name).join(', ')}`;
        } else {
          console.log('Found tool:', tool.name);
          console.log('Calling tool with params:', parsed.parameters);

          try {
            toolResult = await executeWorkflowTool(tool, parsed.parameters || {});
            console.log('Tool execution result:', toolResult);

            if (!toolResult.success) {
              agentResponse = `Tool execution failed: ${toolResult.error || 'Unknown error'}`;
            } else {
              let shouldProceed = true;
              let conditionMessage = '';

              if (agentConfig.conditions && agentConfig.conditions.length > 0) {
                for (const condition of agentConfig.conditions) {
                  try {
                    const extractedData = parsed.parameters;
                    const conditionFunc = new Function('data', `return ${condition.condition}`);
                    const conditionResult = conditionFunc(extractedData);
                    
                    console.log(`   Expression: ${condition.condition}`);
                    console.log(`   Result: ${conditionResult}`);
                    
                    if (!conditionResult) {
                      shouldProceed = false;
                      conditionMessage = condition.description;
                      break;
                    }
                  } catch (e) {
                    console.error(' Error evaluating condition:', e);
                  }
                }
              }

              if (!shouldProceed) {
                agentResponse = `I cannot proceed because the condition is not met: ${conditionMessage}`;
              } else {
               
                agentResponse = await formatToolResult(chat, tool, toolResult, message);
                console.log('Final formatted response:', agentResponse);

                const chainedToolCall = parseToolCall(agentResponse);
                if (chainedToolCall) {
                  const chainedTool = findWorkflowTool(agentConfig, chainedToolCall);
                  if (chainedTool) {
                    console.log('Executing chained workflow tool:', chainedTool.name);
                    const chainedParams = {
                      ...(parsed.parameters || {}),
                      ...(chainedToolCall.parameters || {}),
                    };
                    toolResult = await executeWorkflowTool(chainedTool, chainedParams);
                    agentResponse = toolResult.success
                      ? await formatToolResult(chat, chainedTool, toolResult, message)
                      : rawToolResponse(chainedTool.name, toolResult);
                  }
                }
              }
            }
          } catch (toolError: any) {
            console.error('Tool execution error:', toolError);
            agentResponse = `Failed to execute the tool: ${toolError.message}. Please check the API configuration.`;
          }
        }
      }
    } catch (parseError) {
      console.log(' Regular response (not a tool call)');
      if (usedTool) {
        console.error(' JSON parsing failed for tool call:', parseError);
        console.error('Response was:', agentResponse);
      }

      const fallbackTool = looksActionable(message) ? agentConfig.tools?.[0] : null;

      if (fallbackTool) {
        try {
          const inferredParams = inferToolParams(fallbackTool, message);
          toolResult = await executeWorkflowTool(fallbackTool, inferredParams);

          if (toolResult.success) {
            try {
              const finalResult = await chat.sendMessage(
                `The workflow tool "${fallbackTool.name}" ran with this result: ${JSON.stringify(toolResult.data, null, 2)}.\n\nAnswer the user's request directly and clearly. If this was a sandbox fallback, say what was prepared or simulated and why.`
              );
              const finalResponse = await finalResult.response;
              agentResponse = finalResponse.text();
            } catch (formatError) {
              console.error('Fallback formatting failed:', formatError);
              agentResponse = rawToolResponse(fallbackTool.name, toolResult);
            }
          } else {
            agentResponse = rawToolResponse(fallbackTool.name, toolResult);
          }
        } catch (fallbackError) {
          console.error('Fallback tool execution failed:', fallbackError);
        }
      }
    }

    return NextResponse.json({
      response: agentResponse,
      toolResult: toolResult,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error(' Chat error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
