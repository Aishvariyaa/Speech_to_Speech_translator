import '../styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Translator - AI-Powered Speech Translation',
  description: 'Break language barriers with real-time AI speech translation across Indian languages. Speak naturally and connect instantly.',
  keywords: 'speech translation, AI translator, Indian languages, real-time translation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
