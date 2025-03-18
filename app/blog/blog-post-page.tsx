"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Tag, MessageSquare, Heart, Share2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API from "@/services/apis"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [blogPost, setBlogPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [liked, setLiked] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({})

  // Vérifier si l'utilisateur est connecté - une seule fois au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = API.auth.isAuthenticated()
        setIsLoggedIn(isAuth)

        if (isAuth) {
          try {
            await API.auth.getCurrentUser()
          } catch (profileError) {
            console.error("Erreur lors de la récupération du profil utilisateur:", profileError)
          }
        }
      } catch (authError) {
        console.error("Erreur lors de la vérification de l'authentification:", authError)
        setIsLoggedIn(false)
      }
    }

    checkAuth()
  }, []) // Dépendance vide = exécution unique au montage

  // Charger les données du blog post - une seule fois au chargement
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!params || !params.slug) {
        setError("Aucun article spécifié ou URL incorrecte")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Récupérer l'article
        try {
          const post = await API.blog.getPostBySlug(params.slug)

          if (!post) {
            setError("Article non trouvé")
            setIsLoading(false)
            return
          }

          setBlogPost(post)

          // Récupérer les commentaires
          try {
            console.log(`Tentative de récupération des commentaires pour l'article ID: ${post.id}`)
            const postComments = await API.blog.getPostComments(post.id)
            console.log("Commentaires récupérés avec succès:", postComments ? postComments.length : 0)
            setComments(postComments || [])
          } catch (commentErr) {
            console.error(`Erreur lors de la récupération des commentaires (postId: ${post.id}):`, commentErr)
            console.log("Initialisation des commentaires avec un tableau vide en raison de l'erreur")
            setComments([])
            // Ne pas bloquer le flux si la récupération des commentaires échoue
          }

          // Vérifier si l'utilisateur a aimé l'article
          if (isLoggedIn && post.id) {
            try {
              const likeStatus = await API.blog.checkPostLike(post.id)
              setLiked(likeStatus.liked || false)
            } catch (likeErr) {
              console.error("Erreur lors de la vérification du like:", likeErr)
              setLiked(false)
            }
          }

          // Récupérer les articles similaires (à implémenter avec l'API)
          try {
            // Ici, vous pourriez appeler une API pour obtenir des articles similaires
            // Pour l'instant, nous laissons un tableau vide
          } catch (error) {
            console.error("Erreur lors de la récupération des articles similaires:", error)
          }
        } catch (apiErr) {
          console.error("Erreur API lors de la récupération de l'article:", apiErr)
          setError("Impossible de charger l'article. Veuillez réessayer plus tard.")
        }
      } catch (err: any) {
        console.error("Erreur générale lors du chargement de l'article:", err)
        setError(err.message || "Impossible de charger l'article de blog")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.slug, isLoggedIn]) // Dépendances minimales

  // Gérer la connexion/déconnexion (pour la démo)
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  // Gérer l'ajout d'un commentaire
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setError("Veuillez entrer un commentaire.")
      return
    }

    if (!isLoggedIn) {
      setError("Vous devez être connecté pour commenter.")
      return
    }

    if (!blogPost || !blogPost.id) {
      setError("Impossible d'ajouter un commentaire à cet article.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await API.blog.addComment(blogPost.id, newComment)
      setComments([result.comment, ...comments])
      setNewComment("")
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du commentaire:", err)
      setError(err.message || "Une erreur est survenue lors de l'ajout du commentaire.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gérer le like/unlike d'un article
  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      setError("Vous devez être connecté pour aimer un article.")
      return
    }

    if (!blogPost || !blogPost.id) {
      setError("Impossible d'aimer cet article.")
      return
    }

    try {
      if (liked) {
        await API.blog.unlikePost(blogPost.id)
        setBlogPost({
          ...blogPost,
          likes: Math.max(0, blogPost.likes - 1),
        })
      } else {
        await API.blog.likePost(blogPost.id)
        setBlogPost({
          ...blogPost,
          likes: blogPost.likes + 1,
        })
      }
      setLiked(!liked)
    } catch (err: any) {
      console.error("Erreur lors de la gestion du like:", err)
      setError(err.message || "Une erreur est survenue lors de la gestion du like.")
    }
  }

  // Gérer le like/unlike d'un commentaire
  const handleToggleCommentLike = async (commentId: number) => {
    if (!isLoggedIn) {
      setError("Vous devez être connecté pour aimer un commentaire.")
      return
    }

    if (!commentId) {
      setError("ID de commentaire invalide.")
      return
    }

    try {
      const isLiked = commentLikes[commentId] || false

      if (isLiked) {
        await API.blog.unlikeComment(commentId)
        setComments(
          comments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: Math.max(0, comment.likes - 1) } : comment,
          ),
        )
      } else {
        await API.blog.likeComment(commentId)
        setComments(
          comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
        )
      }

      setCommentLikes({
        ...commentLikes,
        [commentId]: !isLiked,
      })
    } catch (err: any) {
      console.error("Erreur lors de la gestion du like du commentaire:", err)
      setError(err.message || "Une erreur est survenue lors de la gestion du like du commentaire.")
    }
  }

  // Partager l'article
  const handleShareArticle = () => {
    if (typeof navigator.share !== "undefined") {
      navigator
        .share({
          title: blogPost?.title || "Article de blog",
          text: blogPost?.excerpt || "Découvrez cet article intéressant",
          url: window.location.href,
        })
        .then(() => console.log("Article partagé avec succès"))
        .catch((error) => console.error("Erreur lors du partage:", error))
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
          setError("Lien copié dans le presse-papier !")
        })
        .catch(() => {
          setError("Impossible de copier le lien. Veuillez le copier manuellement.")
        })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-soft-green mx-auto mb-4" />
            <p className="text-light-brown">Chargement de l'article...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error && !blogPost) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto text-center py-20">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="mt-4 bg-soft-green hover:bg-soft-green/90 text-white"
              onClick={() => router.push("/blog")}
            >
              Retour au blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto text-center py-20">
            <p className="text-light-brown">Article non trouvé</p>
            <Button
              className="mt-4 bg-soft-green hover:bg-soft-green/90 text-white"
              onClick={() => router.push("/blog")}
            >
              Retour au blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                <span className="text-light-brown font-medium">{blogPost.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-[400px] w-full">
                  <Image
                    src={blogPost.image || "/placeholder.svg?height=600&width=1200"}
                    alt={blogPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Article Header */}
                <div className="p-6 border-b border-soft-green/10">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                      {blogPost.category}
                    </span>
                    {blogPost.tags &&
                      blogPost.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="bg-beige/50 px-2 py-1 rounded-full text-xs text-light-brown hover:bg-beige transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                  </div>

                  <h1 className="font-script text-3xl md:text-4xl text-light-brown mb-4">{blogPost.title}</h1>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/placeholder.svg?height=100&width=100" alt={blogPost.author} />
                        <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-light-brown">{blogPost.author}</p>
                        <div className="flex items-center text-sm text-light-brown/70">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {typeof blogPost.date === "string" && blogPost.date.includes("T")
                              ? new Date(blogPost.date).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : blogPost.date}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{blogPost.readTime || "5 min"} de lecture</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center text-sm ${liked ? "text-red-500" : "text-light-brown/70"} hover:text-red-500 transition-colors`}
                        onClick={handleToggleLike}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500" : ""}`} />
                        <span>{blogPost.likes}</span>
                      </button>
                      <button
                        className="flex items-center text-sm text-light-brown/70 hover:text-light-brown transition-colors"
                        onClick={handleShareArticle}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        <span>Partager</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div
                    className="prose prose-light-brown max-w-none"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  />
                </div>

                {/* Article Footer */}
                <div className="p-6 border-t border-soft-green/10 bg-beige/10">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-light-brown font-medium mr-2">Tags:</span>
                    {blogPost.tags &&
                      blogPost.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="inline-flex items-center bg-beige/50 hover:bg-beige px-3 py-1 rounded-full text-sm text-light-brown transition-colors"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Link>
                      ))}
                  </div>
                </div>
              </article>

              {/* Comments Section */}
              <div className="mt-8">
                <h2 className="font-script text-2xl text-light-brown mb-6">Commentaires ({comments.length})</h2>

                {/* Comment Form */}
                <Card className="border-none shadow-md mb-8">
                  <CardContent className="p-6">
                    {isLoggedIn ? (
                      <>
                        {error && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        {success && (
                          <Alert className="mb-4 bg-soft-green/10 border-soft-green/30">
                            <CheckCircle2 className="h-4 w-4 text-soft-green" />
                            <AlertDescription className="text-soft-green">
                              Votre commentaire a été publié avec succès.
                            </AlertDescription>
                          </Alert>
                        )}

                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Votre avatar" />
                              <AvatarFallback>Vous</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Partagez votre avis..."
                                className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              className="bg-soft-green hover:bg-soft-green/90 text-white"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Publication...
                                </>
                              ) : (
                                "Publier"
                              )}
                            </Button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-light-brown/80 mb-4">Connectez-vous pour laisser un commentaire</p>
                        <div className="flex justify-center gap-4">
                          <Button
                            variant="outline"
                            className="border-soft-green text-soft-green hover:bg-soft-green/10"
                            onClick={() => router.push("/login")}
                          >
                            Se connecter
                          </Button>
                          <Button
                            className="bg-soft-green hover:bg-soft-green/90 text-white"
                            onClick={toggleLoginState}
                          >
                            Simuler connexion (démo)
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="border-none shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={comment.avatar || "/placeholder.svg?height=50&width=50"}
                                alt={comment.username || comment.author}
                              />
                              <AvatarFallback>
                                {comment.username || comment.author
                                  ? (comment.username || comment.author).charAt(0)
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-light-brown">{comment.username || comment.author}</h3>
                                <span className="text-sm text-light-brown/70">
                                  {new Date(comment.created_at || comment.date).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-light-brown/80 mb-3">{comment.content}</p>
                              <button
                                className={`flex items-center text-sm ${commentLikes[comment.id] ? "text-red-500" : "text-light-brown/70"} hover:text-red-500 transition-colors`}
                                onClick={() => handleToggleCommentLike(comment.id)}
                              >
                                <Heart className={`h-4 w-4 mr-1 ${commentLikes[comment.id] ? "fill-red-500" : ""}`} />
                                <span>{comment.likes}</span>
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <MessageSquare className="h-12 w-12 text-light-brown/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-light-brown mb-2">Aucun commentaire pour le moment</h3>
                    <p className="text-light-brown/70">Soyez le premier à partager votre avis !</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Author Card */}
              <Card className="border-none shadow-md mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src="/placeholder.svg?height=100&width=100" alt={blogPost.author} />
                      <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-script text-xl text-light-brown mb-2">{blogPost.author}</h3>
                    <p className="text-light-brown/80 mb-4">
                      Experte en horticulture et passionnée de plantes d'intérieur. Partage ses connaissances et astuces
                      pour aider chacun à créer son propre coin de verdure.
                    </p>
                    <Button
                      variant="outline"
                      className="border-soft-green text-soft-green hover:bg-soft-green/10"
                      onClick={() => router.push(`/blog/author/${blogPost.author.toLowerCase().replace(/\s+/g, "-")}`)}
                    >
                      Voir tous ses articles
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card className="border-none shadow-md mb-8">
                  <CardContent className="p-6">
                    <h3 className="font-script text-xl text-light-brown mb-4">Articles similaires</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((post) => (
                        <Link key={post.id} href={post.slug} className="flex gap-3 group">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-light-brown group-hover:text-soft-green transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-sm text-light-brown/70">{post.date}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-script text-xl text-light-brown mb-4">Tags de l'article</h3>
                    <div className="flex flex-wrap gap-2">
                      {blogPost.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="inline-flex items-center bg-beige/50 hover:bg-beige px-3 py-1 rounded-full text-sm text-light-brown transition-colors"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

