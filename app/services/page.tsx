"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Gift, Building, Flower, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import API, { type Service } from "@/services/apis"

// Mapping des icônes par catégorie
const categoryIcons: Record<string, React.ElementType> = {
  Mariage: Calendar,
  Entreprise: Building,
  "Espaces commerciaux": Gift,
  Jardins: Flower,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [featuredService, setFeaturedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  
  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        setLoading(true)

        // Récupérer les catégories de services
        try {
          const categoriesData = await API.services.getServiceCategories()
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData)
          } else {
            console.log("Aucune catégorie trouvée")
            setCategories([])
          }
        } catch (categoryError) {
          console.error("Erreur lors de la récupération des catégories:", categoryError)
          setCategories([])
        }

        // Récupérer tous les services
        const data = await API.services.getAllServices()

        // Vérifier et convertir `images` en tableau si c'est une chaîne JSON
        const parsedData = data.map((service: Service) => ({
          ...service,
          images: typeof service.images === "string" ? JSON.parse(service.images) : service.images,
        }))

        setServices(parsedData)

        // Trouver un service mis en avant aléatoire
        const featuredServices = parsedData.filter((service) => service.mis_en_avant)
        if (featuredServices.length > 0) {
          const randomIndex = Math.floor(Math.random() * featuredServices.length)
          setFeaturedService(featuredServices[randomIndex])
        }

        setError(null)
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors du chargement des services")
        console.error("Erreur lors du chargement des services:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServicesAndCategories()
  }, [])

  // Filtrer les services en fonction de l'onglet actif
  const filteredServices =
    activeTab === "all" ? services : services.filter((service) => service.categorie === activeTab)

  // Obtenir l'icône pour une catégorie donnée
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Gift
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-16 px-4 md:px-8 lg:px-16">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-soft-green" />
                <p className="text-light-brown">Chargement des services...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-16 px-4 md:px-8 lg:px-16">
          <div className="container mx-auto">
            <Alert variant="destructive" className="max-w-xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-6">
              <Button
                className="bg-soft-green hover:bg-soft-green/90 text-white"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=1920"
            alt="Services floraux ChezFlora"
            width={1920}
            height={400}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
            <h1 className="font-script mb-4 text-center text-4xl md:text-5xl">Nos services de décoration florale</h1>
            <p className="max-w-2xl text-center text-lg">
              Des créations florales uniques pour sublimer tous vos événements
            </p>
          </div>
        </section>

        {/* Services Introduction */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-script text-3xl md:text-4xl text-light-brown mb-6">
                L'expertise florale à votre service
              </h2>
              <p className="text-light-brown/80 mb-8">
                Chez ChezFlora, nous mettons notre passion et notre savoir-faire au service de vos événements. Que ce
                soit pour un mariage, un événement d'entreprise ou simplement pour embellir votre quotidien, nos
                fleuristes experts créent des compositions florales uniques qui reflètent votre personnalité et vos
                envies.
              </p>
            </div>

            <Tabs defaultValue="all" className="mt-12">
              <div className="flex justify-center">
                <TabsList className="bg-beige/30 border-b border-soft-green/10 overflow-x-auto max-w-full flex-wrap">
                  <TabsTrigger value="all" className="text-light-brown" onClick={() => setActiveTab("all")}>
                    Tous les services
                  </TabsTrigger>

                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="text-light-brown"
                      onClick={() => setActiveTab(category)}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id_service} service={service} getCategoryIcon={getCategoryIcon} />
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-light-brown/70">Aucun service disponible dans cette catégorie.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Featured Service */}
        {featuredService && (
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  {featuredService.images && featuredService.images.length > 0 && (
                    <Image
                      src={
                        Array.isArray(featuredService.images)
                          ? featuredService.images[0]
                          : "/placeholder.svg?height=400&width=600"
                      }
                      alt={featuredService.nom}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="inline-block bg-powder-pink px-3 py-1 rounded-full text-sm text-light-brown mb-4">
                    Service à la une
                  </span>
                  <h2 className="font-script text-3xl md:text-4xl text-light-brown mb-4">{featuredService.nom}</h2>
                  <p className="text-light-brown/80 mb-6">{featuredService.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-soft-green hover:bg-soft-green/90 text-white">
                      <Link href={`/services/${featuredService.id_service}`}>Découvrir ce service</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-soft-green text-soft-green hover:bg-soft-green/10"
                      onClick={() => {
                        if (featuredService.tarification === "Sur devis") {
                          router.push(`/services/reservation?serviceId=${featuredService.id_service}`)
                        } else {
                          router.push(`/services/${featuredService.id_service}`)
                        }
                      }}
                    >
                      {featuredService.tarification === "Sur devis" ? "Demander un devis" : "Réserver maintenant"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-soft-green/10">
          <div className="container mx-auto text-center">
            <h2 className="font-script text-3xl md:text-4xl text-light-brown mb-6">
              Prêt à sublimer votre événement ?
            </h2>
            <p className="text-light-brown/80 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé. Nos
              fleuristes experts sont à votre disposition pour créer des compositions florales uniques.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white">
                <Link href="/services/reservation">Réserver un service</Link>
              </Button>
              <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ServiceCard({
  service,
  getCategoryIcon,
}: { service: Service; getCategoryIcon: (category: string) => React.ElementType }) {
  // Déterminer l'icône en fonction de la catégorie
  const IconComponent = getCategoryIcon(service.categorie)

  // Utiliser la première image comme image principale
  const mainImage = Array.isArray(service.images) && service.images.length > 0 ? service.images[0] : "/placeholder.svg"

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={service.nom}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.mis_en_avant && (
          <div className="absolute top-2 right-2 bg-soft-green px-2 py-1 rounded-full text-xs text-white">
            Populaire
          </div>
        )}
        <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
          {service.categorie}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="bg-soft-green/10 p-2 rounded-full mr-3">
            <IconComponent className="h-5 w-5 text-soft-green" />
          </div>
          <h3 className="font-script text-xl text-light-brown">{service.nom}</h3>
        </div>
        <p className="text-light-brown/80 mb-4 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-soft-green font-medium">
            {typeof service.tarification === "number" ? `${service.tarification} €` : service.tarification}
          </span>
          <Button className="bg-beige hover:bg-beige/90 text-light-brown">
            <Link href={`/services/${service.id_service}`}>Voir détails</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

