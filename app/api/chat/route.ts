// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createChatSession } from "@/config/GeminiModel";
import axios from 'axios';

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
      
      fullInstruction += '\n\n=== IMPORTANT INSTRUCTIONS ===\n';
      fullInstruction += 'When you need to use a tool, respond with ONLY this JSON format (no other text):\n';
      fullInstruction += '{\n';
      fullInstruction += '  "useTool": true,\n';
      fullInstruction += '  "toolId": "exact-tool-id-from-above",\n';
      fullInstruction += '  "parameters": {"paramName": "value"},\n';
      fullInstruction += '  "reasoning": "why you need this tool"\n';
      fullInstruction += '}\n\n';
      fullInstruction += 'CRITICAL: Use the exact Tool ID, not the Tool Name!\n';
      fullInstruction += 'CRITICAL: Match parameter names exactly as specified!\n\n';
    }

    fullInstruction += '\nIf you don\'t need a tool, respond naturally to help the user.\n';

    console.log(' Full instruction:', fullInstruction);

    const result = await chat.sendMessage(fullInstruction + '\n\nUser message: ' + message);
    const response = await result.response;
    let agentResponse = response.text();

    console.log(' Raw agent response:', agentResponse);

    let toolResult = null;
    let usedTool = false;

    try {
      let cleanedResponse = agentResponse.trim();
      
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }

      const parsed = JSON.parse(cleanedResponse);
      console.log(' Parsed tool call:', parsed);

      if (parsed.useTool) {
        usedTool = true;
        console.log(' Agent wants to use tool');

        let tool = agentConfig.tools?.find((t: any) => t.id === parsed.toolId);
        if (!tool && parsed.toolName) {
          tool = agentConfig.tools?.find((t: any) => t.name === parsed.toolName);
          console.log(' Found tool by name instead of ID');
        }
        
        if (!tool) {
          console.error(' Tool not found:', parsed.toolId || parsed.toolName);
          console.log('Available tools:', agentConfig.tools?.map((t: any) => ({ id: t.id, name: t.name })));
          agentResponse = `I tried to use a tool (${parsed.toolId || parsed.toolName}), but it's not available. Available tools are: ${agentConfig.tools?.map((t: any) => t.name).join(', ')}`;
        } else {
          console.log('Found tool:', tool.name);
          console.log('Calling tool with params:', parsed.parameters);

          try {
            const toolResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/execute-tool`, {
              tool: tool,
              params: parsed.parameters
            });

            toolResult = toolResponse.data;
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
               
                const finalResult = await chat.sendMessage(
                  `The tool "${tool.name}" returned this data: ${JSON.stringify(toolResult.data, null, 2)}.\n\nPlease provide a helpful, natural language response to the user based on this data. Format it in a friendly, conversational way and include all relevant details from the response.`
                );
                const finalResponse = await finalResult.response;
                agentResponse = finalResponse.text();
                console.log('Final formatted response:', agentResponse);
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