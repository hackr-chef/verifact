'use client';

import { useState, useEffect } from 'react';
import TextInputForm from '../../components/text-input-form';
import FactCheckResults from '../../components/fact-check-results';
import { trackPageView, trackFactCheck, trackFeatureUsage } from '@/lib/analytics';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Track page view when component mounts
  useEffect(() => {
    trackPageView('app_dashboard');
  }, []);

  // Function to extract text from uploaded files
  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === 'text/plain') {
      return await file.text();
    }

    // For PDFs, DOCs, etc., we would need to use a specialized library or API
    // This is a placeholder - in a real implementation, you would integrate with
    // a document parsing service or library
    console.log(`File uploaded: ${file.name} (${file.type})`);
    return `Content from file: ${file.name}`;
  };

  // Submit handler using Serper API
  const handleSubmit = async (text: string, file: File | null) => {
    setIsLoading(true);

    // Track fact check started
    const startTime = Date.now();
    trackFactCheck('started', {
      textLength: text.length,
      apiUsed: 'serper',
      hasFile: !!file
    });

    try {
      let textToCheck = text;

      // If a file was uploaded, extract its text content
      if (file) {
        trackFeatureUsage('file_upload', true);
        const fileContent = await extractTextFromFile(file);
        textToCheck += `\n\n${fileContent}`;
      }

      // Check facts using Serper API
      console.log('Using Serper fact-checking API...');
      const response = await fetch('/api/fact-check-serper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToCheck }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log('Fact-checking completed successfully');
      setResults(data);

      // Track fact check completed
      const processingTime = Date.now() - startTime;
      trackFactCheck('completed', {
        textLength: textToCheck.length,
        apiUsed: 'serper',
        processingTime,
        hasFile: !!file,
        factCount: data.factCheckResults?.length || 0
      });
    } catch (error) {
      console.error('Error during fact checking:', error);

      // Set a user-friendly error message
      setResults({
        summary: "We encountered an unexpected error while checking your facts.",
        factCheckResults: [],
        suggestions: ["Please try again with a different text or contact support if the problem persists."],
        truthScore: null,
        error: true
      });

      // Track fact check error
      trackFactCheck('error', {
        textLength: text.length,
        apiUsed: 'serper',
        hasFile: !!file,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = () => {
    // This would typically call an AI service to rewrite the text
    // For now, we'll just reset to the input form
    trackFeatureUsage('rewrite_request');
    setResults(null);
  };

  // Color theme
  const colors = {
    primary: '#3B82F6',    // Blue as primary color
    secondary: '#1E40AF',  // Darker blue for secondary elements
    background: '#0F172A', // Dark background
    success: '#10B981',    // Green for success
    warning: '#F59E0B',    // Amber for warnings
    error: '#EF4444',      // Red for errors
  };

  return (
    <div className="min-h-screen" style={{ background: colors.background }}>
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold flex items-center">
            <div className="relative w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">VF</span>
            </div>
            <span style={{ color: colors.primary }}>Veri</span>
            <span className="text-white">Fact</span>
            <span className="ml-2 px-2 py-1 text-xs rounded-full"
                  style={{ background: 'rgba(59, 130, 246, 0.1)', color: colors.primary }}>
              BETA
            </span>
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {results ? (
            <FactCheckResults
              {...results}
              onReset={() => setResults(null)}
              onRewrite={handleRewrite}
            />
          ) : (
            <>
              <TextInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
