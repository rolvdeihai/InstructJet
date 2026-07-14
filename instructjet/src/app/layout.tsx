// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import ClientTokenResetWrapper from '@/components/ClientTokenResetWrapper';
import './globals.css';
import { PaddleProvider } from '@/components/PaddleProvider';

export const metadata = {
  title: {
    default: 'InstructJet – AI-Powered Guide Creation & Task Evaluation',
    template: '%s | InstructJet',
  },
  description:
    'Turn vague instructions into clear, step-by-step guides with AI. Automate task evaluation, reduce rework, and improve team alignment.',
  keywords: [
    'AI guide creation',
    'step-by-step instructions',
    'task evaluation',
    'automated scoring',
    'team alignment',
    'workflow automation',
    'task guides',
    'AI assistant',
    'knowledge sharing',
    'worker feedback',
    'submission grading',
    'AI checker',
  ],
  authors: [{ name: 'Jethro Lim' }],
  creator: 'Jethro Lim',
  publisher: 'InstructJet',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'InstructJet – AI Guide Creation & Evaluation Platform',
    description:
      'Create AI-generated guides and automatically evaluate worker submissions. Boost productivity and ensure quality.',
    url: 'https://instructjet.com',
    siteName: 'InstructJet',
    images: [
      {
        url: 'https://instructjet.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InstructJet – AI Guide Creation & Evaluation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstructJet – AI Guide Creation & Evaluation',
    description:
      'Create AI-generated guides and automatically evaluate worker submissions. Boost productivity and ensure quality.',
    site: '@instructjet',
    creator: '@jethrolim',
    images: ['https://instructjet.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-site-verification', // replace
  },
  alternates: {
    canonical: 'https://instructjet.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientTokenResetWrapper>
            <PaddleProvider />
            {children}
          </ClientTokenResetWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}