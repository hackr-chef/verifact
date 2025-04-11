// Utility to check if required API keys are set
export function checkRequiredApiKeys() {
  const missingKeys = [];
  const invalidKeys = [];

  console.log('Checking API keys...');

  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key is missing');
    missingKeys.push('OPENAI_API_KEY');
  } else {
    console.log(`OpenAI API key found: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);
    if (!isValidOpenAIKey(process.env.OPENAI_API_KEY)) {
      console.log('OpenAI API key is invalid');
      invalidKeys.push('OPENAI_API_KEY');
    } else {
      console.log('OpenAI API key is valid');
    }
  }

  // Check if SerpAPI key is set
  if (!process.env.SERPAPI_API_KEY) {
    console.log('SerpAPI key is missing');
    missingKeys.push('SERPAPI_API_KEY');
  } else {
    console.log(`SerpAPI key found: ${process.env.SERPAPI_API_KEY.substring(0, 10)}...`);
  }

  // Log warnings for missing or invalid keys
  if (missingKeys.length > 0) {
    console.warn(`Missing required API keys: ${missingKeys.join(', ')}`);
  }

  if (invalidKeys.length > 0) {
    console.warn(`Invalid API keys detected: ${invalidKeys.join(', ')}`);
  }

  const result = missingKeys.length === 0 && invalidKeys.length === 0;
  console.log(`API keys check result: ${result ? 'PASSED' : 'FAILED'}`);

  // Return true only if all keys are present and valid
  return result;
}

// Helper function to validate OpenAI API key format
function isValidOpenAIKey(key: string): boolean {
  // Accept any key format in development for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: accepting any non-empty API key');
    return key.length > 0;
  }

  // Support both standard OpenAI keys and project-based keys
  const isStandardKey = key.startsWith('sk-') && key.length >= 40;
  const isProjectKey = key.startsWith('sk-proj-') && key.length >= 40;

  console.log(`Key validation: isStandardKey=${isStandardKey}, isProjectKey=${isProjectKey}`);

  return isStandardKey || isProjectKey;
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
