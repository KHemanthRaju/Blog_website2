import Link from 'next/link'
import { Card } from '@/components/ui/card'
import dbConnect from '@/lib/mongoose'
import Article from '@/lib/models/article'

// Make the page dynamic to fetch latest data on each request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getArticles() {
  await dbConnect()
  // Only fetch published articles and convert _id to id
  const articles = await Article.find({ published: true })
    .sort({ date: -1 })
    .lean()
  
  // Convert MongoDB documents to plain objects and handle _id
  return articles.map(article => ({
    ...article,
    id: article._id.toString(),
    _id: article._id.toString()
  }))
}

export default async function Home() {
  const articles = await getArticles()
  
  return (
    <>
      {/* Banner Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative bg-gray-200 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Deepali's Blog</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Insights, tutorials, and stories</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">No articles published yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {articles.map((article, index) => (
              <Link href={`/articles/${article.id}`} key={article.id} className="block transition-all hover:shadow-md">
                <Card className="overflow-hidden">
                  <div className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image */}
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        {article.coverImage.endsWith('.jpg') || article.coverImage.endsWith('.jpeg') || 
                         article.coverImage.endsWith('.png') || article.coverImage.endsWith('.svg') ? (
                          <img 
                            src={article.coverImage} 
                            alt={article.title}
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <span className="text-gray-500">Image: {article.coverImage}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-muted-foreground mb-4">{article.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">{article.author.name.charAt(0)}</span>
                        </div>
                        <span className="text-sm">{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}