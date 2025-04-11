import { verifyFactWithKnowledgeBase } from './knowledge-base';
import {
  searchWithSerper,
  generateSearchQueriesFromClaim,
  calculateRelevance,
  ProcessedSearchResult
} from './serper-api';

export interface FactCheckResult {
  claim: string;
  status: 'ACCURATE' | 'INACCURATE' | 'UNVERIFIABLE';
  explanation: string;
  confidence: number;
  source: string;
  correction?: string;
  sourceLinks?: string[];
  searchResults?: ProcessedSearchResult[];
}

// Main function to check facts using both knowledge base and search results
export async function checkFact(claim: string): Promise<FactCheckResult> {
  // First, check against our knowledge base
  const knowledgeBaseResult = verifyFactWithKnowledgeBase(claim);

  if (knowledgeBaseResult) {
    // We have a high-confidence result from our knowledge base
    return {
      claim,
      status: knowledgeBaseResult.isAccurate ? 'ACCURATE' : 'INACCURATE',
      explanation: knowledgeBaseResult.explanation,
      confidence: knowledgeBaseResult.confidence,
      source: 'VeriFact Knowledge Base',
      correction: knowledgeBaseResult.isAccurate ? undefined : generateCorrection(claim)
    };
  }

  // If not in knowledge base, search the web
  return await checkFactWithSearch(claim);
}

// Function to check facts using search results
async function checkFactWithSearch(claim: string): Promise<FactCheckResult> {
  try {
    // Generate search queries from the claim
    const queries = generateSearchQueriesFromClaim(claim);

    // Search for each query and combine results
    let allResults: ProcessedSearchResult[] = [];

    for (const query of queries) {
      const results = await searchWithSerper(query);

      // Calculate relevance scores for each result
      results.forEach(result => {
        result.relevanceScore = calculateRelevance(claim, result);
      });

      allResults = [...allResults, ...results];
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = removeDuplicateResults(allResults);
    const sortedResults = uniqueResults
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 5);

    // Analyze the search results to determine fact accuracy
    const analysis = analyzeSearchResults(claim, sortedResults);

    return {
      claim,
      status: analysis.status,
      explanation: analysis.explanation,
      confidence: analysis.confidence,
      source: 'Web Search',
      correction: analysis.status === 'INACCURATE' ? generateCorrection(claim) : undefined,
      sourceLinks: sortedResults.map(result => result.url).filter(url => url.length > 0),
      searchResults: sortedResults
    };
  } catch (error) {
    console.error('Error in checkFactWithSearch:', error);

    // Fallback to a generic unverifiable result
    return {
      claim,
      status: 'UNVERIFIABLE',
      explanation: 'We could not verify this claim due to a technical issue with our search service.',
      confidence: 30,
      source: 'Error in Web Search',
    };
  }
}

// Helper function to remove duplicate search results
function removeDuplicateResults(results: ProcessedSearchResult[]): ProcessedSearchResult[] {
  const uniqueUrls = new Set<string>();
  return results.filter(result => {
    // Keep results without URLs or with unique URLs
    if (!result.url || result.url.length === 0) return true;

    if (uniqueUrls.has(result.url)) {
      return false;
    } else {
      uniqueUrls.add(result.url);
      return true;
    }
  });
}

// Helper function to analyze search results and determine fact accuracy
function analyzeSearchResults(
  claim: string,
  results: ProcessedSearchResult[]
): { status: 'ACCURATE' | 'INACCURATE' | 'UNVERIFIABLE'; explanation: string; confidence: number } {
  // If no results, return unverifiable
  if (results.length === 0) {
    return {
      status: 'UNVERIFIABLE',
      explanation: 'We could not find relevant information to verify this claim.',
      confidence: 30
    };
  }

  // Calculate the average relevance score
  const totalRelevance = results.reduce((sum, result) => sum + (result.relevanceScore || 0), 0);
  const avgRelevance = totalRelevance / results.length;

  // If average relevance is too low, return unverifiable
  if (avgRelevance < 0.2) {
    return {
      status: 'UNVERIFIABLE',
      explanation: 'We found some information but it was not directly relevant to your claim.',
      confidence: 40
    };
  }

  // Analyze the content of the search results
  // This is a simplified approach - in production, you would use more sophisticated NLP
  const supportCount = countSupportingResults(claim, results);
  const contradictCount = countContradictingResults(claim, results);

  // Calculate confidence based on the agreement among sources
  const totalCount = supportCount + contradictCount;
  const confidence = Math.min(Math.round((Math.max(supportCount, contradictCount) / totalCount) * 100), 95);

  if (supportCount > contradictCount) {
    return {
      status: 'ACCURATE',
      explanation: `This claim appears to be accurate based on ${supportCount} supporting sources found in our search results.`,
      confidence
    };
  } else if (contradictCount > supportCount) {
    return {
      status: 'INACCURATE',
      explanation: `This claim appears to be inaccurate based on ${contradictCount} contradicting sources found in our search results.`,
      confidence
    };
  } else {
    return {
      status: 'UNVERIFIABLE',
      explanation: 'We found mixed information about this claim, with some sources supporting and others contradicting it.',
      confidence: 50
    };
  }
}

// Helper function to count supporting search results
function countSupportingResults(claim: string, results: ProcessedSearchResult[]): number {
  // This is a simplified implementation
  // In production, you would use NLP to better understand support/contradiction
  const claimLower = claim.toLowerCase();
  let count = 0;

  const supportPatterns = [
    'is true', 'is correct', 'is accurate', 'is right', 'is valid',
    'confirmed', 'verified', 'proven', 'evidence supports', 'research shows',
    'studies confirm', 'experts agree', 'according to', 'data shows'
  ];

  results.forEach(result => {
    const snippetLower = result.snippet.toLowerCase();

    // Check for supporting patterns
    for (const pattern of supportPatterns) {
      if (snippetLower.includes(pattern)) {
        count++;
        break;
      }
    }

    // Check if the snippet directly contains the claim without negation
    if (snippetLower.includes(claimLower) &&
        !snippetLower.includes('not ' + claimLower) &&
        !snippetLower.includes('isn\'t ' + claimLower) &&
        !snippetLower.includes('false') &&
        !snippetLower.includes('incorrect')) {
      count++;
    }
  });

  return count;
}

// Helper function to count contradicting search results
function countContradictingResults(claim: string, results: ProcessedSearchResult[]): number {
  const claimLower = claim.toLowerCase();
  let count = 0;

  const contradictPatterns = [
    'is false', 'is incorrect', 'is inaccurate', 'is wrong', 'is invalid',
    'debunked', 'disproven', 'myth', 'no evidence', 'research contradicts',
    'studies refute', 'experts disagree', 'fact check: false', 'misleading'
  ];

  results.forEach(result => {
    const snippetLower = result.snippet.toLowerCase();

    // Check for contradicting patterns
    for (const pattern of contradictPatterns) {
      if (snippetLower.includes(pattern)) {
        count++;
        break;
      }
    }

    // Check if the snippet contains negations of the claim
    if ((snippetLower.includes('not ' + claimLower) ||
         snippetLower.includes('isn\'t ' + claimLower) ||
         snippetLower.includes('no ' + claimLower)) &&
        !snippetLower.includes('not not ' + claimLower)) {
      count++;
    }
  });

  return count;
}

// Helper function to generate a correction for inaccurate claims
function generateCorrection(_claim: string): string {
  // This would ideally be generated based on the search results
  // For now, we'll return a generic correction
  return "Based on our search results, this claim appears to need correction. Please check the provided sources for accurate information.";
}
