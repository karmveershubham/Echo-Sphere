import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Youtube } from "lucide-react"
import logo from '../public/logo.png'


export default function Home() {
  return (

    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="EchoSphere Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold">EchoSphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
            Privacy
          </Link>
          <Link
            href="/login"
            className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Mobile menu button would go here */}
        <button className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4 relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-purple-200 to-transparent opacity-50" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-[#7C3AED] mb-6">Echo Sphere</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            A futuristic name evoking a space where echoes resonate
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/learn-more"
              className="px-8 py-3 rounded-lg border-2 border-gray-200 text-gray-800 hover:border-gray-300 transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600">© 2025 Echo Sphere, Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="https://github.com" className="text-gray-600 hover:text-gray-900">
            <Github className="w-6 h-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
            <Twitter className="w-6 h-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://youtube.com" className="text-gray-600 hover:text-gray-900">
            <Youtube className="w-6 h-6" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}

