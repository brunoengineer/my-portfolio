import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bruno Peres — QA Engineer',
  description: 'Portfolio of Bruno Peres, QA Engineer. Confidence for each release.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-testid="app-body">{children}</body>
    </html>
  );
}
