// Utility to check if required API keys are set
export function checkRequiredApiKeys(options = { requireAll: false }) {
  const missingKeys = [];
  const invalidKeys = [];
  const validKeys = [];

  console.log('Checking API keys...');

  // Check if Serper API key is set - this is the only API we're using now
  if (!process.env.SERPER_API_KEY) {
    console.log('Serper API key is missing');
    missingKeys.push('SERPER_API_KEY');
  } else {
    console.log(`Serper API key found: ${process.env.SERPER_API_KEY.substring(0, 5)}...`);
    validKeys.push('SERPER_API_KEY');
  }

  // Log warnings for missing or invalid keys
  if (missingKeys.length > 0) {
    console.warn(`Missing API keys: ${missingKeys.join(', ')}`);
  }

  if (invalidKeys.length > 0) {
    console.warn(`Invalid API keys detected: ${invalidKeys.join(', ')}`);
  }

  if (validKeys.length > 0) {
    console.log(`Valid API keys found: ${validKeys.join(', ')}`);
  }

  // If requireAll is true, all keys must be present and valid
  // If requireAll is false, at least one key must be present and valid
  let result;
  if (options.requireAll) {
    result = missingKeys.length === 0 && invalidKeys.length === 0;
  } else {
    result = validKeys.length > 0;
  }

  console.log(`API keys check result: ${result ? 'PASSED' : 'FAILED'}`);
  console.log(`Valid keys: ${validKeys.length}, Missing keys: ${missingKeys.length}, Invalid keys: ${invalidKeys.length}`);

  return {
    passed: result,
    validKeys,
    missingKeys,
    invalidKeys
  };
}



// Mock data for when API keys are missing
export const mockFactCheckResult = {
  summary: "This is a demo result because API keys are missing. In a real deployment, you would see actual fact-checking results here.",
  factCheckResults: [
    {
      claim: "The Earth is round.",
      status: "ACCURATE",
      explanation: "This is widely accepted scientific fact.",
      source: "Demo Source",
      correction: null
    },
    {
      claim: "The Earth is flat.",
      status: "INACCURATE",
      explanation: "This contradicts established scientific knowledge.",
      source: "Demo Source",
      correction: "The Earth is an oblate spheroid."
    }
  ],
  suggestions: [
    "This is a demo suggestion. Add real API keys to get actual suggestions.",
    "Configure your .env.local file with valid OpenAI and SerpAPI keys."
  ],
  truthScore: 50
};
