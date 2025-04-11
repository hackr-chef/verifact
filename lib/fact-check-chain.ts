import { chatModel, summaryModel } from "./openai";
import { searchForClaims } from "./search";
import {
  extractClaimsPrompt,
  checkFactsPrompt,
  generateSuggestionsPrompt,
  summarizeResultsPrompt,
} from "./prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const outputParser = new StringOutputParser();

// Step 1: Extract claims from input text
const extractClaimsChain = RunnableSequence.from([
  extractClaimsPrompt,
  chatModel,
  outputParser,
]);

// Step 2: Check facts against search results
const checkFactsChain = RunnableSequence.from([
  checkFactsPrompt,
  chatModel,
  outputParser,
]);

// Step 3: Generate suggestions for improvement
const suggestionsChain = RunnableSequence.from([
  generateSuggestionsPrompt,
  chatModel,
  outputParser,
]);

// Step 4: Summarize the fact-checking results
const summaryChain = RunnableSequence.from([
  summarizeResultsPrompt,
  summaryModel,
  outputParser,
]);

// Main fact-checking function
export async function factCheck(input: string) {
  try {
    console.log("Starting fact-checking process with real APIs...");
    console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'not set'}`);
    console.log(`SerpAPI Key: ${process.env.SERPAPI_API_KEY ? process.env.SERPAPI_API_KEY.substring(0, 10) + '...' : 'not set'}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Input text length: ${input.length} characters`);

    // Step 1: Extract claims
    console.log("Extracting claims...");
    const claimsJson = await extractClaimsChain.invoke({
      input,
    });

    let claims: string[];
    try {
      claims = JSON.parse(claimsJson);
      if (!Array.isArray(claims)) {
        throw new Error("Expected claims to be an array");
      }
    } catch (error) {
      console.error("Error parsing claims:", error);
      console.log("Raw claims output:", claimsJson);
      throw new Error("Failed to parse claims from model output");
    }

    console.log(`Extracted ${claims.length} claims`);

    if (claims.length === 0) {
      return {
        summary: "No factual claims were found in the provided text.",
        factCheckResults: [],
        suggestions: ["Consider adding specific factual statements that can be verified."],
        truthScore: null,
      };
    }

    // Step 2: Search for information about each claim
    console.log("Searching for information about claims...");
    let searchResults;
    try {
      searchResults = await searchForClaims(claims);
      console.log("Search completed successfully");
    } catch (error) {
      console.error("Error during search:", error);
      // Create a fallback response if search fails
      searchResults = {};
      claims.forEach(claim => {
        searchResults[claim] = JSON.stringify({
          error: "Search failed",
          message: "Unable to retrieve information for this claim."
        });
      });
    }

    // Step 3: Check facts against search results
    console.log("Checking facts against search results...");
    let factCheckResultsJson;
    try {
      factCheckResultsJson = await checkFactsChain.invoke({
        claims: JSON.stringify(claims),
        searchResults: JSON.stringify(searchResults),
      });
      console.log("Fact checking completed successfully");
    } catch (error) {
      console.error("Error during fact checking:", error);
      // Create a fallback response if fact checking fails
      factCheckResultsJson = JSON.stringify({
        claims: claims.map(claim => ({
          claim,
          status: "UNVERIFIABLE",
          explanation: "Unable to verify due to an error in the fact-checking process.",
          source: "System error",
          correction: null
        }))
      });
    }

    let factCheckResults;
    try {
      factCheckResults = JSON.parse(factCheckResultsJson);

      // Validate the structure of the response
      if (!factCheckResults.claims || !Array.isArray(factCheckResults.claims)) {
        console.error("Invalid fact check results structure:", factCheckResults);
        // Create a valid structure
        factCheckResults = {
          claims: [{
            claim: "Unable to verify claims",
            status: "UNVERIFIABLE",
            explanation: "There was an issue processing the fact check.",
            source: "System",
            correction: null
          }]
        };
      }
    } catch (error) {
      console.error("Error parsing fact check results:", error);
      console.log("Raw fact check results:", factCheckResultsJson);

      // Create a fallback response instead of throwing
      factCheckResults = {
        claims: [{
          claim: "Unable to verify claims",
          status: "UNVERIFIABLE",
          explanation: "There was an issue processing the fact check.",
          source: "System",
          correction: null
        }]
      };
    }

    // Step 4: Generate suggestions
    console.log("Generating suggestions...");
    let suggestionsJson;
    try {
      suggestionsJson = await suggestionsChain.invoke({
        originalText: input,
        factCheckResults: JSON.stringify(factCheckResults),
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      suggestionsJson = JSON.stringify(["Consider double-checking the factual claims in your text."]);
    }

    let suggestions;
    try {
      suggestions = JSON.parse(suggestionsJson);
    } catch (error) {
      console.error("Error parsing suggestions:", error);
      console.log("Raw suggestions:", suggestionsJson);
      suggestions = ["Consider double-checking the factual claims in your text."];
    }

    // Step 5: Generate summary
    console.log("Generating summary...");
    let summary;
    try {
      summary = await summaryChain.invoke({
        factCheckResults: JSON.stringify(factCheckResults),
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      summary = "We analyzed your text and found some claims that could be verified. Check the detailed results below.";
    }

    // Calculate truth score
    const accurateClaims = factCheckResults.claims.filter(
      (claim: any) => claim.status === "ACCURATE"
    ).length;
    const totalClaims = factCheckResults.claims.length;
    const truthScore = Math.round((accurateClaims / totalClaims) * 100);

    return {
      summary,
      factCheckResults: factCheckResults.claims,
      suggestions,
      truthScore,
    };
  } catch (error) {
    console.error("Error in fact-checking chain:", error);
    throw error;
  }
}
