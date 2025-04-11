import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { mockFactCheckResult } from "@/lib/api-key-check";

export async function POST(request: NextRequest) {
  console.log("OpenAI-only fact-check API called");
  
  try {
    // Parse the request body
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({
          error: "Text is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key is missing");
      return new Response(
        JSON.stringify({
          error: "OpenAI API key is missing",
          fallbackResult: mockFactCheckResult
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    console.log(`Using OpenAI API key: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);
    
    try {
      // Create a simple OpenAI client
      const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.2,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      // Create a simple prompt for fact-checking
      const prompt = `
      Please analyze the following text and identify factual claims. For each claim, determine if it's accurate or inaccurate based on your knowledge.
      
      Text to analyze: "${text}"
      
      Respond with a JSON object in the following format:
      {
        "summary": "A brief summary of the fact-check results",
        "factCheckResults": [
          {
            "claim": "The factual claim",
            "status": "ACCURATE or INACCURATE",
            "explanation": "Explanation of why the claim is accurate or inaccurate",
            "source": "Your knowledge base",
            "correction": "Correction if inaccurate, or null if accurate"
          }
        ],
        "suggestions": ["Suggestion 1", "Suggestion 2"],
        "truthScore": 0-100
      }
      
      Only include the JSON in your response, nothing else.
      `;
      
      console.log("Calling OpenAI...");
      const response = await model.invoke(prompt);
      console.log("OpenAI response received");
      
      // Extract the content from the response
      const content = response.content;
      console.log("Response content type:", typeof content);
      
      // Parse the JSON from the content
      let result;
      try {
        // If the content is a string, parse it directly
        if (typeof content === 'string') {
          result = JSON.parse(content);
        } 
        // If it's an array of message parts, join them and parse
        else if (Array.isArray(content)) {
          const joinedContent = content.map(part => 
            typeof part === 'string' ? part : JSON.stringify(part)
          ).join('');
          result = JSON.parse(joinedContent);
        }
        // Otherwise, stringify and parse to ensure it's valid JSON
        else {
          result = JSON.parse(JSON.stringify(content));
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        console.log("Raw content:", content);
        
        // Return a fallback result
        return new Response(
          JSON.stringify({
            error: "Failed to parse OpenAI response",
            rawContent: typeof content === 'string' ? content : JSON.stringify(content),
            fallbackResult: mockFactCheckResult
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      console.log("Successfully parsed result");
      
      // Return the result
      return new Response(
        JSON.stringify(result),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (openaiError) {
      console.error("Error calling OpenAI:", openaiError);
      
      return new Response(
        JSON.stringify({
          error: "Failed to call OpenAI",
          message: openaiError instanceof Error ? openaiError.message : String(openaiError),
          fallbackResult: mockFactCheckResult
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error in OpenAI-only fact-check API:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : String(error),
        fallbackResult: mockFactCheckResult
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
