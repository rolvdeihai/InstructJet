// app/terms/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service – InstructJet',
  description: 'Terms and conditions for using InstructJet, including AI-generated content, token usage, subscriptions, and refund policies.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last Updated: June 19, 2026</p>
            <div className="h-1 w-20 bg-primary-600 rounded-full mt-4" />
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-primary max-w-none text-gray-700">
            <p className="lead">
              Welcome to InstructJet! By using our platform, you agree to the following terms.
              Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using the InstructJet website, applications,
              and services (collectively, the “Service”), you agree to be bound by these Terms of
              Service (“Terms”). If you do not agree, you may not use the Service.
            </p>

            <h2>2. User Accounts</h2>
            <ul>
              <li>
                <strong>Registration:</strong> You must provide accurate information and keep it
                updated. You are responsible for maintaining the confidentiality of your login
                credentials.
              </li>
              <li>
                <strong>Eligibility:</strong> You must be at least 16 years old or the legal age
                of majority in your jurisdiction to use the Service.
              </li>
              <li>
                <strong>Account Security:</strong> You are fully responsible for all activities
                that occur under your account. Notify us immediately of any unauthorised use.
              </li>
            </ul>

            <h2>3. Description of Services</h2>
            <p>
              InstructJet is an AI‑powered platform that allows users to create, refine, and
              publish instructional guides. Features include:
            </p>
            <ul>
              <li><strong>Guide Creation:</strong> Conversational AI that generates structured guides with sections, steps, and supporting content.</li>
              <li><strong>Web Search:</strong> Optional real‑time search to enrich responses (tokens may apply).</li>
              <li><strong>Worker Chat:</strong> After publishing, workers can ask questions about your guide; each question consumes tokens from your guide’s budget.</li>
              <li><strong>Token System:</strong> Subscription tokens renew monthly; token packs are one‑time purchases that never expire.</li>
              <li><strong>Subscription Plans:</strong> Free, Basic, and Premium with varying token allowances and features.</li>
            </ul>

            <h2>4. AI‑Generated Content & Intellectual Property</h2>
            <ul>
              <li>
                <strong>Ownership:</strong> You retain full ownership of all content you create
                using the Service (guides, titles, descriptions). However, by publishing a guide,
                you grant InstructJet a worldwide, non‑exclusive, royalty‑free license to host,
                display, and distribute your guide as part of the Service.
              </li>
              <li>
                <strong>AI Outputs:</strong> The AI generates responses based on your inputs and
                third‑party models. We do not claim ownership over AI‑generated outputs. However,
                we cannot guarantee that such outputs are original, accurate, or free from
                third‑party rights. You are responsible for reviewing and editing all AI‑generated
                content before publishing.
              </li>
              <li>
                <strong>User Content:</strong> You represent that you have all necessary rights
                to the content you submit. You agree not to upload content that infringes
                copyrights, trademarks, or other intellectual property.
              </li>
            </ul>

            <h2>5. Token System & Payments</h2>
            <ul>
              <li>
                <strong>Subscription Tokens:</strong> Monthly plan tokens (e.g., 1,000,000 for
                Premium) are reset each billing cycle. Unused subscription tokens do not roll over.
              </li>
              <li>
                <strong>Token Packs:</strong> Purchased token packs (e.g., 250,000 tokens for
                $5) are one‑time and never expire. They are added to your package token balance.
              </li>
              <li>
                <strong>Usage:</strong> Tokens are consumed when using AI features, performing
                web searches, publishing guides, or when workers ask questions about your guides.
                Token consumption rates are clearly displayed in the app.
              </li>
              <li>
                <strong>Refunds:</strong> We offer a 14‑day money‑back guarantee for monthly
                subscription payments, provided you have not used more than 10% of your monthly
                token allowance. Token packs are non‑refundable once purchased, unless otherwise
                required by law.
              </li>
              <li>
                <strong>Payment Processing:</strong> Payments are processed by Paddle.
                By subscribing or purchasing tokens, you agree to Paddle’s terms and our
                pricing policies.
              </li>
            </ul>

            <h2>6. User Conduct & Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal, fraudulent, or harmful purpose.</li>
              <li>Generate content that is defamatory, obscene, threatening, or discriminatory.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service.</li>
              <li>Use bots, scrapers, or automated systems to access the Service in a way that exceeds reasonable usage.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation.</li>
            </ul>

            <h2>7. Cancellation & Termination</h2>
            <ul>
              <li>
                <strong>By You:</strong> You may cancel your subscription at any time from your
                account settings. Cancellation will take effect at the end of your current
                billing period – no further charges will be made, and you will lose access to
                premium features after that period.
              </li>
              <li>
                <strong>By Us:</strong> We may suspend or terminate your account if we believe
                you have violated these Terms or applicable laws. In such cases, you will not be
                entitled to a refund for unused tokens or time.
              </li>
              <li>
                <strong>Effect of Termination:</strong> Upon termination, your guides will remain
                published unless you delete them; you will not be able to edit them with AI
                features. Token balances are forfeited if not used.
              </li>
            </ul>

            <h2>8. Disclaimers & Limitation of Liability</h2>
            <ul>
              <li>
                <strong>“As‑Is” Basis:</strong> The Service is provided “as is” without warranties
                of any kind, either express or implied, including but not limited to merchantability,
                fitness for a particular purpose, or non‑infringement.
              </li>
              <li>
                <strong>AI Accuracy:</strong> AI‑generated content may contain errors, biases, or
                outdated information. We do not warrant that the outputs are accurate, complete,
                or reliable. You should verify critical information independently.
              </li>
              <li>
                <strong>Limitation:</strong> To the maximum extent permitted by law, InstructJet
                and its affiliates shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or for any loss of profits, data, or goodwill,
                arising from your use of the Service, even if advised of the possibility.
              </li>
              <li>
                <strong>Total Liability:</strong> Our total aggregate liability to you for any
                claims arising from these Terms or the Service shall not exceed the amount you
                paid to us in the preceding 12 months, or $100 if no payment was made.
              </li>
            </ul>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless InstructJet, its officers, employees,
              and agents from any claims, damages, losses, liabilities, costs, and expenses
              (including reasonable legal fees) arising from your use of the Service, your
              violation of these Terms, or your infringement of any third‑party rights.
            </p>

            <h2>10. Governing Law & Dispute Resolution</h2>
            <ul>
              <li>
                These Terms shall be governed by and construed in accordance with the laws of
                the State of Delaware, without regard to its conflict of law provisions.
              </li>
              <li>
                Any dispute arising from these Terms shall be resolved exclusively through
                binding arbitration conducted in Wilmington, Delaware, in accordance with the
                rules of the American Arbitration Association. You waive any right to a jury
                trial or to participate in a class action.
              </li>
            </ul>

            <h2>11. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. We will notify you of
              significant changes via email or by posting a notice on the Service. Your continued
              use after the effective date constitutes acceptance of the revised Terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <strong>Email:</strong> jethro.lim@resilio-partners.com
              <br />
              <strong>Address:</strong> InstructJet, St. Pangkal Pinang, Tanjung Karang, Bandar Lampung, Indonesia
            </p>

            <hr className="my-8 border-gray-200" />
            <p className="text-sm text-gray-500">
              By using InstructJet, you acknowledge that you have read, understood, and agree
              to be bound by these Terms.
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