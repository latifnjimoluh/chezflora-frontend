import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, Tag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Comment prendre soin de vos orchidées",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Découvrez nos conseils d'experts pour garder vos orchidées en pleine santé toute l'année.",
    date: "12 mai 2023",
    author: "Marie Dupont",
    category: "Conseils d'entretien",
    tags: ["Orchidées", "Plantes d'intérieur", "Entretien"],
    slug: "/blog/soin-orchidees",
  },
  {
    id: 2,
    title: "Les tendances florales de la saison",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Quelles sont les fleurs et les compositions qui font sensation cette saison ? Notre guide complet.",
    date: "28 avril 2023",
    author: "Thomas Martin",
    category: "Tendances",
    tags: ["Tendances", "Saison", "Compositions"],
    slug: "/blog/tendances-florales",
  },
  {
    id: 3,
    title: "Créer un jardin d'intérieur durable",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Nos astuces pour aménager un espace vert chez vous, même avec peu de place et de lumière.",
    date: "15 avril 2023",
    author: "Sophie Leclerc",
    category: "DIY",
    tags: ["Jardin d'intérieur", "Plantes", "Décoration"],
    slug: "/blog/jardin-interieur",
  },
  {
    id: 4,
    title: "Les fleurs de mariage incontournables",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Découvrez les fleurs les plus populaires pour sublimer votre cérémonie de mariage.",
    date: "5 avril 2023",
    author: "Marie Dupont",
    category: "Mariages",
    tags: ["Mariage", "Bouquet", "Cérémonie"],
    slug: "/blog/fleurs-mariage",
  },
  {
    id: 5,
    title: "Le langage des fleurs : ce que chaque fleur symbolise",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Apprenez à communiquer vos sentiments à travers le choix des fleurs que vous offrez.",
    date: "20 mars 2023",
    author: "Jean Dubois",
    category: "Culture florale",
    tags: ["Symbolisme", "Tradition", "Cadeaux"],
    slug: "/blog/langage-fleurs",
  },
  {
    id: 6,
    title: "Compositions florales pour le printemps",
    image: "/placeholder.svg?height=400&width=600",
    excerpt: "Inspirez-vous de nos idées de compositions florales pour célébrer l'arrivée du printemps.",
    date: "10 mars 2023",
    author: "Sophie Leclerc",
    category: "Inspirations",
    tags: ["Printemps", "Compositions", "Couleurs"],
    slug: "/blog/compositions-printemps",
  },
]

// Sample categories
const categories = [
  { name: "Conseils d'entretien", count: 8 },
  { name: "Tendances", count: 5 },
  { name: "DIY", count: 7 },
  { name: "Mariages", count: 6 },
  { name: "Culture florale", count: 4 },
  { name: "Inspirations", count: 9 },
]

// Sample popular tags
const popularTags = [
  "Orchidées",
  "Plantes d'intérieur",
  "Bouquet",
  "Mariage",
  "Printemps",
  "Entretien",
  "Compositions",
  "Décoration",
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=1920"
            alt="Blog ChezFlora"
            width={1920}
            height={400}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
            <h1 className="font-script mb-4 text-center text-4xl md:text-5xl">Blog & Inspirations</h1>
            <p className="max-w-2xl text-center text-lg">
              Découvrez nos conseils, astuces et inspirations pour sublimer votre quotidien avec des fleurs
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      placeholder="Rechercher un article..."
                      className="pl-10 bg-white border-soft-green/20 focus:border-soft-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full"
                    >
                      <Link href={post.slug} className="block h-full">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
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
                            <span className="mr-3">{post.date}</span>
                            <User className="h-3 w-3 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <h2 className="font-script text-xl text-light-brown mb-2">{post.title}</h2>
                          <p className="text-light-brown/80 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="text-soft-green font-medium hover:underline">Lire la suite →</div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
                    Voir plus d'articles
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* About */}
                <Card className="border-none shadow-md mb-8">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-4">À propos du blog</h2>
                    <p className="text-light-brown/80 mb-4">
                      Bienvenue sur le blog de ChezFlora, votre source d'inspiration et de conseils pour tout ce qui
                      concerne les fleurs, les plantes et l'art floral.
                    </p>
                    <p className="text-light-brown/80">
                      Nos experts partagent régulièrement leurs connaissances pour vous aider à prendre soin de vos
                      plantes et à créer de magnifiques compositions florales.
                    </p>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="border-none shadow-md mb-8">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-4">Catégories</h2>
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <Link
                            href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="flex justify-between items-center text-light-brown hover:text-soft-green transition-colors"
                          >
                            <span>{category.name}</span>
                            <span className="bg-beige/50 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="border-none shadow-md mb-8">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-4">Tags populaires</h2>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
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

                {/* Newsletter */}
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-4">Newsletter</h2>
                    <p className="text-light-brown/80 mb-4">
                      Inscrivez-vous pour recevoir nos derniers articles et conseils directement dans votre boîte mail.
                    </p>
                    <form className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Votre email"
                        className="bg-white border-soft-green/20 focus:border-soft-green"
                        required
                      />
                      <Button className="w-full bg-soft-green hover:bg-soft-green/90 text-white">S'inscrire</Button>
                    </form>
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

