// app/refund-policy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy – InstructJet',
  description: 'InstructJet refund policy for subscriptions and token packs. 14-day money-back guarantee and token refund terms.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Refund Policy</h1>
            <p className="text-lg text-gray-600">Last Updated: June 29, 2026</p>
            <div className="h-1 w-20 bg-primary-600 rounded-full mt-4" />
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-primary max-w-none text-gray-700">
            <p className="lead">
              At InstructJet, we want you to be completely satisfied with your experience. 
              This Refund Policy outlines the terms and conditions for refunds on subscriptions 
              and token purchases.
            </p>

            <h2>1. Subscription Refunds</h2>
            <p>
              We offer a <strong>14-day money-back guarantee</strong> for monthly subscription payments.
            </p>
            <ul>
              <li>
                <strong>Eligibility:</strong> You may request a refund within 14 days of your initial 
                subscription payment, provided you have not used more than <strong>10%</strong> of your 
                monthly token allowance.
              </li>
              <li>
                <strong>How to request:</strong> Contact us at{' '}
                <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                  jethro.lim@resilio-partners.com
                </a>{' '}
                with your account email and the reason for your refund request.
              </li>
              <li>
                <strong>Processing time:</strong> Refunds are typically processed within 5–7 business 
                days and will be issued to your original payment method (via Paddle).
              </li>
              <li>
                <strong>Partial refunds:</strong> If more than 10% of your tokens have been used, 
                refunds may be prorated based on remaining tokens.
              </li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 text-sm font-medium">
                💡 <strong>Note:</strong> If you cancel your subscription, your premium features 
                will remain active until the end of your current billing period. You will not 
                receive a refund for unused time unless the refund is requested within the 
                14-day window.
              </p>
            </div>

            <h2>2. Token Pack Refunds</h2>
            <p>
              Token packs are one-time purchases that never expire. Because tokens are immediately 
              added to your account upon purchase, they are <strong>non-refundable</strong> once 
              purchased, unless otherwise required by law.
            </p>
            <p>
              However, if you have <strong>unused tokens</strong> from a token pack purchased within the 
              last <strong>30 days</strong>, you may request a refund from your{' '}
              <Link href="/settings" className="text-primary-600 hover:underline">
                Settings page
              </Link>{' '}
              under the <strong>Billing &amp; Tokens</strong> tab.
            </p>
            <p>Eligibility for token pack refunds:</p>
            <ul>
              <li>
                <strong>Unused tokens:</strong> Only tokens that have <em>not</em> been consumed 
                (through guide creation, web search, worker chat, publishing, etc.) are refundable.
              </li>
              <li>
                <strong>Time limit:</strong> The purchase must have been made within the last 
                30 days.
              </li>
              <li>
                <strong>Proof of purchase:</strong> We may ask for transaction details or the 
                PayPal/Paddle transaction ID.
              </li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ <strong>Important:</strong> Token pack refunds are granted at our discretion. 
                If you have used a significant portion of the tokens, we may not be able to 
                issue a full refund.
              </p>
            </div>

            <h2>3. How to Request a Refund</h2>
            <ol>
              <li>
                <strong>Subscriptions:</strong> Email us at{' '}
                <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                  jethro.lim@resilio-partners.com
                </a>{' '}
                with your account email and the date of the charge.
              </li>
              <li>
                <strong>Token packs:</strong> Visit your{' '}
                <Link href="/settings" className="text-primary-600 hover:underline">
                  Settings page
                </Link>{' '}
                → Billing &amp; Tokens → Click <strong>"Request Refund"</strong> under package tokens.
              </li>
              <li>
                Alternatively, you can contact our support team at{' '}
                <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                  jethro.lim@resilio-partners.com
                </a>{' '}
                with your request.
              </li>
            </ol>
            <p>
              We will review your request and respond within <strong>2 business days</strong>.
            </p>

            <h2>4. Refund Processing</h2>
            <ul>
              <li>
                <strong>Payment processor:</strong> All payments are processed by{' '}
                <a href="https://paddle.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  Paddle
                </a>
                . Refunds will be issued to the original payment method.
              </li>
              <li>
                <strong>Timeframe:</strong> Please allow <strong>5–10 business days</strong> for 
                the refund to appear on your bank or credit card statement.
              </li>
              <li>
                <strong>Transaction fees:</strong> Payment processing fees may be deducted from 
                the refund amount.
              </li>
            </ul>

            <h2>5. Cancellation vs. Refund</h2>
            <p>
              <strong>Canceling</strong> your subscription stops future billing but does not 
              automatically trigger a refund. To receive a refund, you must explicitly request 
              one as described above.
            </p>
            <ul>
              <li>
                If you cancel within the 14-day window and have used less than 10% of your tokens, 
                you are eligible for a full refund.
              </li>
              <li>
                If you cancel after 14 days, you will continue to have access to premium features 
                until the end of your current billing period.
              </li>
            </ul>

            <h2>6. Exceptions</h2>
            <p>
              The following situations are <strong>not</strong> eligible for refunds:
            </p>
            <ul>
              <li>
                Subscription payments that have passed the 14-day money-back guarantee period.
              </li>
              <li>
                Token packs where the tokens have been partially or fully consumed.
              </li>
              <li>
                Subscription renewals (unless within the 14-day window from the renewal date).
              </li>
              <li>
                Charges for services rendered (e.g., guide creation, AI processing) – tokens 
                consumed are not refundable.
              </li>
            </ul>

            <h2>7. Chargebacks & Disputes</h2>
            <p>
              If you have a billing issue, we encourage you to contact us directly before 
              initiating a chargeback. We are happy to resolve any concerns and process refunds 
              when appropriate. Chargebacks filed without contacting us first may result in 
              suspension of your account.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Refund Policy at any time. We will notify you 
              of material changes via email or a prominent notice on the Service. Your continued 
              use after the effective date constitutes acceptance of the updated policy.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Refund Policy or need assistance with a 
              refund request, please contact us at:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:jethro.lim@resilio-partners.com" className="text-primary-600 hover:underline">
                  jethro.lim@resilio-partners.com
                </a>
              </li>
              <li>
                <strong>Address:</strong> InstructJet, St. Pangkal Pinang, Tanjung Karang, Bandar Lampung, Indonesia
              </li>
            </ul>

            <hr className="my-8 border-gray-200" />
            <p className="text-sm text-gray-500">
              We are committed to fair and transparent refund practices. Your satisfaction is 
              our priority.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}