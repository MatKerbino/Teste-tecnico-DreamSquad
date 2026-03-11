import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Billing Manager',
  description: 'Premium Multi-Tenant Billing and Subscription Management Platform',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-brand-500/30 selection:text-white">
        {children}
      </body>
    </html>
  )
}
