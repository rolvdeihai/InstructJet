// app/privacy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy – InstructJet',
  description: 'How InstructJet collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Last Updated: June 19, 2026</p>
            <div className="h-1 w-20 bg-primary-600 rounded-full mt-4" />
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-primary max-w-none text-gray-700">
            <p className="lead">
              InstructJet (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your personal information
              when you use our platform.
            </p>

            <h2>1. Information We Collect</h2>
            <ul>
              <li>
                <strong>Account Information:</strong> When you sign up, we collect your email
                address, name (if provided), and a hashed password. We also store your subscription
                plan and token balances.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect certain information about
                your interactions with the Service, such as guides created, AI messages sent,
                web search queries, token consumption, and features used.
              </li>
              <li>
                <strong>Payment Information:</strong> All payments are processed by Paddle.
                We do not store your credit card details. Paddle may collect billing address,
                payment method, and transaction history on our behalf.
              </li>
              <li>
                <strong>Device & Log Data:</strong> We collect standard log data (IP address,
                browser type, operating system, referrer URLs, and timestamps) to maintain
                security and improve the Service.
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> We use essential cookies for authentication
                and session management. We may also use analytics cookies (e.g., Vercel Analytics,
                PostHog) to understand usage patterns.
              </li>
              <li>
                <strong>AI Inputs & Outputs:</strong> The content you input into AI features
                (including guide descriptions, chat messages, and generated outputs) is processed
                and stored to provide the Service and improve our models. We anonymise this data
                where possible.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide, maintain, and improve the Service.</li>
              <li>To personalise your experience (e.g., remembering your session).</li>
              <li>To process payments and manage your subscription or token purchases.</li>
              <li>To communicate with you (e.g., service updates, billing reminders, support).</li>
              <li>To enforce our Terms of Service and prevent fraudulent or abusive activity.</li>
              <li>To comply with legal obligations and respond to lawful requests.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <ul>
              <li>
                <strong>Service Providers:</strong> We share data with trusted third parties who
                help us operate the Service, including:
                <ul>
                  <li><strong>Supabase:</strong> Our database and authentication provider.</li>
                  <li><strong>Paddle:</strong> Our payment processor (billing and fraud prevention).</li>
                  <li><strong>Vercel:</strong> Our hosting and serverless function provider.</li>
                  <li><strong>AI Model Providers:</strong> We send your prompts to third‑party AI APIs (e.g., OpenAI, DeepSeek) to generate responses. These providers are contractually bound to use data only for processing your requests.</li>
                </ul>
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose information if required by law
                or if we believe it is necessary to protect our rights, property, or safety, or that
                of our users.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale
                of assets, your information may be transferred to the new owner, subject to this
                Privacy Policy.
              </li>
            </ul>

            <h2>4. Data Storage & Security</h2>
            <ul>
              <li>
                <strong>Storage:</strong> Your data is stored on secure servers operated by
                Supabase (hosted on AWS) in the United States. By using the Service, you consent
                to the transfer of your data to the US.
              </li>
              <li>
                <strong>Security Measures:</strong> We implement industry‑standard technical and
                organisational measures (encryption, access controls, regular audits) to protect
                your data. However, no method of transmission over the internet is completely
                secure, and we cannot guarantee absolute security.
              </li>
              <li>
                <strong>Retention:</strong> We retain your account data for as long as your account
                is active, and for a reasonable period afterward to comply with legal obligations
                or resolve disputes. You may delete your account and request data deletion at any
                time.
              </li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to our legal obligations).</li>
              <li><strong>Restriction:</strong> Limit how we use your data.</li>
              <li><strong>Portability:</strong> Request a machine‑readable copy of your data.</li>
              <li><strong>Objection:</strong> Object to certain processing activities (e.g., marketing).</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on it.</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <strong>jethro.lim@resilio-partners.com</strong>.
              We will respond within 30 days.
            </p>

            <h2>6. Cookies & Tracking Technologies</h2>
            <p>
              We use essential cookies to authenticate you and maintain your session. We may also
              use analytics cookies (e.g., Vercel Analytics) to understand how you use our Service,
              which helps us improve. You can disable cookies in your browser settings, but this
              may affect functionality.
            </p>

            <h2>7. Third‑Party Links & Integrations</h2>
            <p>
              The Service may contain links to external sites (e.g., Paddle checkout). We are not
              responsible for the privacy practices of those sites. We encourage you to review their
              policies before providing any personal data.
            </p>

            <h2>8. Children’s Privacy</h2>
            <p>
              InstructJet is not intended for children under 16. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected
              such data, please contact us so we can delete it.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              As a global service, your information may be processed in countries other than your
              own. We ensure that appropriate safeguards (e.g., Standard Contractual Clauses) are
              in place for such transfers to protect your data.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by email or a prominent notice on the Service. Your continued use after the
              effective date constitutes acceptance of the updated policy.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy,
              please reach out:
            </p>
            <ul>
              <li><strong>Email:</strong> jethro.lim@resilio-partners.com</li>
              <li><strong>Address:</strong> InstructJet, St. Pangkal Pinang, Tanjung Karang, Bandar Lampung, Indonesia</li>
            </ul>

            <hr className="my-8 border-gray-200" />
            <p className="text-sm text-gray-500">
              This Privacy Policy is designed to be transparent and fair. We value your trust and
              are committed to protecting your data.
            </p>
          </div>

          {/* Back to home */}
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