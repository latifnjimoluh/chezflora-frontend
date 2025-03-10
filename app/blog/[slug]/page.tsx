"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Tag, MessageSquare, Heart, Share2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample blog post data
const blogPost = {
  id: 1,
  title: "Comment prendre soin de vos orchidées",
  image: "/placeholder.svg?height=600&width=1200",
  content: `
    <p>Les orchidées sont parmi les plantes d'intérieur les plus populaires, mais elles ont la réputation d'être difficiles à entretenir. Pourtant, avec quelques connaissances de base et une attention régulière, vous pouvez profiter de ces magnifiques fleurs pendant de nombreuses années.</p>
    
    <h2>Choisir le bon emplacement</h2>
    <p>Les orchidées apprécient la lumière vive mais indirecte. Une fenêtre orientée à l'est ou à l'ouest est idéale. Évitez l'exposition directe au soleil, qui peut brûler les feuilles, mais aussi les endroits trop sombres, qui empêcheront la floraison.</p>
    
    <h2>L'arrosage : la clé du succès</h2>
    <p>L'erreur la plus courante avec les orchidées est l'excès d'arrosage. La plupart des orchidées d'intérieur sont épiphytes, ce qui signifie qu'elles poussent naturellement sur les arbres et non dans le sol. Leurs racines ont besoin d'air et peuvent pourrir si elles restent constamment humides.</p>
    
    <p>Voici quelques conseils pour un arrosage optimal :</p>
    <ul>
      <li>Arrosez uniquement lorsque le substrat est sec au toucher</li>
      <li>Utilisez de l'eau à température ambiante</li>
      <li>Arrosez le matin pour permettre à l'excès d'humidité de s'évaporer pendant la journée</li>
      <li>Trempez le pot dans l'eau pendant 10-15 minutes, puis laissez-le s'égoutter complètement</li>
    </ul>
    
    <h2>La nutrition</h2>
    <p>Les orchidées n'ont pas besoin de beaucoup d'engrais. Utilisez un engrais spécial orchidées dilué à la moitié de la dose recommandée, une fois par mois pendant la période de croissance (printemps et été). Ne fertilisez pas une plante sèche ou en dormance.</p>
    
    <h2>Le rempotage</h2>
    <p>Les orchidées doivent être rempotées tous les 1 à 2 ans, ou lorsque le substrat commence à se décomposer. Utilisez un substrat spécial pour orchidées, composé principalement d'écorce de pin. Le meilleur moment pour rempoter est juste après la floraison, lorsque de nouvelles racines commencent à apparaître.</p>
    
    <h2>Encourager la floraison</h2>
    <p>Si votre orchidée est en bonne santé mais ne fleurit pas, elle pourrait avoir besoin d'un contraste de température entre le jour et la nuit. Une différence de 5 à 10°C peut stimuler la floraison. Certaines espèces, comme les Phalaenopsis, peuvent également être encouragées à fleurir en les exposant à des températures plus fraîches (environ 15°C) pendant quelques semaines.</p>
    
    <h2>Conclusion</h2>
    <p>Avec ces conseils de base, vous devriez être en mesure de maintenir vos orchidées en bonne santé et de profiter de leurs magnifiques fleurs. N'oubliez pas que chaque espèce d'orchidée a ses propres préférences, alors n'hésitez pas à vous renseigner sur les besoins spécifiques de votre plante.</p>
  `,
  date: "12 mai 2023",
  author: "Marie Dupont",
  authorImage: "/placeholder.svg?height=100&width=100",
  category: "Conseils d'entretien",
  tags: ["Orchidées", "Plantes d'intérieur", "Entretien"],
  likes: 42,
  views: 1250,
  readTime: "5 min",
}

// Sample comments data
const initialComments = [
  {
    id: 1,
    author: "Sophie Martin",
    authorImage: "/placeholder.svg?height=50&width=50",
    date: "14 mai 2023",
    content:
      "Merci pour ces conseils ! J'ai toujours eu du mal à faire refleurir mes orchidées, je vais essayer la technique du contraste de température.",
    likes: 5,
  },
  {
    id: 2,
    author: "Thomas Dubois",
    authorImage: "/placeholder.svg?height=50&width=50",
    date: "15 mai 2023",
    content:
      "Super article ! Est-ce que vous pourriez faire un article similaire sur les plantes carnivores ? J'ai beaucoup de mal à les maintenir en bonne santé.",
    likes: 3,
  },
  {
    id: 3,
    author: "Julie Leroy",
    authorImage: "/placeholder.svg?height=50&width=50",
    date: "16 mai 2023",
    content:
      "J'ai suivi vos conseils pour mon orchidée qui dépérissait et elle commence déjà à montrer des signes d'amélioration. Merci !",
    likes: 8,
  },
]

