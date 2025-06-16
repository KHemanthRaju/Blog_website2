import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Not Found</h2>
      <p className="mb-8">Could not find the requested resource</p>
      <Link href="/" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  )
}