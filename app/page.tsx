import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">VF</span>
            </div>
            <span className="font-bold text-xl text-white">VeriFact</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/app" className="text-gray-300 hover:text-white">Use App</Link>
            <Link href="/test-fact-check" className="text-gray-300 hover:text-white font-medium">Test Fact Checker</Link>
            <Link href="/debug" className="text-gray-300 hover:text-white">Debug</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-white">
            Fact-Check Anything, Instantly.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get real-time, AI-powered feedback based on actual sources. 100% Free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/test-fact-check"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Fact Checker
            </Link>
            <Link
              href="/app"
              className="inline-block bg-blue-500/20 border border-blue-500 text-blue-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-500/30 transition-colors"
            >
              Start Using Now
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "✍️",
                title: "Enter Input",
                description: "Paste your text or upload a document"
              },
              {
                icon: "🔍",
                title: "Live Fact Check",
                description: "AI analyzes against trusted sources"
              },
              {
                icon: "💡",
                title: "Get Feedback",
                description: "Receive detailed verification report"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-blue-500">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">
            For creators, students, founders, and thinkers.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🎨",
                title: "Creators",
                description: "Verify content accuracy"
              },
              {
                icon: "📚",
                title: "Students",
                description: "Check research sources"
              },
              {
                icon: "🚀",
                title: "Founders",
                description: "Validate market claims"
              },
              {
                icon: "💭",
                title: "Thinkers",
                description: "Test hypotheses"
              }
            ].map((audience, index) => (
              <div key={index} className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-3">{audience.icon}</div>
                <h3 className="font-semibold mb-2 text-white">{audience.title}</h3>
                <p className="text-gray-400 text-sm">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">What our users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "VeriFact helped me validate my research in minutes instead of hours.",
                author: "Sarah J.",
                role: "Journalist"
              },
              {
                quote: "I use this for every blog post. It's like having a fact-checker on your team.",
                author: "Michael T.",
                role: "Content Creator"
              },
              {
                quote: "As a teacher, I recommend this to all my students for research papers.",
                author: "Dr. Lisa R.",
                role: "Professor"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
                <p className="italic text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-blue-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Start fact-checking today</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            VeriFact is completely free. No sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/app"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Using Now
            </Link>
            <Link
              href="/test-fact-check"
              className="inline-block bg-blue-500/20 border border-blue-500 text-blue-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-500/30 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">VF</span>
                </div>
                <span className="font-bold text-xl text-white">VeriFact</span>
              </div>
              <p className="text-sm">Fact-checking made simple and reliable.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/test-fact-check" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">App</Link></li>
                <li><Link href="/debug" className="hover:text-white transition-colors">Debug</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} VeriFact. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
