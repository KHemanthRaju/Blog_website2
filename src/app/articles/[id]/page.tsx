import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongoose'
import Article from '@/lib/models/article'

// Make the page dynamic to fetch latest data on each request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getArticle(id: string) {
  await dbConnect()
  
  try {
    const article = await Article.findById(id).lean()
    
    if (!article) {
      return null
    }
    
    return {
      ...article,
      id: article._id.toString(),
      _id: article._id.toString()
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)
  
  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span>{article.author.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="relative w-full h-64 mb-8">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            {article.coverImage.endsWith('.jpg') || article.coverImage.endsWith('.jpeg') || 
             article.coverImage.endsWith('.png') || article.coverImage.endsWith('.svg') ? (
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="h-full w-full object-contain" 
              />
            ) : (
              <span className="text-gray-500">Image: {article.coverImage}</span>
            )}
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{paragraph.substring(4)}</h3>
            } else if (paragraph.startsWith('```')) {
              return null; // Skip code block markers
            } else if (paragraph.trim() === '') {
              return null; // Skip empty lines
            } else if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
              // Simple numbered list handling
              return <li key={index} className="ml-6 mb-2">{paragraph.substring(3)}</li>
            } else {
              return <p key={index} className="mb-4">{paragraph}</p>
            }
          })}
        </div>
      </div>
    </div>
  )
}