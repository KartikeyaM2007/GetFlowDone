// app/api/generate-agent/route.ts
import { geminiModel } from "@/config/GeminiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const PROMPT = `From this workflow configuration, generate an agent instruction prompt with all details along with tools and settings in JSON format.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no extra text.

CRITICAL RULES FOR TOOLS:
1. Use the EXACT node ID as the tool ID (e.g., "api-1769370512644")
2. Preserve ALL configuration from the workflow including queryParams, headerParams, apiKeyLocation, etc.
3. Extract ONLY the dynamic parameters (where isDynamic=true) for the "parameters" field - this tells the AI what to extract from user input
4. Keep the full queryParams and headerParams arrays intact - they contain the complete API configuration
5. DO NOT add any conditions or restrictions that are NOT explicitly defined in the workflow
6. DO NOT assume any country restrictions or validation rules unless explicitly configured

HOW TO HANDLE QUERY PARAMETERS:
- The workflow contains a "queryParams" array with parameter definitions
- Each parameter has: name, value, description, isDynamic
- If isDynamic=true, it means the AI should extract this value from user input
- If isDynamic=false, the value is static and will be used as-is

EXAMPLE:
If the workflow has queryParams:
[
  {name: "api_key", value: "{apiKey}", isDynamic: false, description: "API key"},
  {name: "location", value: "{location}", isDynamic: true, description: "Location to query"}
]

Then the tool config should be:
{
  "id": "api-xxx",
  "queryParams": [
    {name: "api_key", value: "{apiKey}", isDynamic: false, description: "API key"},
    {name: "location", value: "{location}", isDynamic: true, description: "Location to query"}
  ],
  "parameters": {
    "location": "string"  // ONLY the dynamic ones go here
  }
}

Required JSON structure:
{
  "systemPrompt": "Main system prompt describing the agent's overall purpose and capabilities",
  "primaryAgentName": "Name of the primary/main agent",
  "agents": [
    {
      "id": "exact-agent-node-id-from-workflow",
      "name": "Agent Name from workflow",
      "model": "gemini-2.0-flash-exp",
      "includeHistory": true,
      "instruction": "Detailed instruction for this agent based ONLY on the workflow configuration. Must be specific about:
        - What information to extract from user input based on the dynamic parameters defined
        - When to use which tool based on the workflow connections
        - How to handle conditions ONLY if IfElse nodes are present in the workflow
        - Expected output format
        IMPORTANT: Do NOT add any conditions or restrictions not present in the workflow!"
    }
  ],
  "tools": [
    {
      "id": "exact-api-node-id-from-workflow",
      "name": "Tool display name",
      "description": "Clear description of what this tool does and when to use it",
      "method": "GET" or "POST",
      "url": "base API URL without query parameters",
      "includeApiKey": true or false,
      "apiKey": "actual API key value from workflow",
      "apiKeyParamName": "parameter name for API key (e.g., 'access_key', 'apiKey', 'key')",
      "apiKeyLocation": "query" or "header" or "both",
      "queryParams": [
        {
          "name": "parameter name in API",
          "value": "static value or {variableName} placeholder",
          "description": "what this parameter does",
          "isDynamic": true or false
        }
      ],
      "headerParams": [
        {
          "name": "header name",
          "value": "header value",
          "description": "what this header does"
        }
      ],
      "bodyParams": "JSON string template for POST requests with {variable} placeholders",
      "parameters": {
        "onlyDynamicParam1": "string",
        "onlyDynamicParam2": "string"
      },
      "assignedAgent": "agent-id that uses this tool"
    }
  ],
  "conditions": [
    {
      "id": "exact-ifelse-node-id",
      "type": "IfElseNode",
      "description": "Natural language description of what this condition checks",
      "condition": "JavaScript expression using the extracted data. Use 'data.fieldName' to access extracted values. Only include if IfElseNode exists in workflow.",
      "ifBranch": "next-node-id-if-true",
      "elseBranch": "next-node-id-if-false"
    }
  ]
}

DETAILED EXAMPLES:

