'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    async function fetchEnvInfo() {
      try {
        const response = await fetch('/api/env-test');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnvInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEnvInfo();
  }, []);

  const handleTestSerper = async () => {
    setTestLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/fact-check-serper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'USA is a continent' }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Debug Page</h1>
        
        <div className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          
          {loading ? (
            <p>Loading environment information...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Environment</h3>
                  <p>{envInfo.environment}</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Timestamp</h3>
                  <p>{envInfo.timestamp}</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">API Keys</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 border rounded-md ${envInfo.openai_key_set ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h4 className="font-medium">OpenAI API Key</h4>
                  <p>{envInfo.openai_key_set ? 'Set ✓' : 'Not Set ✗'}</p>
                  {envInfo.openai_key_prefix && <p className="text-sm text-gray-500">Prefix: {envInfo.openai_key_prefix}</p>}
                </div>
                
                <div className={`p-4 border rounded-md ${envInfo.serpapi_key_set ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h4 className="font-medium">SerpAPI Key</h4>
                  <p>{envInfo.serpapi_key_set ? 'Set ✓' : 'Not Set ✗'}</p>
                  {envInfo.serpapi_key_prefix && <p className="text-sm text-gray-500">Prefix: {envInfo.serpapi_key_prefix}</p>}
                </div>
                
                <div className={`p-4 border rounded-md ${envInfo.serper_key_set ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h4 className="font-medium">Serper API Key</h4>
                  <p>{envInfo.serper_key_set ? 'Set ✓' : 'Not Set ✗'}</p>
                  {envInfo.serper_key_prefix && <p className="text-sm text-gray-500">Prefix: {envInfo.serper_key_prefix}</p>}
                </div>
              </div>
              
              <h3 className="font-medium mt-4 mb-2">Supabase Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 border rounded-md ${envInfo.supabase_url_set ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h4 className="font-medium">Supabase URL</h4>
                  <p>{envInfo.supabase_url_set ? 'Set ✓' : 'Not Set ✗'}</p>
                  {envInfo.supabase_url_prefix && <p className="text-sm text-gray-500">Prefix: {envInfo.supabase_url_prefix}</p>}
                </div>
                
                <div className={`p-4 border rounded-md ${envInfo.supabase_anon_key_set ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h4 className="font-medium">Supabase Anon Key</h4>
                  <p>{envInfo.supabase_anon_key_set ? 'Set ✓' : 'Not Set ✗'}</p>
                  {envInfo.supabase_anon_key_prefix && <p className="text-sm text-gray-500">Prefix: {envInfo.supabase_anon_key_prefix}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Serper API</h2>
          
          <button
            onClick={handleTestSerper}
            disabled={testLoading}
            className={`px-4 py-2 rounded-md text-white ${
              testLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {testLoading ? 'Testing...' : 'Test Serper API'}
          </button>
          
          {testResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Test Result</h3>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <h4 className="font-medium">Summary</h4>
                <p className="mb-2">{testResult.summary}</p>
                
                {testResult.apiKeyStatus && (
                  <div className="mt-2">
                    <h4 className="font-medium">API Key Status</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(testResult.apiKeyStatus, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium">Fact Check Results</h4>
                  <div className="space-y-2 mt-2">
                    {testResult.factCheckResults.map((result: any, index: number) => (
                      <div key={index} className="p-2 bg-white rounded border">
                        <div className="flex items-center mb-1">
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
                        </div>
                        <p className="text-gray-800 mb-1">"{result.claim}"</p>
                        <p className="text-sm text-gray-600">{result.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
