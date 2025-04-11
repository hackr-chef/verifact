'use client';

import { useState } from 'react';

export default function TestFactCheck() {
  const [input, setInput] = useState('USA is a continent');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedApi, setSelectedApi] = useState('serper');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const endpoint = `/api/fact-check-${selectedApi}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while checking facts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Fact Checking</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="api" className="block text-sm font-medium text-gray-700 mb-1">
              Select API
            </label>
            <select
              id="api"
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="serper">Serper Search API (Real-time)</option>
              <option value="gemini">Gemini API</option>
              <option value="bing">Bing API</option>
              <option value="google">Google API</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter text to fact-check
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-32"
              placeholder="Enter a statement to fact-check..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Checking...' : 'Check Facts'}
          </button>
        </form>

        {results && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-gray-700">{results.summary}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Truth Score</h3>
              <p className="text-gray-700">{results.truthScore}%</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Fact Check Results</h3>
              <div className="space-y-4">
                {results.factCheckResults.map((result: any, index: number) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          result.status === 'ACCURATE'
                            ? 'bg-green-500'
                            : result.status === 'INACCURATE'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      ></span>
                      <span className="font-medium">
                        {result.status === 'ACCURATE'
                          ? 'Accurate'
                          : result.status === 'INACCURATE'
                          ? 'Inaccurate'
                          : 'Unverifiable'}
                      </span>
                      {result.confidence && (
                        <span className="ml-2 text-sm text-gray-500">
                          Confidence: {result.confidence}%
                        </span>
                      )}
                    </div>

                    <p className="text-gray-800 mb-2">"{result.claim}"</p>

                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Explanation:</span> {result.explanation}
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Source:</span> {result.source}
                    </div>

                    {result.correction && (
                      <div className="text-sm text-blue-600">
                        <span className="font-medium">Correction:</span> {result.correction}
                      </div>
                    )}

                    {result.sourceLinks && result.sourceLinks.length > 0 && (
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Reference Links:</span>
                        <ul className="list-disc pl-5 mt-1">
                          {result.sourceLinks.map((link: string, i: number) => (
                            <li key={i}>
                              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.searchResults && result.searchResults.length > 0 && (
                      <div className="mt-3 text-xs border-t pt-2">
                        <span className="font-medium">Search Results:</span>
                        <div className="space-y-2 mt-1">
                          {result.searchResults.map((searchResult: any, i: number) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <div className="font-medium text-blue-600">
                                {searchResult.url ? (
                                  <a href={searchResult.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {searchResult.title}
                                  </a>
                                ) : (
                                  searchResult.title
                                )}
                              </div>
                              <div className="text-gray-600 mt-1">{searchResult.snippet}</div>
                              <div className="flex justify-between mt-1">
                                <span className="text-gray-500">{searchResult.source}</span>
                                {searchResult.relevanceScore !== undefined && (
                                  <span className="text-gray-500">
                                    Relevance: {Math.round(searchResult.relevanceScore * 100)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.claimReviews && result.claimReviews.length > 0 && (
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Fact Checked By:</span>
                        <ul className="list-disc pl-5 mt-1">
                          {result.claimReviews.map((review: any, i: number) => (
                            <li key={i}>
                              <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {review.publisher.name}
                              </a>
                              <span className="mx-1">•</span>
                              <span>{review.reviewDate}</span>
                              <span className="mx-1">•</span>
                              <span className={`font-medium ${
                                review.textualRating.toLowerCase().includes('true') ? 'text-green-600' :
                                review.textualRating.toLowerCase().includes('false') ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {review.textualRating}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Suggestions</h3>
              <ul className="list-disc pl-5">
                {results.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-gray-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
