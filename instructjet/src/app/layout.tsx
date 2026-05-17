// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import ClientTokenResetWrapper from '@/components/ClientTokenResetWrapper';
import './globals.css';
import ClientChallenge from "@/components/ClientChallenge";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientTokenResetWrapper>
            <ClientChallenge />
            {children}
          </ClientTokenResetWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}