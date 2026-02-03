import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ATLAS | Global Health Identity Platform',
  description: 'Patient-owned, globally portable health records with secure sharing and emergency access.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-clinical-50">
        {children}
      </body>
    </html>
  )
}
