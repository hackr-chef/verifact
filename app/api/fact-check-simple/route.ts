import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Simple fact-check API called");
  
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
    
    // Create a mock fact-check result
    const result = {
      summary: "This is a mock fact-check result for demonstration purposes.",
      factCheckResults: [
        {
          claim: "Sample claim extracted from your text",
          status: "ACCURATE",
          explanation: "This is a demonstration of an accurate claim.",
          source: "Mock Source (2023)",
          correction: null
        },
        {
          claim: "Another sample claim from your text",
          status: "INACCURATE",
          explanation: "This is a demonstration of an inaccurate claim.",
          source: "Mock Source (2023)",
          correction: "This is how the claim could be corrected."
        }
      ],
      suggestions: [
        "This is a mock suggestion for improving your text.",
        "Consider adding more specific details to strengthen your arguments."
      ],
      truthScore: 50
    };
    
    console.log("Returning mock fact-check result");
    
    // Return the mock result
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
    console.error("Error in simple fact-check API:", error);
    
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