Example 1 - Generic GET API:
Workflow node has:
{
  "id": "api-123",
  "type": "ApiNode",
  "data": {
    "settings": {
      "name": "Data API",
      "method": "GET",
      "url": "https://api.example.com/data",
      "includeApiKey": true,
      "apiKey": "your-key-here",
      "apiKeyParamName": "api_key",
      "apiKeyLocation": "query",
      "queryParams": [
        {
          "name": "api_key",
          "value": "{apiKey}",
          "description": "API authentication key",
          "isDynamic": false
        },
        {
          "name": "query",
          "value": "{searchTerm}",
          "description": "Search term from user",
          "isDynamic": true
        }
      ]
    }
  }
}

Generated tool should be:
{
  "id": "api-123",
  "name": "Data API",
  "description": "Fetches data based on the search term provided by user",
  "method": "GET",
  "url": "https://api.example.com/data",
  "includeApiKey": true,
  "apiKey": "your-key-here",
  "apiKeyParamName": "api_key",
  "apiKeyLocation": "query",
  "queryParams": [
    {
      "name": "api_key",
      "value": "{apiKey}",
      "description": "API authentication key",
      "isDynamic": false
    },
    {
      "name": "query",
      "value": "{searchTerm}",
      "description": "Search term from user",
      "isDynamic": true
    }
  ],
  "headerParams": [],
  "parameters": {
    "searchTerm": "string"
  },
  "assignedAgent": "agent-id"
}

Example 2 - POST API with body:
Workflow node has:
{
  "id": "api-456",
  "type": "ApiNode",
  "data": {
    "settings": {
      "name": "User Creation API",
      "method": "POST",
      "url": "https://api.example.com/users",
      "includeApiKey": true,
      "apiKey": "bearer-token",
      "apiKeyLocation": "header",
      "queryParams": [],
      "headerParams": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "bodyParams": "{\n  \"name\": \"{userName}\",\n  \"email\": \"{userEmail}\"\n}"
    }
  }
}

Generated tool should be:
{
  "id": "api-456",
  "name": "User Creation API",
  "description": "Creates a new user with name and email",
  "method": "POST",
  "url": "https://api.example.com/users",
  "includeApiKey": true,
  "apiKey": "bearer-token",
  "apiKeyLocation": "header",
  "queryParams": [],
  "headerParams": [
    {
      "name": "Content-Type",
      "value": "application/json"
    }
  ],
  "bodyParams": "{\n  \"name\": \"{userName}\",\n  \"email\": \"{userEmail}\"\n}",
  "parameters": {
    "userName": "string",
    "userEmail": "string"
  },
  "assignedAgent": "agent-id"
}

AGENT INSTRUCTION GUIDELINES:
- Be very specific about what data to extract from user input based ONLY on the dynamic parameters in the workflow
- List all dynamic parameters the agent needs to extract
- Explain when and how to use each tool
- Include conditional logic ONLY if there are IfElse nodes defined in the workflow
- DO NOT add any country restrictions, validation rules, or conditions not present in the workflow
- Specify output format requirements

Example good instruction:
"You are an assistant that helps users with their queries. When a user makes a request:
1. Extract the required parameters from their message based on the tool's dynamic parameters
2. Use the appropriate tool to fetch the data
3. Format the response in a friendly, conversational way based on the returned data"

Example bad instruction:
"Get data" (too vague)

IMPORTANT: Generate instructions based SOLELY on what is configured in the workflow. Do NOT assume or add restrictions that are not explicitly defined.

Workflow to convert:
`;

  try {
    const { jsonConfig } = await req.json();
    
    console.log(' Sending to Gemini:', JSON.stringify(jsonConfig, null, 2));

    const result = await geminiModel.generateContent(
      PROMPT + JSON.stringify(jsonConfig, null, 2)
    );
    
    const response = await result.response;
    const content = response.text();
    
    console.log(' Gemini Raw Response:', content);

    let cleanedContent = content.trim();
    
    cleanedContent = cleanedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsedJson = JSON.parse(cleanedContent);
    console.log(' Parsed JSON:', JSON.stringify(parsedJson, null, 2));

    if (!parsedJson.agents || !Array.isArray(parsedJson.agents)) {
      throw new Error('Invalid response: missing agents array');
    }

    if (!parsedJson.tools || !Array.isArray(parsedJson.tools)) {
      console.warn(' No tools in generated config');
      parsedJson.tools = [];
    }

    return NextResponse.json(parsedJson);

  } catch (error: any) {
    console.error(" API Route Error:", error);
    console.error("Stack trace:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to generate agent configuration", 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}