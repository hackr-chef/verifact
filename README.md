# VeriFact - AI-Powered Fact-Checking Tool

VeriFact is a real-time fact-checking application that uses AI and search APIs to verify the accuracy of statements. It provides detailed explanations, confidence scores, and source links to help users determine the truthfulness of claims.

## Features

- **Real-time fact-checking** using Serper.dev search API
- **Multiple verification methods** including knowledge base and web search
- **Detailed explanations** for why statements are accurate or inaccurate
- **Source links** to verify information
- **Confidence scores** to indicate certainty level
- **Suggestions** for improving accuracy

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Serper.dev API key (for real-time search results)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/verifact.git
cd verifact
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```
SERPER_API_KEY=your_serper_api_key_here
```

You can get a Serper.dev API key by signing up at [https://serper.dev/](https://serper.dev/)

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Navigate to the test page at [http://localhost:3000/test-fact-check](http://localhost:3000/test-fact-check)
2. Enter a statement to fact-check in the input field
3. Select the API to use (Serper Search API recommended for real-time results)
4. Click "Check Facts" to analyze the statement
5. Review the results, including accuracy status, explanation, and sources

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
