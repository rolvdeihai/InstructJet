// app/about/page.tsx
'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* ─── Header ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
              JL
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Jethro Lim</h1>
              <p className="text-xl text-gray-600">Software Engineer & Digital Marketer</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span>📍 Lampung, Indonesia</span>
                <span className="hidden sm:inline">•</span>
                <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                  jethro.lim@resilio-partners.com
                </a>
                <span className="hidden sm:inline">•</span>
                <a
                  href="https://github.com/rolvdeihai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* ─── The Story Behind InstructJet ────────────────────── */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-12 border border-primary-100">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">The Story Behind InstructJet</h2>
                <p className="text-gray-700 leading-relaxed">
                  As a software engineer leading projects, I kept running into the same problem: 
                  <strong> communication gaps</strong> between what managers wanted and what developers 
                  built. Whether I was receiving vague requirements or giving unclear instructions to 
                  junior devs, the result was always wasted time and frustration.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  I learned from my mentors that great communication isn't about talking more — 
                  it's about <strong>structuring information clearly</strong>. I studied frameworks 
                  used by top product managers and realized these principles could be 
                  <strong> codified into AI</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  That's why I built <strong>InstructJet</strong> — an AI-powered guide generator 
                  that turns messy instructions into structured, step-by-step guides. It helps teams 
                  align, reduces miscommunication, and gives everyone clear checkpoints to verify 
                  their work.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Experience ────────────────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-bold text-gray-800">Resilio Partners</h3>
                <p className="text-gray-600">Software Engineer & Digital Marketer · Remote</p>
                <p className="text-sm text-gray-500">Sep 2025 – Present</p>
                <p className="text-gray-700 text-sm mt-1">Building features, SEO, and digital marketing.</p>
              </div>
              <div className="border-l-4 border-primary-400 pl-4">
                <h3 className="font-bold text-gray-800">SaaSquatch Leads</h3>
                <p className="text-gray-600">Software Engineer · Remote</p>
                <p className="text-sm text-gray-500">Apr 2025 – Jul 2025</p>
                <p className="text-gray-700 text-sm mt-1">Automation and React.js development.</p>
              </div>
              <div className="border-l-4 border-primary-300 pl-4">
                <h3 className="font-bold text-gray-800">Caprae Capital Partners</h3>
                <p className="text-gray-600">Machine Learning Engineer · Remote</p>
                <p className="text-sm text-gray-500">Mar 2025 – Jul 2025</p>
                <p className="text-gray-700 text-sm mt-1">Financial data analysis with Pandas.</p>
              </div>
              <div className="border-l-4 border-primary-200 pl-4">
                <h3 className="font-bold text-gray-800">Alfagift - Global Loyalty Indonesia</h3>
                <p className="text-gray-600">Data Science Intern · Indonesia</p>
                <p className="text-sm text-gray-500">Sep 2023 – Mar 2024</p>
                <p className="text-gray-700 text-sm mt-1">Search algorithms, product & user classification.</p>
              </div>
            </div>
          </div>

          {/* ─── Education ──────────────────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-800">BINUS University</h3>
              <p className="text-gray-600">B.S. in Computer Science</p>
              <p className="text-sm text-gray-500">2020 – 2024</p>
            </div>
          </div>

          {/* ─── Skills ────────────────────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                'React.js',
                'Python',
                'Machine Learning',
                'Data Science',
                'Pandas',
                'Web Development',
                'Data Mining',
                'Data Scraping',
                'Automation',
                'Recommender Systems',
                'SEO',
                'Digital Marketing',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Featured Projects ────────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-800">Company Scraper</h3>
                <p className="text-gray-600 text-sm mt-1">
                  AI-powered scraper extracting LinkedIn, Yahoo Finance, and company insights.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Selenium</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Ollama</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Streamlit</span>
                </div>
                <a
                  href="https://github.com/rolvdeihai/company_scraper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                >
                  View on GitHub →
                </a>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-800">OneClick Smart Resume</h3>
                <p className="text-gray-600 text-sm mt-1">
                  AI career copilot helping job seekers optimize resumes for ATS systems.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">React</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">AI</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Resume</span>
                </div>
                <a
                  href="https://oneclicksmartresume.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                >
                  Visit Site →
                </a>
              </div>
            </div>
          </div>

          {/* ─── Back to Home ──────────────────────────────────────── */}
          <div className="mt-12 text-center">
            <Link href="/" className="text-primary-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}