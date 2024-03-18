import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainNav from '@/components/MainNav'
import { ThemeProvider } from '@/components/theme-provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ticket Application',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/4.7.0/css/font-awesome.min.css" />
      </head>
      <body className={inter.className} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <nav className='flex flex-col items-center border-b mb-5 px-5 py-3'>
            <div className='max-w-6xl w-full'>
              <MainNav />
            </div>
          </nav>
          <main className='flex flex-col items-center'>
            <div className='max-w-6xl w-full'>
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
