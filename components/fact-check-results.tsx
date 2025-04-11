"use client";

import { useState } from "react";

interface FactCheckClaim {
  claim: string;
  status: string;
  explanation: string;
  source: string;
  correction: string | null;
  confidence?: number;
  sourceLinks?: string[];
  claimReviews?: {
    publisher: {
      name: string;
      site: string;
    };
    url: string;
    title: string;
    reviewDate: string;
    textualRating: string;
    languageCode: string;
  }[];
}

interface ApiMetadata {
  api: string;
  data?: any;
  success: boolean;
  error?: string;
}

interface FactCheckResultsProps {
  summary: string;
  factCheckResults: FactCheckClaim[];
  suggestions: string[];
  truthScore: number | null;
  onRewrite: () => void;
  onReset: () => void;
  apiMetadata?: ApiMetadata[];
  source?: string;
  processingTime?: number;
  apiVersion?: string;
  isUsingFallback?: boolean;
  error?: boolean;
}

export default function FactCheckResults({
  summary,
  factCheckResults,
  suggestions,
  truthScore,
  onRewrite,
  onReset,
  apiMetadata,
  source,
  processingTime,
  apiVersion,
  isUsingFallback,
  error,
}: FactCheckResultsProps) {
  const [copied, setCopied] = useState(false);
  const [showApiDetails, setShowApiDetails] = useState(false);

  const handleCopy = () => {
    // Create a text representation of the fact check results
    const textToCopy = `
FACT CHECK RESULTS

Summary: ${summary}

${factCheckResults
  .map(
    (result) => `
${result.status === 'ACCURATE' ? '✓ ACCURATE' : result.status === 'INACCURATE' ? '✗ INACCURATE' : '? UNVERIFIABLE'}
Claim: "${result.claim}"
${result.confidence ? `Confidence: ${result.confidence}%` : ''}
Explanation: ${result.explanation}
Source: ${result.source}
${result.correction ? `Correction: ${result.correction}` : ''}
`
  )
  .join('\n')}

SUGGESTIONS:
${suggestions.map((suggestion) => `- ${suggestion}`).join('\n')}

Truth Score: ${truthScore !== null ? `${truthScore}%` : 'N/A'}
${source ? `Source: ${source}` : ''}
${processingTime ? `Processing Time: ${processingTime.toFixed(2)}s` : ''}
${apiVersion ? `API Version: ${apiVersion}` : ''}
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleDownload = () => {
    // Create a text representation of the fact check results
    const textToDownload = `
FACT CHECK RESULTS

Summary: ${summary}

${factCheckResults
  .map(
    (result) => `
${result.status === 'ACCURATE' ? '✓ ACCURATE' : result.status === 'INACCURATE' ? '✗ INACCURATE' : '? UNVERIFIABLE'}
Claim: "${result.claim}"
${result.confidence ? `Confidence: ${result.confidence}%` : ''}
Explanation: ${result.explanation}
Source: ${result.source}
${result.correction ? `Correction: ${result.correction}` : ''}
${result.sourceLinks && result.sourceLinks.length > 0 ? `Reference Links:\n${result.sourceLinks.map(link => `- ${link}`).join('\n')}` : ''}
${result.claimReviews && result.claimReviews.length > 0 ? `Fact Checked By:\n${result.claimReviews.map(review => `- ${review.publisher.name} (${review.reviewDate}) - ${review.textualRating}`).join('\n')}` : ''}
`
  )
  .join('\n')}

SUGGESTIONS:
${suggestions.map((suggestion) => `- ${suggestion}`).join('\n')}

Truth Score: ${truthScore !== null ? `${truthScore}%` : 'N/A'}
${source ? `Source: ${source}` : ''}
${processingTime ? `Processing Time: ${processingTime.toFixed(2)}s` : ''}
${apiVersion ? `API Version: ${apiVersion}` : ''}
${apiMetadata ? `APIs Used: ${apiMetadata.map(api => `${api.api} (${api.success ? 'Success' : 'Failed'})`).join(', ')}` : ''}
    `.trim();

    // Create a blob and download it
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fact-check-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // More attractive and friendly color palette
  const colors = {
    accurate: {
      bg: '#E6F7EE',       // Softer green background
      icon: '#10B981',     // Vibrant green for icon
      border: '#A7F3D0',   // Light green border
      text: '#047857'      // Darker green for text
    },
    inaccurate: {
      bg: '#FEE2E2',       // Soft red background
      icon: '#EF4444',     // Vibrant red for icon
      border: '#FECACA',   // Light red border
      text: '#B91C1C'      // Darker red for text
    },
    unverifiable: {
      bg: '#FEF3C7',       // Soft yellow background
      icon: '#F59E0B',     // Amber for icon
      border: '#FDE68A',   // Light yellow border
      text: '#B45309'      // Darker amber for text
    },
    primary: '#4F46E5',    // Indigo as primary color
    secondary: '#1E293B',  // Deep slate for secondary elements
    background: '#F8FAFC', // Light background
    text: '#334155',       // Main text color
    lightText: '#64748B'   // Lighter text for less important elements
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCURATE':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
               style={{ background: colors.accurate.bg, color: colors.accurate.icon, border: `2px solid ${colors.accurate.border}` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'INACCURATE':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
               style={{ background: colors.inaccurate.bg, color: colors.inaccurate.icon, border: `2px solid ${colors.inaccurate.border}` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'UNVERIFIABLE':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
               style={{ background: colors.unverifiable.bg, color: colors.unverifiable.icon, border: `2px solid ${colors.unverifiable.border}` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCURATE':
        return { color: colors.accurate.text };
      case 'INACCURATE':
        return { color: colors.inaccurate.text };
      case 'UNVERIFIABLE':
        return { color: colors.unverifiable.text };
      default:
        return { color: colors.text };
    }
  };
  
  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'ACCURATE':
        return colors.accurate.bg;
      case 'INACCURATE':
        return colors.inaccurate.bg;
      case 'UNVERIFIABLE':
        return colors.unverifiable.bg;
      default:
        return 'transparent';
    }
  };

  return (
    <div className="space-y-6" style={{ background: colors.background }}>
      {/* Summary Panel */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Issues */}
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: colors.lightText }}>KEY ISSUES FOUND</h3>
            <p className="text-2xl font-bold" style={{ color: colors.inaccurate.text }}>
              {factCheckResults.filter((r) => r.status === 'INACCURATE').length}
            </p>
            <p className="text-sm" style={{ color: colors.text }}>Factual inaccuracies detected</p>
          </div>

          {/* Truth Score */}
          {truthScore !== null && (
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: colors.lightText }}>TRUTH SCORE</h3>
              <div className="flex items-center">
                <div className="text-2xl font-bold" style={{ color: colors.primary }}>{truthScore}%</div>
                <div className="ml-2 h-2 w-24 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${truthScore}%`,
                      background: truthScore >= 70 ? colors.accurate.icon : 
                                 truthScore >= 40 ? colors.unverifiable.icon : 
                                 colors.inaccurate.icon
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm" style={{ color: colors.text }}>
                {truthScore >= 90
                  ? 'Highly accurate'
                  : truthScore >= 70
                  ? 'Mostly accurate'
                  : truthScore >= 50
                  ? 'Partially accurate'
                  : 'Needs improvement'}
              </p>
            </div>
          )}

          {/* Improvement Suggestions */}
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: colors.lightText }}>IMPROVE SUGGESTIONS</h3>
            <p className="text-2xl font-bold" style={{ color: colors.primary }}>{suggestions.length}</p>
            <p className="text-sm" style={{ color: colors.text }}>Ways to strengthen your content</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium mb-2" style={{ color: colors.lightText }}>SUMMARY</h3>
          <p style={{ color: colors.text }}>{summary}</p>
          
          {/* API Information */}
          {(source || processingTime || apiVersion || apiMetadata) && (
            <div className="mt-4">
              <button 
                onClick={() => setShowApiDetails(!showApiDetails)}
                className="text-xs flex items-center"
                style={{ color: colors.primary }}
              >
                <span>{showApiDetails ? 'Hide' : 'Show'} API Details</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform ${showApiDetails ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showApiDetails && (
                <div className="mt-2 p-3 rounded-md text-xs" style={{ background: '#F1F5F9' }}>
                  {source && (
                    <div className="flex items-start mb-1">
                      <span className="font-medium mr-2" style={{ color: colors.lightText }}>Source:</span>
                      <span style={{ color: colors.text }}>{source}</span>
                    </div>
                  )}
                  
                  {processingTime && (
                    <div className="flex items-start mb-1">
                      <span className="font-medium mr-2" style={{ color: colors.lightText }}>Processing Time:</span>
                      <span style={{ color: colors.text }}>{processingTime.toFixed(2)}s</span>
                    </div>
                  )}
                  
                  {apiVersion && (
                    <div className="flex items-start mb-1">
                      <span className="font-medium mr-2" style={{ color: colors.lightText }}>API Version:</span>
                      <span style={{ color: colors.text }}>{apiVersion}</span>
                    </div>
                  )}
                  
                  {isUsingFallback && (
                    <div className="flex items-start mb-1">
                      <span className="font-medium mr-2" style={{ color: colors.lightText }}>Status:</span>
                      <span style={{ color: colors.unverifiable.text }}>Using fallback data</span>
                    </div>
                  )}
                  
                  {apiMetadata && apiMetadata.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium block mb-1" style={{ color: colors.lightText }}>APIs Used:</span>
                      <div className="space-y-1">
                        {apiMetadata.map((api, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2" 
                              style={{ background: api.success ? colors.accurate.icon : colors.inaccurate.icon }}
                            ></div>
                            <span style={{ color: colors.text }}>
                              {api.api} - {api.success ? 'Success' : `Failed (${api.error || 'Unknown error'})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fact Analysis Cards */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.secondary }}>Fact Analysis</h2>

        <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
          {factCheckResults.map((result, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="p-4 flex items-center" style={{ background: getStatusBackground(result.status) }}>
                {getStatusIcon(result.status)}
                <div className="ml-4">
                  <h3 className="font-semibold text-lg" style={getStatusColor(result.status)}>
                    {result.status === 'ACCURATE'
                      ? 'Accurate Statement'
                      : result.status === 'INACCURATE'
                      ? 'Inaccurate Statement'
                      : 'Unverifiable Statement'}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: colors.lightText }}>
                    {result.status === 'ACCURATE'
                      ? 'This claim has been verified as accurate'
                      : result.status === 'INACCURATE'
                      ? 'This claim contains inaccuracies'
                      : 'This claim could not be fully verified'}
                  </p>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 bg-white border-t border-gray-100">
                {/* The Claim */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1" style={{ color: colors.lightText }}>THE CLAIM</h4>
                  <p className="text-base font-medium" style={{ color: colors.secondary }}>"{result.claim}"</p>
                  
                  {/* Confidence Score if available */}
                  {result.confidence && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs mr-2" style={{ color: colors.lightText }}>CONFIDENCE:</span>
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${result.confidence}%`,
                            background: result.confidence >= 80 ? colors.accurate.icon : 
                                      result.confidence >= 60 ? colors.unverifiable.icon : 
                                      colors.inaccurate.icon
                          }}
                        ></div>
                      </div>
                      <span className="text-xs ml-2" style={{ color: colors.text }}>{result.confidence}%</span>
                    </div>
                  )}
                </div>
                
                {/* Analysis */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1" style={{ color: colors.lightText }}>
                    {result.status === 'ACCURATE' ? 'WHY THIS IS ACCURATE' : 
                     result.status === 'INACCURATE' ? 'WHY THIS IS INACCURATE' : 
                     'VERIFICATION DETAILS'}
                  </h4>
                  <p className="text-sm" style={{ color: colors.text }}>{result.explanation}</p>
                </div>
                
                {/* Source */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1" style={{ color: colors.lightText }}>SOURCE</h4>
                  <p className="text-sm" style={{ color: colors.text }}>{result.source}</p>
                  
                  {/* Source Links if available */}
                  {result.sourceLinks && result.sourceLinks.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium mb-1" style={{ color: colors.lightText }}>REFERENCE LINKS:</h5>
                      <ul className="text-xs space-y-1">
                        {result.sourceLinks.map((link, i) => (
                          <li key={i}>
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: colors.primary }}
                              className="hover:underline"
                            >
                              {link.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Claim Reviews if available */}
                  {result.claimReviews && result.claimReviews.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <h5 className="text-xs font-medium mb-1" style={{ color: colors.lightText }}>FACT CHECKED BY:</h5>
                      {result.claimReviews.map((review, i) => (
                        <div key={i} className="text-xs mt-1">
                          <a 
                            href={review.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: colors.primary }}
                            className="font-medium hover:underline"
                          >
                            {review.publisher.name}
                          </a>
                          <span className="mx-1">•</span>
                          <span style={{ color: colors.lightText }}>{review.reviewDate}</span>
                          <span className="mx-1">•</span>
                          <span 
                            style={{ 
                              color: review.textualRating.toLowerCase().includes('true') ? colors.accurate.text : 
                                    review.textualRating.toLowerCase().includes('false') ? colors.inaccurate.text : 
                                    colors.unverifiable.text 
                            }}
                            className="font-medium"
                          >
                            {review.textualRating}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Correction if applicable */}
                {result.correction && (
                  <div className="p-3 rounded-md" style={{ background: '#F1F5F9' }}>
                    <h4 className="text-sm font-medium mb-1" style={{ color: colors.primary }}>SUGGESTED CORRECTION</h4>
                    <p className="text-sm" style={{ color: colors.text }}>{result.correction}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {suggestions.map((suggestion, index) => (
            <div key={`suggestion-${index}`} className="rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 flex items-center" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
                     style={{ background: 'white', color: colors.primary, border: `2px solid rgba(79, 70, 229, 0.3)` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg" style={{ color: colors.primary }}>Suggestion</h3>
                  <p className="text-sm font-medium" style={{ color: colors.lightText }}>
                    Improve your content with this recommendation
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm" style={{ color: colors.text }}>{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onRewrite}
          className="px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center shadow-sm"
          style={{ background: colors.primary, color: 'white' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Rewrite for Accuracy
        </button>
        <button
          onClick={handleDownload}
          className="border px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center shadow-sm"
          style={{ background: 'white', color: colors.text, borderColor: '#E2E8F0' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Report
        </button>
        <button
          onClick={handleCopy}
          className="border px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center shadow-sm"
          style={{ background: 'white', color: colors.text, borderColor: '#E2E8F0' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={onReset}
          className="border px-6 py-3 rounded-md transition-colors flex items-center justify-center shadow-sm"
          style={{ background: 'white', color: colors.text, borderColor: '#E2E8F0' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Another Text
        </button>
      </div>
    </div>
  );
}
