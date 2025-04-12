"use client"

import Link from "next/link";
// import { useState } from "react";

export default function ResultsPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">VF</span>
            </div>
            <span className="font-bold text-lg">VeriFact</span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/app" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/app/history" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                <span>History</span>
              </Link>
            </li>
            <li>
              <Link href="/app/saved" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span>Saved feedback</span>
              </Link>
            </li>
            <li>
              <Link href="/app/settings" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Settings</span>
              </Link>
            </li>
            <li className="mt-6">
              <div className="p-2">
                <button className="flex items-center space-x-2 w-full text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 12.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Sign out</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">VF</span>
            </div>
            <span className="font-bold text-lg">VeriFact</span>
          </Link>
          <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 md:pt-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Fact Check Results</h1>

          {/* Summary Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Issues */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">KEY ISSUES FOUND</h3>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Factual inaccuracies detected</p>
              </div>

              {/* Truth Score */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">TRUTH SCORE</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="ml-2 bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Mostly accurate</p>
              </div>

              {/* Improvement Suggestions */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">IMPROVE SUGGESTIONS</h3>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Ways to strengthen your content</p>
              </div>
            </div>
          </div>

          {/* Fact Analysis Cards */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Fact Analysis</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Accurate Fact */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    ✅
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Accurate</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"Nigeria's population is over 200M."</p>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="font-medium text-green-600">✔️ Verified</span>
                        <span className="mx-1">–</span>
                        <span>World Bank (2023)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inaccurate Fact */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    ❌
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Inaccurate</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"JavaScript is the oldest programming language."</p>
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <span className="font-medium">❌ Not True</span>
                        <span className="mx-1">–</span>
                        <span>Lisp predates it by decades. (MIT, 1960s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    🧠
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Suggestion</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"Add a source for 'remote work decline' to strengthen this claim."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Accurate Fact */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    ✅
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Accurate</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"The Earth orbits the Sun."</p>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="font-medium text-green-600">✔️ Verified</span>
                        <span className="mx-1">–</span>
                        <span>Basic astronomical fact</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Inaccurate Fact */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    ❌
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Inaccurate</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"The Great Wall of China is visible from space with the naked eye."</p>
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <span className="font-medium">❌ Not True</span>
                        <span className="mx-1">–</span>
                        <span>NASA confirms it's not visible to the naked eye from orbit (NASA, 2005)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Suggestion */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    🧠
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Suggestion</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"Consider adding specific statistics about climate change impacts to make your argument stronger."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Suggestion */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    🧠
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">Suggestion</h3>
                    <div className="mt-1">
                      <p className="text-gray-800">"The paragraph about economic growth would benefit from recent data from a reputable source."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex-1 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Rewrite for Accuracy
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Report
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy to Clipboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
