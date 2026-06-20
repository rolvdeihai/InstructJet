'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleToolsDropdown = () => setIsToolsDropdownOpen(!isToolsDropdownOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              InstructJet
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
              Contact
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleToolsDropdown}
                className="flex items-center text-gray-700 hover:text-primary-600 text-sm font-medium focus:outline-none"
              >
                Tools
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isToolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-10">
                  {user ? (
                    <>
                      <Link
                        href="/create"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        Create Guide
                      </Link>
                      <Link
                        href="/guides"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        My Guides
                      </Link>
                      <Link
                        href="/submissions"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        Work Submissions
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsToolsDropdownOpen(false)}
                    >
                      Login to access tools
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link href="/certificates" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
              Certificates
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
              Pricing
            </Link>
          </div>

          {/* Right side: user / auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">Hello, {user.full_name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                >
                  Logout
                </button>
                <Link
                  href="/dashboard"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>

          {/* Mobile Tools dropdown */}
          <div>
            <button
              onClick={toggleToolsDropdown}
              className="flex items-center text-gray-700 hover:text-primary-600 text-sm font-medium w-full text-left py-1"
            >
              Tools
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isToolsDropdownOpen && (
              <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                {user ? (
                  <>
                    <Link
                      href="/create-guide"
                      className="block text-gray-600 hover:text-primary-600 text-sm py-1"
                      onClick={() => { setIsToolsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                    >
                      Create Guide
                    </Link>
                    <Link
                      href="/my-guides"
                      className="block text-gray-600 hover:text-primary-600 text-sm py-1"
                      onClick={() => { setIsToolsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                    >
                      My Guides
                    </Link>
                    <Link
                      href="/submissions"
                      className="block text-gray-600 hover:text-primary-600 text-sm py-1"
                      onClick={() => { setIsToolsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                    >
                      Work Submissions
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block text-gray-600 hover:text-primary-600 text-sm py-1"
                    onClick={() => { setIsToolsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                  >
                    Login to access tools
                  </Link>
                )}
              </div>
            )}
          </div>

          <Link href="/certificates" className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
            Certificates
          </Link>
          <Link href="/pricing" className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>

          {/* Mobile auth */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            {user ? (
              <>
                <span className="block text-sm text-gray-700">Hello, {user.full_name || user.email}</span>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block text-gray-700 hover:text-primary-600 text-sm font-medium w-full text-left py-1"
                >
                  Logout
                </button>
                <Link
                  href="/dashboard"
                  className="block bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-primary-600 text-sm font-medium py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}