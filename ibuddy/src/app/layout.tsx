import './globals.css'
import { Inter } from 'next/font/google'
import { AppContextProvider } from '../context/AppContext'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iBuddy - IB Student Productivity Platform',
  description: 'A comprehensive productivity and wellness platform designed specifically for IB students',
  keywords: 'IB, International Baccalaureate, study, productivity, wellness, arena mode',
  authors: [{ name: 'iBuddy Team' }],
  creator: 'iBuddy',
  openGraph: {
    title: 'iBuddy - IB Student Productivity Platform',
    description: 'Boost your IB studies with Arena Mode, task management, and wellness tracking',
    type: 'website',
    locale: 'en_US',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {children}
          </div>
        </AppContextProvider>
      </body>
    </html>
  )
}