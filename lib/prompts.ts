import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";

// Prompt for extracting claims from input text
export const extractClaimsPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are a fact-checking assistant that identifies factual claims in text.
    Extract all factual claims from the user's input that can be verified.
    Focus on objective statements about the world, history, science, statistics, etc.
    Ignore opinions, personal experiences, and subjective statements.
    Return ONLY a JSON array of strings, with each string being a single factual claim.
    Example output: ["The Earth orbits the Sun", "Water boils at 100 degrees Celsius at sea level"]`
  ),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

// Prompt for checking facts against search results
export const checkFactsPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are a fact-checking assistant that verifies claims against search results.
    For each claim, determine if it is:
    - ACCURATE: The claim is supported by the search results
    - INACCURATE: The claim contradicts the search results
    - UNVERIFIABLE: There isn't enough information in the search results to verify
    
    For each claim, provide:
    1. The verification status (ACCURATE, INACCURATE, or UNVERIFIABLE)
    2. A brief explanation of your reasoning
    3. The source of information (URL, publication, date if available)
    4. A suggested correction if the claim is inaccurate
    
    Return your analysis as a JSON object with the following structure:
    {
      "claims": [
        {
          "claim": "The original claim text",
          "status": "ACCURATE/INACCURATE/UNVERIFIABLE",
          "explanation": "Your reasoning",
          "source": "Source information",
          "correction": "Suggested correction if inaccurate, otherwise null"
        }
      ]
    }`
  ),
  HumanMessagePromptTemplate.fromTemplate(
    "Claims to verify: {claims}\n\nSearch results: {searchResults}"
  ),
]);

// Prompt for generating suggestions to improve accuracy
export const generateSuggestionsPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are a helpful assistant that provides suggestions to improve the factual accuracy of text.
    Based on the fact-checking results, provide 2-3 specific suggestions to make the text more accurate and credible.
    Focus on:
    1. How to correct inaccurate claims
    2. How to strengthen claims with additional sources or evidence
    3. How to clarify ambiguous statements
    
    Return your suggestions as a JSON array of strings.`
  ),
  HumanMessagePromptTemplate.fromTemplate(
    "Original text: {originalText}\n\nFact-checking results: {factCheckResults}"
  ),
]);

// Prompt for summarizing the fact-checking results
export const summarizeResultsPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are a fact-checking assistant that summarizes verification results.
    Create a concise summary of the fact-checking analysis that includes:
    1. The overall accuracy assessment (percentage of accurate claims)
    2. Key issues identified
    3. The most significant inaccuracies found
    
    Keep your summary under 150 words and focus on the most important findings.`
  ),
  HumanMessagePromptTemplate.fromTemplate("{factCheckResults}"),
]);
