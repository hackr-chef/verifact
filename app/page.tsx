import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="VeriFact" width={32} height={32} />
            <span className="font-bold text-xl">VeriFact</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/app" className="text-gray-600 hover:text-gray-900">Use App</Link>
            <Link href="/test-fact-check" className="text-gray-600 hover:text-gray-900 font-medium">Test Fact Checker</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/signin" className="text-gray-600 hover:text-gray-900">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            Fact-Check Anything, Instantly.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get real-time, AI-powered feedback based on actual sources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/test-fact-check"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Fact Checker
            </Link>
            <Link
              href="/signin"
              className="inline-block bg-white border border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
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
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
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
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{audience.icon}</div>
                <h3 className="font-semibold mb-2">{audience.title}</h3>
                <p className="text-gray-600 text-sm">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What our users say</h2>
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
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Simple, transparent pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tier: "Free",
                price: "$0",
                description: "Perfect for getting started"
              },
              {
                tier: "Pro",
                price: "$29",
                description: "For serious fact-checkers",
                highlighted: true
              },
              {
                tier: "Team",
                price: "$99",
                description: "Collaborate with your team"
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${
                  plan.highlighted
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
                <div className="text-3xl font-bold mb-2">
                  {plan.price}
                  <span className="text-base font-normal opacity-75">/mo</span>
                </div>
                <p className={plan.highlighted ? "text-blue-100" : "text-gray-600"}>
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
