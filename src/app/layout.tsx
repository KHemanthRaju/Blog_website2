import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deepali\'s Blog',
  description: 'A blog website with articles on various topics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="border-b">
            <div className="container mx-auto py-4">
              <h1 className="text-3xl font-bold">Deepali&apos;s Blog</h1>
            </div>
          </header>
          <main>
            {children}
          </main>
          <footer className="border-t mt-12">
            <div className="container mx-auto py-6 text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} Deepali&apos;s Blog. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}