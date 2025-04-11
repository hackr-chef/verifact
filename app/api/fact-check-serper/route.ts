import { NextRequest } from "next/server";
import { checkFact } from "@/lib/fact-check-service";
import { mockFactCheckResult } from "@/lib/api-key-check";

export async function POST(request: NextRequest) {
  console.log("Serper fact-check API called");
  
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
    
    // Check if we have the required API key
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      console.warn("Serper API key is missing, returning mock result");
      return new Response(
        JSON.stringify(mockFactCheckResult),
        {
          status: 200,
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
      
      // Check for factual indicators
      const hasFactualIndicators = /is|are|was|were|will be|has|have|had|can|could|would|should|must|date|year|percent|study|research|according to|found that/i.test(sentence);
      
      // Only treat sentences with factual indicators as claims
      if (hasFactualIndicators) {
        // Use our fact-checking service to check this claim
        const factCheckResult = await checkFact(sentence.trim());
        
        claims.push({
          claim: sentence.trim(),
          status: factCheckResult.status,
          explanation: factCheckResult.explanation,
          source: factCheckResult.source,
          correction: factCheckResult.correction || null,
          confidence: factCheckResult.confidence,
          sourceLinks: factCheckResult.sourceLinks || [],
          searchResults: factCheckResult.searchResults || []
        });
      }
      
      // Limit to 3 claims for performance
      if (claims.length >= 3) break;
    }
    
    // If no claims were found, add a generic one
    if (claims.length === 0 && sentences.length > 0) {
      claims.push({
        claim: sentences[0].trim(),
        status: "UNVERIFIABLE",
        explanation: "This statement is either an opinion or lacks sufficient context for fact-checking.",
        source: "Serper Search API",
        correction: null,
        confidence: 30
      });
    }
    
    // Calculate a truth score based on the accuracy of the claims
    const accurateCount = claims.filter(claim => claim.status === "ACCURATE").length;
    const truthScore = claims.length > 0 ? Math.round((accurateCount / claims.length) * 100) : 50;
    
    // Generate suggestions based on the claims
    const suggestions = generateSuggestions(claims, text);
    
    // Create the result
    const result = {
      summary: generateSummary(claims, truthScore),
      factCheckResults: claims,
      suggestions: suggestions,
      truthScore: truthScore
    };
    
    console.log("Returning Serper fact-check result");
    
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
    console.error("Error in Serper fact-check API:", error);
    
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

// Helper function to generate suggestions based on claims
function generateSuggestions(claims: any[], text: string): string[] {
  const suggestions = [];
  
  // Add suggestions based on claim analysis
  const inaccurateClaims = claims.filter(claim => claim.status === "INACCURATE");
  if (inaccurateClaims.length > 0) {
    suggestions.push(`Consider revising the ${inaccurateClaims.length} inaccurate statement${inaccurateClaims.length > 1 ? 's' : ''} identified in your text.`);
  }
  
  // Add suggestion about sources if text is longer
  if (text.length > 100 && !text.includes("according to") && !text.includes("cited") && !text.includes("source")) {
    suggestions.push("Adding sources to your claims would strengthen your text's credibility.");
  }
  
  // Add suggestion about specificity if claims are vague
  const vagueClaims = claims.filter(claim => claim.claim.length < 50);
  if (vagueClaims.length > 0 && claims.length > 1) {
    suggestions.push("Some of your statements could benefit from more specific details.");
  }
  
  // Add a suggestion about checking sources
  if (claims.some(claim => claim.sourceLinks && claim.sourceLinks.length > 0)) {
    suggestions.push("Review the provided source links for more detailed information about these claims.");
  }
  
  // Add a generic suggestion if no specific ones were generated
  if (suggestions.length === 0) {
    suggestions.push("Consider adding more context or specific details to strengthen your arguments.");
  }
  
  return suggestions;
}

// Helper function to generate a summary based on claims and truth score
function generateSummary(claims: any[], truthScore: number): string {
  if (claims.length === 0) {
    return "We couldn't identify specific factual claims in your text to verify.";
  }
  
  const accurateClaims = claims.filter(claim => claim.status === "ACCURATE").length;
  const inaccurateClaims = claims.filter(claim => claim.status === "INACCURATE").length;
  const unverifiableClaims = claims.filter(claim => claim.status === "UNVERIFIABLE").length;
  
  let summary = `We analyzed your text and found ${claims.length} claim${claims.length !== 1 ? 's' : ''} to fact-check. `;
  
  if (accurateClaims > 0) {
    summary += `${accurateClaims} appear${accurateClaims === 1 ? 's' : ''} to be accurate. `;
  }
  
  if (inaccurateClaims > 0) {
    summary += `${inaccurateClaims} contain${inaccurateClaims === 1 ? 's' : ''} potential inaccuracies. `;
  }
  
  if (unverifiableClaims > 0) {
    summary += `${unverifiableClaims} ${unverifiableClaims === 1 ? 'is' : 'are'} difficult to verify. `;
  }
  
  // Add a conclusion based on the truth score
  if (truthScore >= 80) {
    summary += "Overall, your text appears to be factually accurate based on our search results.";
  } else if (truthScore >= 50) {
    summary += "Your text contains a mix of accurate and potentially inaccurate information according to our search.";
  } else {
    summary += "Your text contains several statements that may need verification or correction based on our search results.";
  }
  
  return summary;
}
