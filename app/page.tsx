"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TestimonialCard from "@/components/testimonial-card"
import BlogCard from "@/components/blog-card"
import { Flower, Truck, Gift, Loader2 } from "lucide-react"
import API from "@/services/apis"
import { formatPrice } from "@/utils/format-utils"

// Types pour les données
interface Product {
  id_produit: string | number
  nom: string
  description: string
  prix: number
  images: string | string[]
  categorie: string
  stock: number
  statut: string
}

interface Service {
  id_service: string | number
  nom: string
  description: string
  categorie: string
  tarification: string | number
  images: string | string[]
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  image: string
  date: string
}

interface Testimonial {
  id: number
  name: string
  text: string
  rating: number
  image: string
}

interface SiteContent {
  [key: string]: string
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent>({
    hero_title: "Offrez un peu de nature et d'élégance avec ChezFlora",
    hero_background_url: "/placeholder.svg?height=600&width=1920",
    about_text:
      "ChezFlora est née d'une passion pour la beauté naturelle des fleurs et d'un désir de partager cette élégance avec le monde. Nous créons des compositions florales uniques qui apportent joie et sérénité dans votre quotidien.",
    feature_delivery_title: "Livraison rapide",
    feature_delivery_text: "Vos fleurs livrées en parfait état, dans les meilleurs délais",
    feature_personalization_title: "Personnalisation",
    feature_personalization_text: "Des bouquets sur mesure, adaptés à vos goûts et occasions",
    feature_decoration_title: "Décoration florale",
    feature_decoration_text: "Des créations uniques pour sublimer vos espaces et événements",
    products_section_title: "Nos Produits",
    products_section_text:
      "Découvrez notre sélection de fleurs fraîches, bouquets élégants et plantes d'intérieur pour tous les goûts et toutes les occasions.",
    services_section_title: "Nos Services",
    services_section_text:
      "ChezFlora vous accompagne dans tous vos événements avec des services floraux personnalisés et professionnels.",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Récupérer les contenus du site
        const contents = await API.siteContent.getAllContents()
        if (contents) {
          setSiteContent((prevContent) => ({
            ...prevContent,
            ...contents,
          }))
        }

        // Récupérer les produits mis en avant
        const products = await API.products.getFeaturedProducts()
        setFeaturedProducts(products || [])

        // Récupérer les services
        const servicesData = await API.services.getAllServices()
        setServices(servicesData || [])

        // Récupérer les articles de blog aléatoires
        const blogData = await API.blog.getRandomPosts(3)
        setBlogPosts(blogData || [])

        // Récupérer les témoignages mis en avant
        const testimonialData = await API.testimonials.getFeatured()
        setTestimonials(testimonialData || [])
      } catch (err: any) {
        console.error("Erreur lors du chargement des données de la page d'accueil:", err)
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  // Fonction pour parser les images JSON si nécessaire
  const parseImages = (images: string | string[]): string[] => {
    if (typeof images === "string") {
      try {
        return JSON.parse(images)
      } catch (e) {
        return [images]
      }
    }
    return images
  }

  // Fonction pour obtenir la première image d'un produit ou service
  const getFirstImage = (images: string | string[]): string => {
    const parsedImages = parseImages(images)
    return parsedImages && parsedImages.length > 0 ? parsedImages[0] : "/placeholder.svg?height=400&width=400"
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Exemple d'utilisation
  const exampleDate = "2025-02-04T23:00:00.000Z"
  console.log(formatDate(exampleDate)) // Affichera "4 février 2025"

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image
          src={siteContent.hero_background_url || "/placeholder.svg?height=600&width=1920"}
          alt="Composition florale élégante"
          width={1920}
          height={600}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
          <h1 className="font-script mb-6 text-center text-4xl md:text-5xl lg:text-6xl">{siteContent.hero_title}</h1>
          <Button className="bg-soft-green hover:bg-soft-green/90 text-white">
            <Link href="/boutique">Découvrir nos produits</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Notre Histoire</h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">{siteContent.about_text}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">{siteContent.feature_delivery_title}</h3>
              <p className="text-light-brown/80">{siteContent.feature_delivery_text}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Flower className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">
                {siteContent.feature_personalization_title}
              </h3>
              <p className="text-light-brown/80">{siteContent.feature_personalization_text}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Gift className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">{siteContent.feature_decoration_title}</h3>
              <p className="text-light-brown/80">{siteContent.feature_decoration_text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">
            {siteContent.products_section_title}
          </h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">{siteContent.products_section_text}</p>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <Card
                  key={product.id_produit}
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/boutique/${product.id_produit}`} className="block">
                    <div className="relative h-64 w-full">
                      <Image
                        src={getFirstImage(product.images) || "/placeholder.svg"}
                        alt={product.nom}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                        {product.categorie}
                      </div>
                      {product.stock <= 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full text-xs text-white">
                          Rupture de stock
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-script text-xl text-light-brown mb-2">{product.nom}</h3>
                      <p className="text-light-brown/80 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-soft-green font-semibold">{formatPrice(Number(product.prix))}</span>
                        <span className="text-soft-green hover:underline">Voir détails →</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-light-brown">Aucun produit mis en avant pour le moment.</p>
          )}

          <div className="flex justify-center mt-12">
            <Button className="bg-beige hover:bg-beige/90 text-light-brown">
              <Link href="/boutique">Voir la boutique</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">
            {siteContent.services_section_title}
          </h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">{siteContent.services_section_text}</p>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service) => (
                <Card
                  key={service.id_service}
                  className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                        <Image
                          src={getFirstImage(service.images) || "/placeholder.svg"}
                          alt={service.nom}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-xl mb-2 text-light-brown">{service.nom}</h3>
                      <p className="text-light-brown/80 mb-4 line-clamp-3">{service.description}</p>
                      <Link href={`/services/${service.id_service}`} className="text-soft-green hover:underline">
                        En savoir plus
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-light-brown">Aucun service disponible pour le moment.</p>
          )}

          <div className="flex justify-center mt-12">
            <Button className="bg-powder-pink hover:bg-powder-pink/90 text-light-brown">
              <Link href="/services/reservation">Réserver un service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">
            Ce que disent nos clients
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  image={testimonial.image || "/placeholder.svg?height=100&width=100"}
                  rating={testimonial.rating}
                  text={testimonial.text}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-light-brown">Aucun témoignage disponible pour le moment.</p>
          )}

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
              <Link href="/testimonials">Voir tous les témoignages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Blog & Inspirations</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  image={post.image || "/placeholder.svg?height=200&width=400"}
                  excerpt={post.excerpt}
                  date={post.date}
                  slug={post.slug}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-light-brown">Aucun article de blog disponible pour le moment.</p>
          )}

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
              <Link href="/blog">Voir tous les articles</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

