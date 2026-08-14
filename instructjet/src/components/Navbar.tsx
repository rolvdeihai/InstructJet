// src/components/Navbar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ChallengePopup from '@/components/ChallengePopup';
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TrophyIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [showChallengePopup, setShowChallengePopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleToolsDropdown = () => setIsToolsDropdownOpen(!isToolsDropdownOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsDropdownOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Helper to check active link
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/explore', label: 'Explore', icon: GlobeAltIcon },
    { href: '/about', label: 'About', icon: InformationCircleIcon },
    { href: '/contact', label: 'Contact', icon: EnvelopeIcon },
  ];

  const toolLinks = user
    ? [
        { href: '/create', label: 'Create Guide', icon: PlusCircleIcon },
        { href: '/guides', label: 'My Guides', icon: DocumentTextIcon },
        { href: '/submissions', label: 'Work Submissions', icon: PhotoIcon },
        { href: '/sell', label: 'Sell a Guide', icon: ShoppingCartIcon },
      ]
    : [{ href: '/login', label: 'Login to access tools', icon: WrenchScrewdriverIcon }];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20'
            : 'bg-white/60 backdrop-blur-sm border-b border-gray-100/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
              >
                InstructJet
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 group ${
                    isActive(link.href)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  <link.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleToolsDropdown}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isToolsDropdownOpen || 
                    pathname.startsWith('/create') || 
                    pathname.startsWith('/guides') || 
                    pathname.startsWith('/submissions') ||
                    pathname.startsWith('/sell')
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  <WrenchScrewdriverIcon className="h-4 w-4" />
                  Tools
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isToolsDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 py-1 z-10 animate-fadeInUp origin-top-right"
                  >
                    {toolLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        <link.icon className="h-5 w-5 text-gray-400" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/certificates"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isActive('/certificates')
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4" />
                Certificates
              </Link>
              <Link
                href="/pricing"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isActive('/pricing')
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                }`}
              >
                <CurrencyDollarIcon className="h-4 w-4" />
                Pricing
              </Link>
            </div>

            {/* Right side: user / auth */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Challenge Button */}
              <button
                onClick={() => setShowChallengePopup(true)}
                className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <TrophyIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Challenge</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-primary-50"
                  >
                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                    <span className="text-sm font-medium hidden xl:block">
                      {user.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 py-1 z-10 animate-fadeInUp origin-top-right">
                      <Link
                        href="/profile/me"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowChallengePopup(true)}
                className="p-2 text-amber-500 hover:text-amber-600 transition-colors"
              >
                <TrophyIcon className="h-6 w-6" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
            onClick={toggleMobileMenu}
          />
          <div
            className="fixed top-0 right-0 h-full w-64 bg-white/95 backdrop-blur-lg shadow-2xl z-50 md:hidden animate-slideInRight overflow-y-auto"
          >
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-primary-600">Menu</span>
                <button onClick={toggleMobileMenu} className="p-1 text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleToolsDropdown();
                    // keep dropdown toggle local
                  }}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                    Tools
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isToolsDropdownOpen && (
                  <div className="ml-6 pl-3 border-l-2 border-gray-200 space-y-1">
                    {toolLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
                <Link
                  href="/certificates"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/certificates')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Certificates
                </Link>
                <Link
                  href="/pricing"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/pricing')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <CurrencyDollarIcon className="h-5 w-5" />
                  Pricing
                </Link>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {user.full_name?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {user.full_name || user.email}
                      </div>
                    </div>
                    <Link
                      href="/profile/me"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <UserIcon className="h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      Dashboard
                    </Link>
                    {/* ✅ Added Settings link here */}
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <Cog6ToothIcon className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 text-center transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Challenge Popup */}
      <ChallengePopup
        isOpen={showChallengePopup}
        onClose={() => setShowChallengePopup(false)}
      />
    </>
  );
}