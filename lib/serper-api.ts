// Serper.dev API service for real-time search results
// Documentation: https://serper.dev/api-reference

// Define the response types for Serper API
export interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  source?: string;
}

export interface SerperApiResponse {
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
  };
  organic: SerperSearchResult[];
  knowledgeGraph?: {
    title: string;
    type: string;
    description: string;
  };
  answerBox?: {
    title: string;
    answer: string;
  };
}

export interface ProcessedSearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
  source: string;
  relevanceScore?: number;
}

// Function to search using Serper.dev API
export async function searchWithSerper(query: string, limit: number = 5): Promise<ProcessedSearchResult[]> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.SERPER_API_KEY;
    
    if (!apiKey) {
      console.error('Serper API key is missing');
      return [];
    }
    
    // Prepare the request to Serper.dev
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        gl: 'us',
        hl: 'en',
        num: limit
      })
    });
    
    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
    }
    
    const data: SerperApiResponse = await response.json();
    
    // Process and return the organic search results
    return processSerperResults(data, limit);
  } catch (error) {
    console.error('Error searching with Serper:', error);
    return [];
  }
}

// Process the Serper API response into a standardized format
function processSerperResults(data: SerperApiResponse, limit: number): ProcessedSearchResult[] {
  const results: ProcessedSearchResult[] = [];
  
  // Add organic search results
  if (data.organic && data.organic.length > 0) {
    data.organic.slice(0, limit).forEach(result => {
      results.push({
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        position: result.position,
        source: result.source || 'Google Search'
      });
    });
  }
  
  // Add knowledge graph if available
  if (data.knowledgeGraph) {
    results.push({
      title: data.knowledgeGraph.title,
      url: '',
      snippet: data.knowledgeGraph.description,
      position: 0,
      source: 'Knowledge Graph'
    });
  }
  
  // Add answer box if available
  if (data.answerBox) {
    results.push({
      title: data.answerBox.title || 'Featured Snippet',
      url: '',
      snippet: data.answerBox.answer,
      position: 0,
      source: 'Featured Snippet'
    });
  }
  
  // Sort by position
  return results.sort((a, b) => a.position - b.position).slice(0, limit);
}

// Function to extract search queries from a claim
export function generateSearchQueriesFromClaim(claim: string): string[] {
  // Clean the claim
  const cleanClaim = claim.trim().replace(/['"]/g, '');
  
  // Return the claim as is for direct search
  const queries = [cleanClaim];
  
  // For longer claims, try to extract key phrases
  if (cleanClaim.length > 50) {
    // Extract subject and main assertion
    const parts = cleanClaim.split(/\s+is\s+|\s+are\s+|\s+was\s+|\s+were\s+/);
    if (parts.length >= 2) {
      queries.push(`${parts[0]} ${parts[1].split('.')[0]}`);
    }
  }
  
  // Add fact-check specific queries
  queries.push(`fact check ${cleanClaim}`);
  
  return queries;
}

// Function to calculate relevance score between claim and search result
export function calculateRelevance(claim: string, searchResult: ProcessedSearchResult): number {
  const claimLower = claim.toLowerCase();
  const snippetLower = searchResult.snippet.toLowerCase();
  const titleLower = searchResult.title.toLowerCase();
  
  // Simple keyword matching for now
  // In a production environment, you would use embeddings or more sophisticated NLP
  let score = 0;
  
  // Check if the snippet contains the claim or parts of it
  const words = claimLower.split(/\s+/).filter(word => word.length > 3);
  const uniqueWords = [...new Set(words)];
  
  // Count matching words in snippet
  uniqueWords.forEach(word => {
    if (snippetLower.includes(word)) {
      score += 0.1;
    }
  });
  
  // Bonus for title matches
  uniqueWords.forEach(word => {
    if (titleLower.includes(word)) {
      score += 0.05;
    }
  });
  
  // Bonus if the snippet contains exact phrases from the claim
  const phrases = extractPhrases(claimLower);
  phrases.forEach(phrase => {
    if (snippetLower.includes(phrase)) {
      score += 0.2 * (phrase.length / claimLower.length);
    }
  });
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

// Helper to extract meaningful phrases from text
function extractPhrases(text: string): string[] {
  const phrases = [];
  
  // Split by common punctuation
  const sentenceParts = text.split(/[,.;:!?]/);
  
  // Add each part that's meaningful
  sentenceParts.forEach(part => {
    const trimmed = part.trim();
    if (trimmed.length > 5 && trimmed.split(/\s+/).length > 1) {
      phrases.push(trimmed);
    }
  });
  
  // Add the whole text as a phrase
  if (text.length > 0) {
    phrases.push(text);
  }
  
  return phrases;
}
