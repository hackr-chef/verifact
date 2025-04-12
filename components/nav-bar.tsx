'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 shadow-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <span className="text-2xl font-bold">
                  <span className="text-blue-400">Veri</span>
                  <span className="text-white">Fact</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                Home
              </Link>
              <Link
                href="/test-fact-check"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/test-fact-check'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                Test Fact Checker
              </Link>
              <Link
                href="/debug"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/debug'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                Debug
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300 border border-blue-700">
              Beta
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1 bg-gray-900">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/'
                ? 'bg-gray-800 border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link
            href="/test-fact-check"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/test-fact-check'
                ? 'bg-gray-800 border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Test Fact Checker
          </Link>
          <Link
            href="/debug"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/debug'
                ? 'bg-gray-800 border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Debug
          </Link>
        </div>
      </div>
    </nav>
  );
}