// Sample related posts
const relatedPosts = [
  {
    id: 2,
    title: "Les tendances florales de la saison",
    image: "/placeholder.svg?height=200&width=300",
    excerpt: "Quelles sont les fleurs et les compositions qui font sensation cette saison ? Notre guide complet.",
    date: "28 avril 2023",
    slug: "/blog/tendances-florales",
  },
  {
    id: 3,
    title: "Créer un jardin d'intérieur durable",
    image: "/placeholder.svg?height=200&width=300",
    excerpt: "Nos astuces pour aménager un espace vert chez vous, même avec peu de place et de lumière.",
    date: "15 avril 2023",
    slug: "/blog/jardin-interieur",
  },
  {
    id: 5,
    title: "Le langage des fleurs : ce que chaque fleur symbolise",
    image: "/placeholder.svg?height=200&width=300",
    excerpt: "Apprenez à communiquer vos sentiments à travers le choix des fleurs que vous offrez.",
    date: "20 mars 2023",
    slug: "/blog/langage-fleurs",
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Simulate login state
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [liked, setLiked] = useState(false)

  // Toggle login state for demo purposes
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setError("Veuillez entrer un commentaire.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new comment
      const newCommentObj = {
        id: comments.length + 1,
        author: "Vous",
        authorImage: "/placeholder.svg?height=50&width=50",
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        content: newComment,
        likes: 0,
      }

      setComments([newCommentObj, ...comments])
      setNewComment("")
      setSuccess(true)

      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
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
                    src={blogPost.image || "/placeholder.svg"}
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
                    {blogPost.tags.map((tag) => (
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
                        <AvatarImage src={blogPost.authorImage} alt={blogPost.author} />
                        <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-light-brown">{blogPost.author}</p>
                        <div className="flex items-center text-sm text-light-brown/70">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{blogPost.date}</span>
                          <span className="mx-2">•</span>
                          <span>{blogPost.readTime} de lecture</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center text-sm ${liked ? "text-red-500" : "text-light-brown/70"} hover:text-red-500 transition-colors`}
                        onClick={() => setLiked(!liked)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500" : ""}`} />
                        <span>{liked ? blogPost.likes + 1 : blogPost.likes}</span>
                      </button>
                      <button className="flex items-center text-sm text-light-brown/70 hover:text-light-brown transition-colors">
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
                    {blogPost.tags.map((tag) => (
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
                              disabled={isLoading}
                            >
                              {isLoading ? "Publication..." : "Publier"}
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
                              <AvatarImage src={comment.authorImage} alt={comment.author} />
                              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-light-brown">{comment.author}</h3>
                                <span className="text-sm text-light-brown/70">{comment.date}</span>
                              </div>
                              <p className="text-light-brown/80 mb-3">{comment.content}</p>
                              <button className="flex items-center text-sm text-light-brown/70 hover:text-red-500 transition-colors">
                                <Heart className="h-4 w-4 mr-1" />
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
                      <AvatarImage src={blogPost.authorImage} alt={blogPost.author} />
                      <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-script text-xl text-light-brown mb-2">{blogPost.author}</h3>
                    <p className="text-light-brown/80 mb-4">
                      Experte en horticulture et passionnée de plantes d'intérieur. Partage ses connaissances et astuces
                      pour aider chacun à créer son propre coin de verdure.
                    </p>
                    <Button variant="outline" className="border-soft-green text-soft-green hover:bg-soft-green/10">
                      Voir tous ses articles
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
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

              {/* Tags */}
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-script text-xl text-light-brown mb-4">Tags populaires</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Orchidées",
                      "Plantes d'intérieur",
                      "Entretien",
                      "Bouquet",
                      "Mariage",
                      "Printemps",
                      "Compositions",
                      "Décoration",
                    ].map((tag) => (
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

