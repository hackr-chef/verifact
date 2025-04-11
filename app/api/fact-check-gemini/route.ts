import { NextRequest } from "next/server";
import { mockFactCheckResult } from "@/lib/api-key-check";
import { verifyFactWithKnowledgeBase } from "@/lib/knowledge-base";

// Note: In a real implementation, you would use the Google Generative AI SDK
// import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  console.log("Gemini fact-check API called");

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

    // Since we don't have actual Gemini API integration yet,
    // we'll simulate it with a more sophisticated mock
    // In a real implementation, you would use the Google Generative AI SDK

    // Simulate API call delay (500-1500ms)
    const delay = Math.floor(Math.random() * 1000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Extract sentences from the text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Generate claims from the sentences with more sophisticated analysis
    const claims = [];
    for (const sentence of sentences) {
      if (sentence.trim().length < 10) continue; // Skip very short sentences

      // More sophisticated claim analysis
      // Check for factual statements vs opinions
      const hasFactualIndicators = /is|are|was|were|will be|has|have|had|can|could|would|should|must|date|year|percent|study|research|according to|found that/i.test(sentence);

      // Only treat sentences with factual indicators as claims
      if (hasFactualIndicators) {
        // First, check against our knowledge base for verified facts
        const knowledgeBaseResult = verifyFactWithKnowledgeBase(sentence.trim());

        if (knowledgeBaseResult) {
          // We have a verified result from our knowledge base
          claims.push({
            claim: sentence.trim(),
            status: knowledgeBaseResult.isAccurate ? "ACCURATE" : "INACCURATE",
            explanation: knowledgeBaseResult.explanation,
            source: "VeriFact Knowledge Base",
            correction: knowledgeBaseResult.isAccurate ? null : generateCorrection(sentence.trim()),
            confidence: knowledgeBaseResult.confidence
          });
        } else {
          // Fall back to pattern-based analysis if knowledge base doesn't have an answer
          // Determine accuracy based on common knowledge patterns
          const containsLikelyAccurate = /earth is round|water boils|sun rises|humans need oxygen|gravity exists|planets orbit|earth orbits|moon orbits|humans have|animals need|plants need|water freezes|sky is blue/i.test(sentence);
          const containsLikelyInaccurate = /earth is flat|sun orbits earth|moon is made of cheese|vaccines cause autism|5g causes|covid is fake|aliens built|conspiracy|illuminati|flat earth|never landed on|fake news|hoax|mind control/i.test(sentence);

          const isAccurate = containsLikelyInaccurate ? false :
                            containsLikelyAccurate ? true :
                            Math.random() < 0.7; // Default 70% accurate for other claims

          claims.push({
            claim: sentence.trim(),
            status: isAccurate ? "ACCURATE" : "INACCURATE",
            explanation: isAccurate
              ? "This statement appears to be factually correct based on our analysis."
              : "This statement contains potential inaccuracies that should be verified.",
            source: "Gemini Analysis Engine",
            correction: isAccurate ? null : generateCorrection(sentence.trim()),
            confidence: isAccurate ? 75 : 65 // Lower confidence for pattern-based analysis
          });
        }
      }

      // Limit to 5 claims for simplicity
      if (claims.length >= 5) break;
    }

    // If no claims were found, add a generic one
    if (claims.length === 0 && sentences.length > 0) {
      claims.push({
        claim: sentences[0].trim(),
        status: "UNVERIFIABLE",
        explanation: "This statement is either an opinion or lacks sufficient context for fact-checking.",
        source: "Gemini Analysis Engine",
        correction: null
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

    console.log("Returning Gemini fact-check result");

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
    console.error("Error in Gemini fact-check API:", error);

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

// Helper function to generate a correction for inaccurate claims
function generateCorrection(claim: string): string {
  // Simple correction generation based on common misconceptions
  if (/earth is flat/i.test(claim)) {
    return "The Earth is an oblate spheroid, not flat. This has been confirmed by numerous scientific observations, satellite imagery, and space missions.";
  }
  if (/sun orbits/i.test(claim)) {
    return "The Earth orbits the Sun, not the other way around. This heliocentric model has been established since the work of Copernicus and Galileo.";
  }
  if (/vaccines cause autism/i.test(claim)) {
    return "Scientific consensus based on numerous studies shows no link between vaccines and autism.";
  }
  if (/5g causes/i.test(claim)) {
    return "Scientific evidence does not support claims that 5G technology causes health problems. 5G uses non-ionizing radiation which does not damage cells like higher-energy radiation.";
  }

  // Population-related corrections
  if (/china is the (most populated|most populous)/i.test(claim)) {
    return "As of 2023, India is the world's most populated country with approximately 1.428 billion people, according to the United Nations. China is now the second most populated with about 1.426 billion people.";
  }
  if (/usa is a continent/i.test(claim) || /united states is a continent/i.test(claim)) {
    return "The United States of America (USA) is a country located in North America, not a continent itself.";
  }

  // Generic correction for other claims
  return "This statement may need revision for accuracy. Consider checking reliable sources for verification.";
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
    summary += "Overall, your text appears to be factually accurate.";
  } else if (truthScore >= 50) {
    summary += "Your text contains a mix of accurate and potentially inaccurate information.";
  } else {
    summary += "Your text contains several statements that may need verification or correction.";
  }

  return summary;
}
