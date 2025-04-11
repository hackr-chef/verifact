import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Basic fact-check API called");
  
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
    
    // Create a simple response without any external API calls
    const result = {
      summary: `Analyzed text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
      factCheckResults: [
        {
          claim: "Sample claim from your text",
          status: "ACCURATE",
          explanation: "This is a basic test response.",
          source: "Test Source",
          correction: null
        }
      ],
      suggestions: [
        "This is a test suggestion."
      ],
      truthScore: 100
    };
    
    console.log("Returning basic fact-check result");
    
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
  } catch (error) {
    console.error("Error in basic fact-check API:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : String(error),
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
