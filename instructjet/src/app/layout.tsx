// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import ClientTokenResetWrapper from '@/components/ClientTokenResetWrapper';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientTokenResetWrapper>
            {children}
          </ClientTokenResetWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}