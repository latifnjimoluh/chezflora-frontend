"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, Tag, Mail, ArrowRight, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import API from "@/services/apis"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

// Types pour les articles de blog
interface BlogPost {
  id: number
  title: string
  image: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  slug: string
}

// Types pour les catégories
interface Category {
  name: string
  count: number
}

export default function BlogPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)

  // Charger les articles de blog depuis l'API - une seule fois au chargement
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true)
        console.log("Chargement des articles de blog...")

        // Récupérer les articles
        try {
          const posts = await API.blog.getAllPosts()
          if (posts && posts.length > 0) {
            console.log("Articles récupérés:", posts.length)
            setBlogPosts(posts)
          } else {
            console.log("Aucun article trouvé")
            setBlogPosts([])
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des articles:", error)
          setBlogPosts([])
        }

        // Récupérer les catégories
        try {
          const categoriesData = await API.blog.getCategories()
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData)
          } else {
            console.log("Aucune catégorie trouvée")
            setCategories([])
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des catégories:", error)
          setCategories([])
        }

        // Récupérer les tags populaires
        try {
          const tagsData = await API.blog.getPopularTags()
          if (tagsData && tagsData.length > 0) {
            setPopularTags(tagsData)
          } else {
            console.log("Aucun tag trouvé")
            setPopularTags([])
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des tags:", error)
          setPopularTags([])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données du blog:", error)
        // Initialiser avec des tableaux vides en cas d'erreur
        setBlogPosts([])
        setCategories([])
        setPopularTags([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogData()
  }, []) // Dépendance vide = exécution unique au montage

  // Filtrer les articles en fonction du terme de recherche
  const filteredPosts = searchTerm
    ? blogPosts.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : blogPosts

  // Gérer l'inscription à la newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setIsSubmitting(true)
    setSubscriptionError(null)

    try {
      const response = await API.blog.subscribeToNewsletter(email)
      if (response.success) {
        setSubscriptionSuccess(true)
        setEmail("")

        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setSubscriptionSuccess(false)
        }, 5000)
      } else {
        setSubscriptionError(response.message || "Une erreur est survenue lors de l'inscription.")
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription à la newsletter:", error)
      setSubscriptionError(error.message || "Une erreur est survenue lors de l'inscription.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Naviguer vers la page de détail d'un article
  const navigateToPost = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=500&width=1920"
            alt="Blog ChezFlora"
            width={1920}
            height={500}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
            <h1 className="font-script mb-6 text-center text-4xl md:text-6xl">Blog & Inspirations</h1>
            <p className="max-w-2xl text-center text-lg md:text-xl px-4">
              Découvrez nos conseils, astuces et inspirations pour sublimer votre quotidien avec des fleurs
            </p>

            {/* Newsletter Subscription in Hero */}
            <div className="mt-8 w-full max-w-md px-4">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Votre email pour la newsletter"
                    className="pl-10 bg-white/90 border-soft-green/20 focus:border-soft-green h-12 text-gray-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-soft-green hover:bg-soft-green/90 text-white h-12 px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      S'inscrire <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {subscriptionSuccess && (
                <Alert className="mt-2 bg-soft-green/10 border border-soft-green/30">
                  <CheckCircle2 className="h-4 w-4 text-soft-green" />
                  <AlertDescription className="text-soft-green">
                    Merci pour votre inscription ! Vous recevrez bientôt nos actualités.
                  </AlertDescription>
                </Alert>
              )}

              {subscriptionError && (
                <Alert className="mt-2 bg-red-50 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{subscriptionError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            {/* About Section - Repositioned at the top */}
            <Card className="border-none shadow-md mb-12 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="font-script text-3xl text-light-brown mb-6 text-center">À propos du blog</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Blog ChezFlora"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-light-brown/80 mb-4 text-lg">
                      Bienvenue sur le blog de ChezFlora, votre source d'inspiration et de conseils pour tout ce qui
                      concerne les fleurs, les plantes et l'art floral.
                    </p>
                    <p className="text-light-brown/80 text-lg">
                      Nos experts partagent régulièrement leurs connaissances pour vous aider à prendre soin de vos
                      plantes et à créer de magnifiques compositions florales. Explorez nos articles et découvrez
                      comment apporter une touche de nature à votre intérieur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-brown/60" />
                    <Input
                      placeholder="Rechercher un article..."
                      className="pl-10 bg-white border-soft-green/20 focus:border-soft-green h-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-soft-green"></div>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredPosts.map((post: BlogPost) => (
                      <Card
                        key={post.id}
                        className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full cursor-pointer group"
                        onClick={() => navigateToPost(post.slug)}
                      >
                        <div className="block h-full">
                          <div className="relative h-52 w-full overflow-hidden">
                            <Image
                              src={post.image || "/placeholder.svg?height=400&width=600"}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 left-2 bg-powder-pink px-3 py-1 rounded-full text-xs text-light-brown">
                              {post.category}
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center text-sm text-light-brown/70 mb-3">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span className="mr-3">{post.date}</span>
                              <User className="h-3 w-3 mr-1" />
                              <span>{post.author}</span>
                            </div>
                            <h2 className="font-script text-2xl text-light-brown mb-3 group-hover:text-soft-green transition-colors">
                              {post.title}
                            </h2>
                            <p className="text-light-brown/80 mb-4 line-clamp-3">{post.excerpt}</p>
                            <div className="flex justify-between items-center">
                              <div className="text-soft-green font-medium group-hover:underline">Lire la suite →</div>
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center bg-beige/50 px-2 py-0.5 rounded-full text-xs text-light-brown"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`)
                                      }}
                                    >
                                      <Tag className="h-2.5 w-2.5 mr-1" />
                                      {tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <span className="text-xs text-light-brown/70">+{post.tags.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-light-brown text-lg mb-2">Aucun article ne correspond à votre recherche</p>
                    <p className="text-light-brown/70">Essayez avec d'autres termes ou consultez nos catégories</p>
                  </div>
                )}

                {filteredPosts.length > 0 && filteredPosts.length === blogPosts.length && (
                  <div className="mt-12 flex justify-center">
                    <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
                      Voir plus d'articles
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Categories */}
                {categories.length > 0 && (
                  <Card className="border-none shadow-md mb-8 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h2 className="font-script text-2xl text-light-brown mb-4">Catégories</h2>
                      <ul className="space-y-3">
                        {categories.map((category) => (
                          <li key={category.name}>
                            <Link
                              href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className="flex justify-between items-center text-light-brown hover:text-soft-green transition-colors py-1 border-b border-beige/30 last:border-0"
                            >
                              <span>{category.name}</span>
                              <span className="bg-beige/50 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <Card className="border-none shadow-md mb-8 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <h2 className="font-script text-2xl text-light-brown mb-4">Tags populaires</h2>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                            className="inline-flex items-center bg-beige/50 hover:bg-beige px-3 py-1.5 rounded-full text-sm text-light-brown transition-colors"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter */}
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-soft-green/5 to-beige/30">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-4">Newsletter</h2>
                    <p className="text-light-brown/80 mb-4">
                      Inscrivez-vous pour recevoir nos derniers articles et conseils directement dans votre boîte mail.
                    </p>
                    {subscriptionSuccess ? (
                      <div className="bg-soft-green/10 border border-soft-green/30 text-soft-green p-4 rounded-md">
                        <CheckCircle2 className="h-5 w-5 mb-2 mx-auto" />
                        <p className="text-center">
                          Merci pour votre inscription ! Vous recevrez bientôt nos actualités.
                        </p>
                      </div>
                    ) : (
                      <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                          <Input
                            type="email"
                            placeholder="Votre email"
                            className="pl-10 bg-white border-soft-green/20 focus:border-soft-green"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Inscription...
                            </>
                          ) : (
                            "S'inscrire"
                          )}
                        </Button>

                        {subscriptionError && (
                          <Alert className="bg-red-50 border border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-500">{subscriptionError}</AlertDescription>
                          </Alert>
                        )}
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

