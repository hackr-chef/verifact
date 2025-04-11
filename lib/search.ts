import { SerpAPI } from "@langchain/community/tools/serpapi";

// Initialize SerpAPI for web searches
export const serpApi = new SerpAPI(process.env.SERPAPI_API_KEY || "", {
  location: "United States",
  hl: "en",
  gl: "us",
});

// Validate that the API key is set
if (!process.env.SERPAPI_API_KEY) {
  console.warn("SERPAPI_API_KEY is not set. Web searches will fail.");
}

// Function to search for information about a specific claim
export async function searchForClaim(claim: string): Promise<string> {
  try {
    const response = await serpApi.call(claim);
    return response;
  } catch (error) {
    console.error("Error searching for claim:", error);
    return JSON.stringify({
      error: "Failed to search for information",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

// Function to search for multiple claims
export async function searchForClaims(claims: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const claim of claims) {
    try {
      results[claim] = await searchForClaim(claim);
    } catch (error) {
      console.error(`Error searching for claim "${claim}":`, error);
      results[claim] = JSON.stringify({
        error: "Failed to search for information",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
