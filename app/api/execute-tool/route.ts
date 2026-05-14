// app/api/execute-tool/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { tool, params } = await req.json();
    
    console.log('Tool:', JSON.stringify(tool, null, 2));
    console.log('Params:', JSON.stringify(params, null, 2));

    let response;

    if (tool.method === 'GET') {
      const urlObj = new URL(tool.url);
      const headers: any = {};

      const context: any = {
        ...params,
        apiKey: tool.apiKey || ''
      };

      if (tool.includeApiKey && tool.apiKey) {
        const apiKeyParamName = tool.apiKeyParamName || 'access_key';
        
        if (tool.apiKeyLocation === 'query' || tool.apiKeyLocation === 'both') {
          urlObj.searchParams.append(apiKeyParamName, tool.apiKey);
        }
        
        if (tool.apiKeyLocation === 'header' || tool.apiKeyLocation === 'both') {
          headers['Authorization'] = `Bearer ${tool.apiKey}`;
        }
      }

      if (tool.queryParams && Array.isArray(tool.queryParams)) {
        tool.queryParams.forEach((qp: any) => {
          let value = qp.value;
          
          const matches = value.match(/\{([^}]+)\}/g);
          if (matches) {
            matches.forEach((match: string) => {
              const key = match.slice(1, -1); 
              if (context[key] !== undefined) {
                value = value.replace(match, String(context[key]));
              } else {
                console.warn(`Placeholder ${match} not found in context`);
              }
            });
          }
          
          if (!value.includes('{') && !value.includes('}')) {
            urlObj.searchParams.append(qp.name, value);
          } else {
            console.warn(`Skipping parameter ${qp.name} - contains unreplaced placeholders: ${value}`);
          }
        });
      }

      if (tool.headerParams && Array.isArray(tool.headerParams)) {
        tool.headerParams.forEach((hp: any) => {
          let headerValue = hp.value;
          
          const matches = headerValue.match(/\{([^}]+)\}/g);
          if (matches) {
            matches.forEach((match: string) => {
              const key = match.slice(1, -1);
              if (context[key] !== undefined) {
                headerValue = headerValue.replace(match, String(context[key]));
              }
            });
          }
          
          headers[hp.name] = headerValue;
        });
      }

      const finalUrl = urlObj.toString();
      console.log(' GET Request URL:', finalUrl);
      console.log(' Headers:', headers);

      response = await axios.get(finalUrl, { 
        headers,
        timeout: 15000,
        validateStatus: (status) => status < 500 
      });

    }
    
    
    else if (tool.method === 'POST') {
      const headers: any = {
        'Content-Type': 'application/json'
      };

      // Build context for placeholder
      const context: any = {
        ...params,
        apiKey: tool.apiKey || ''
      };

      if (tool.includeApiKey && tool.apiKey) {
        if (tool.apiKeyLocation === 'header' || tool.apiKeyLocation === 'both') {
          headers['Authorization'] = `Bearer ${tool.apiKey}`;
        }
        
        if (tool.apiKeyLocation === 'query' || tool.apiKeyLocation === 'both') {
          const urlObj = new URL(tool.url);
          const apiKeyParamName = tool.apiKeyParamName || 'access_key';
          urlObj.searchParams.append(apiKeyParamName, tool.apiKey);
          tool.url = urlObj.toString();
        }
      }

      if (tool.headerParams && Array.isArray(tool.headerParams)) {
        tool.headerParams.forEach((hp: any) => {
          let headerValue = hp.value;
          
          const matches = headerValue.match(/\{([^}]+)\}/g);
          if (matches) {
            matches.forEach((match: string) => {
              const key = match.slice(1, -1);
              if (context[key] !== undefined) {
                headerValue = headerValue.replace(match, String(context[key]));
              }
            });
          }
          
          headers[hp.name] = headerValue;
        });
      }

      let body: any = {};
      if (tool.bodyParams) {
        try {
          let bodyStr = tool.bodyParams;
          
          Object.entries(context).forEach(([key, value]) => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            bodyStr = bodyStr.replace(regex, String(value));
          });
          
          const unreplacedMatches = bodyStr.match(/\{([^}]+)\}/g);
          if (unreplacedMatches) {
            console.warn('Unreplaced placeholders in body:', unreplacedMatches);
          }
          
          body = JSON.parse(bodyStr);
        } catch (e) {
          console.error(' Failed to parse bodyParams:', e);
          return NextResponse.json(
            { 
              success: false,
              error: 'Invalid JSON in body parameters',
              details: 'The body template contains invalid JSON. Please check your configuration.'
            },
            { status: 400 }
          );
        }
      }

      console.log(' POST Request URL:', tool.url);
      console.log(' Headers:', headers);
      console.log(' Body:', JSON.stringify(body, null, 2));

      response = await axios.post(tool.url, body, { 
        headers,
        timeout: 15000,
        validateStatus: (status) => status < 500
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: `Unsupported HTTP method: ${tool.method}`,
          details: 'Only GET and POST methods are currently supported.'
        },
        { status: 400 }
      );
    }

    console.log(' Tool response status:', response?.status);
    console.log('Tool response data:', JSON.stringify(response?.data, null, 2));

    
    if (response.status >= 400) {
      return NextResponse.json({
        success: false,
        error: `API returned error status ${response.status}`,
        data: response.data,
        status: response.status
      });
    }

    return NextResponse.json({
      success: true,
      data: response?.data,
      status: response.status
    });

  } catch (error: any) {
    console.error('❌ ===== TOOL EXECUTION ERROR =====');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    let errorMessage = 'Failed to execute tool';
    let errorDetails = error.message;

    if (error.code === 'ENOTFOUND') {
      errorMessage = 'API endpoint not found';
      errorDetails = `Could not resolve hostname: ${error.hostname}. Please check the URL.`;
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout';
      errorDetails = 'The API did not respond within 15 seconds.';
    } else if (error.response) {
      errorMessage = `API error (${error.response.status})`;
      errorDetails = error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data);
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: errorDetails,
        status: error.response?.status || 500
      },
      { status: 500 }
    );
  }
}