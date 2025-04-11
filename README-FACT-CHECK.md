# VeriFact: Fact-Checking Implementation Guide

This guide explains how to set up and use the fact-checking functionality in VeriFact.

## Prerequisites

Before you begin, make sure you have:

1. An OpenAI API key (for GPT-4)
2. A SerpAPI key (for web searches)
3. A Supabase project set up

## Setup Instructions

### 1. Environment Variables

Update your `.env.local` file with the following variables:

```
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# SerpAPI Key (for web search)
SERPAPI_API_KEY=your-serpapi-key

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Database Setup

Run the SQL script in `supabase/migrations/fact_checks_table.sql` in your Supabase SQL editor to create the necessary table and policies.

### 3. Install Dependencies

```bash
npm install langchain @langchain/openai @langchain/community serpapi
```

## How It Works

### Fact-Checking Process

1. **Input Collection**: Users enter text or upload a document through the TextInputForm component.

2. **Claim Extraction**: The system uses GPT-4 to extract factual claims from the input text.

3. **Web Search**: For each claim, SerpAPI searches the web for relevant information.

4. **Fact Verification**: GPT-4 analyzes the search results to determine if each claim is accurate, inaccurate, or unverifiable.

5. **Suggestions Generation**: The system generates suggestions to improve the accuracy of the text.

6. **Summary Creation**: A concise summary of the fact-checking results is generated.

7. **Results Display**: The results are displayed in a user-friendly format with color-coded indicators.

### Prompt Chain

The fact-checking process follows this chain:

```
Input → Extract Claims → Search Web → Check Facts → Generate Suggestions → Summarize
```

Each step uses a specialized prompt template designed for its specific task.

## Components

### 1. Text Input Form

The `TextInputForm` component allows users to:
- Enter text for fact-checking
- Upload documents (PDF, DOCX, TXT)
- Select tone and format preferences

### 2. Fact Check Results

The `FactCheckResults` component displays:
- A summary panel with key issues and truth score
- Fact analysis cards showing accurate/inaccurate statements with sources
- Suggestions for improvement
- Action buttons for rewriting, downloading, and copying

## API Endpoints

### POST /api/fact-check

Performs fact-checking on the provided text.

**Request Body:**
```json
{
  "text": "Text to fact-check"
}
```

**Response:**
```json
{
  "summary": "Summary of fact-checking results",
  "factCheckResults": [
    {
      "claim": "The original claim",
      "status": "ACCURATE/INACCURATE/UNVERIFIABLE",
      "explanation": "Explanation of the verification",
      "source": "Source information",
      "correction": "Suggested correction if inaccurate"
    }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "truthScore": 75
}
```

## Usage Tips

1. **API Costs**: Be aware that using GPT-4 and SerpAPI incurs costs. Monitor your usage to avoid unexpected charges.

2. **Rate Limits**: Both OpenAI and SerpAPI have rate limits. Implement appropriate error handling and retry logic.

3. **Content Moderation**: Consider implementing content moderation to prevent misuse of the fact-checking system.

4. **Performance Optimization**: For production use, consider:
   - Caching common searches
   - Implementing batch processing for multiple claims
   - Using a queue system for handling multiple requests

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are correctly set in the `.env.local` file.

2. **Search Failures**: If SerpAPI fails, check your quota and ensure your account is active.

3. **Timeout Errors**: For long texts with many claims, the process might time out. Consider implementing chunking for large inputs.

4. **Authentication Issues**: Ensure Supabase authentication is properly set up and the user is authenticated before making API calls.

## Future Enhancements

1. **Document Processing**: Implement proper document parsing for uploaded files.

2. **Multiple Search Providers**: Add fallback search providers for redundancy.

3. **Rewriting Functionality**: Implement AI-powered rewriting for inaccurate content.

4. **History and Saved Checks**: Allow users to view their fact-checking history and save important results.
