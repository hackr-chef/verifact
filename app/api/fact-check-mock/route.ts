import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Mock fact-check API called");
  
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
    
    // Extract sentences from the text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Generate claims from the sentences
    const claims = [];
    for (const sentence of sentences) {
      if (sentence.trim().length < 10) continue; // Skip very short sentences
      
      // Randomly determine if the claim is accurate (70% chance of being accurate)
      const isAccurate = Math.random() < 0.7;
      
      claims.push({
        claim: sentence.trim(),
        status: isAccurate ? "ACCURATE" : "INACCURATE",
        explanation: isAccurate 
          ? "This statement appears to be factually correct based on our analysis."
          : "This statement contains potential inaccuracies that should be verified.",
        source: "VeriFact Analysis Engine",
        correction: isAccurate ? null : "Consider revising or providing a source for this claim."
      });
      
      // Limit to 5 claims for simplicity
      if (claims.length >= 5) break;
    }
    
    // Calculate a truth score based on the accuracy of the claims
    const accurateCount = claims.filter(claim => claim.status === "ACCURATE").length;
    const truthScore = claims.length > 0 ? Math.round((accurateCount / claims.length) * 100) : 50;
    
    // Generate suggestions based on the claims
    const suggestions = [];
    
    if (claims.filter(claim => claim.status === "INACCURATE").length > 0) {
      suggestions.push("Consider revising the inaccurate statements identified in your text.");
    }
    
    if (claims.length < 3 && text.length > 100) {
      suggestions.push("Your text could benefit from more specific factual claims.");
    }
    
    suggestions.push("Adding sources to your claims would strengthen your text's credibility.");
    
    // Create the result
    const result = {
      summary: `We analyzed your text and found ${claims.length} claims to fact-check. ${accurateCount} appear to be accurate.`,
      factCheckResults: claims,
      suggestions: suggestions,
      truthScore: truthScore
    };
    
    // Add a small delay to simulate processing time (200-800ms)
    const delay = Math.floor(Math.random() * 600) + 200;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log("Returning mock fact-check result");
    
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
    console.error("Error in mock fact-check API:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : String(error)
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
