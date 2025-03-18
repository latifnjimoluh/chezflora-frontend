import { Suspense } from "react"
import BlogPostPage from "../blog-post-page"
import { Loader2 } from "lucide-react"

export default function BlogPostRoute({ params }: { params: { slug: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-soft-green" />
          <p className="mt-4 text-light-brown">Chargement de l'article...</p>
        </div>
      }
    >
      <BlogPostPage params={params} />
    </Suspense>
  )
}

