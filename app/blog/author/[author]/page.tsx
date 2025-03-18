"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Tag, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API from "@/services/apis"

export default function AuthorPage({ params }: { params: { author: string } }) {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [authorInfo, setAuthorInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const decodedAuthor = decodeURIComponent(params.author).replace(/-/g, " ")

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log(`Chargement des articles de l'auteur: ${decodedAuthor}`)

        try {
          // Récupérer les informations de l'auteur
          const authorData = await API.blog.getAuthorInfo(decodedAuthor)
          setAuthorInfo(authorData)

          // Récupérer les articles de l'auteur
          const authorPosts = await API.blog.getPostsByAuthor(decodedAuthor)

          if (authorPosts && authorPosts.length > 0) {
            console.log(`${authorPosts.length} articles trouvés pour l'auteur: ${decodedAuthor}`)
            setPosts(authorPosts)
          } else {
            console.log(`Aucun article trouvé pour l'auteur: ${decodedAuthor}`)
            setPosts([])
          }
        } catch (apiErr) {
          console.error(`Erreur lors de la récupération des données pour l'auteur ${decodedAuthor}:`, apiErr)
          setError(`Impossible de charger les articles pour l'auteur "${decodedAuthor}". Veuillez réessayer plus tard.`)
          setPosts([])
        }
      } catch (err: any) {
        console.error("Erreur générale:", err)
        setError(err.message || "Une erreur est survenue lors du chargement des articles")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.author) {
      fetchAuthorData()
    }
  }, [params.author, decodedAuthor])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      if (dateString.includes("T")) {
        // Format ISO
        return new Date(dateString).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      }
      return dateString
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-light-brown/70 hover:text-light-brown">
                  Accueil
                </Link>
              </li>
              <li className="text-light-brown/70">/</li>
              <li>
                <Link href="/blog" className="text-light-brown/70 hover:text-light-brown">
                  Blog
                </Link>
              </li>
              <li className="text-light-brown/70">/</li>
              <li>
                <span className="text-light-brown font-medium">Auteur: {decodedAuthor}</span>
              </li>
            </ol>
          </nav>

          {/* Author Info */}
          {authorInfo && (
            <Card className="border-none shadow-md mb-10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={authorInfo.avatar} alt={authorInfo.name} />
                    <AvatarFallback>{authorInfo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="font-script text-3xl md:text-4xl text-light-brown mb-3">{authorInfo.name}</h1>
                    <p className="text-light-brown/80 mb-4">{authorInfo.bio}</p>
                    {authorInfo.specialties && authorInfo.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="text-light-brown font-medium">Spécialités:</span>
                        {authorInfo.specialties.map((specialty: string) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center bg-beige/50 px-2 py-1 rounded-full text-xs text-light-brown"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="font-script text-2xl md:text-3xl text-light-brown mb-4">Articles de {decodedAuthor}</h2>
            <p className="text-light-brown/80 max-w-2xl mx-auto">Découvrez tous les articles rédigés par cet auteur.</p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-soft-green"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-light-brown text-lg mb-4">{error}</p>
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white" onClick={() => router.push("/blog")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg?height=400&width=600"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                        {post.category}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center text-sm text-light-brown/70 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{formatDate(post.date)}</span>
                      </div>
                      <h2 className="font-script text-xl text-light-brown mb-2">{post.title}</h2>
                      <p className="text-light-brown/80 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags &&
                          Array.isArray(post.tags) &&
                          post.tags.map((tag: string) => (
                            <Link
                              key={tag}
                              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                              className="inline-flex items-center bg-beige/50 hover:bg-beige px-2 py-1 rounded-full text-xs text-light-brown transition-colors"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Link>
                          ))}
                      </div>
                      <div className="text-soft-green font-medium hover:underline">Lire la suite →</div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-light-brown text-lg mb-4">Aucun article trouvé pour l'auteur "{decodedAuthor}"</p>
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white" onClick={() => router.push("/blog")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </div>
          )}

          {/* Back Button */}
          {posts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Button
                variant="outline"
                className="border-light-brown text-light-brown hover:bg-light-brown/10"
                onClick={() => router.push("/blog")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

