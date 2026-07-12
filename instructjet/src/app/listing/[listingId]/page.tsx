import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserIcon,
  TagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

export default async function ListingPage({ params }: { params: { listingId: string } }) {
  const { listingId } = await params;

  // Fetch listing
  const { data: listing, error: listingError } = await supabaseAdmin
    .from('guide_listings')
    .select(`
      id,
      description,
      category,
      contact_info,
      price,
      active_until,
      guide_id
    `)
    .eq('id', listingId)
    .eq('is_active', true)
    .gt('active_until', new Date().toISOString())
    .single();

  if (listingError || !listing) {
    console.error('Listing not found:', listingError);
    notFound();
  }

  // Fetch guide
  const { data: guide, error: guideError } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, content, user_id')
    .eq('id', listing.guide_id)
    .single();

  if (guideError || !guide) {
    notFound();
  }

  // Fetch seller info from users table
  const { data: seller, error: sellerError } = await supabaseAdmin
    .from('users')
    .select('id, full_name, email')
    .eq('id', guide.user_id)
    .single();

  const sellerName = seller?.full_name || seller?.email || 'Unknown';
  // Derive a username from email for profile link (if no username column)
  const username = seller?.email ? seller.email.split('@')[0] : 'unknown';

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Header Section with gradient */}
      <section className="relative pt-24 pb-8 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-blue-700 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {guide.title}
          </h1>
          <p className="text-blue-100 text-lg">
            Premium guide available for purchase
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          {/* Price and Status */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
              <CurrencyDollarIcon className="h-4 w-4" />
              For Sale
            </span>
            <span className="text-2xl font-bold text-primary-600">
              ${listing.price?.toFixed(2)}
            </span>
            {listing.category && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <TagIcon className="h-4 w-4" />
                {listing.category}
              </span>
            )}
          </div>

          {/* Seller Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b py-4 my-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-full">
                <UserIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Seller</p>
                <Link
                  href={`/profile/${username}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {sellerName}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-full">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(listing.active_until).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Blurred Guide Content */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
              Guide Preview (Blurred)
            </h2>
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-6">
              <div className="prose max-w-none opacity-30 blur-md pointer-events-none select-none">
                <div dangerouslySetInnerHTML={{ __html: guide.content || '' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="text-center p-6 bg-white/80 rounded-xl shadow-md max-w-sm">
                  <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-800">Content Locked</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Purchase this guide to unlock the full content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buy / Contact Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Contact:</span> {listing.contact_info}
            </div>
            <a
              href={`mailto:${listing.contact_info}?subject=Interested%20in%20buying%20guide%3A%20${encodeURIComponent(guide.title)}&body=Hi%2C%20I%27m%20interested%20in%20your%20guide%20%22${encodeURIComponent(guide.title)}%22.%20Could%20we%20discuss%20the%20details%3F`}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Buy / Contact Seller
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Clicking will open your default email client. You can negotiate and request the password directly with the seller.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}