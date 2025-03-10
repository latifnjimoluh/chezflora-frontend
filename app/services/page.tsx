import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Gift, Flower, Users, Star } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample services data
const services = [
  {
    id: 1,
    name: "Décoration de Mariage",
    image: "/placeholder.svg?height=400&width=600",
    icon: Calendar,
    description: "Des compositions florales qui sublimeront votre jour spécial",
    longDescription:
      "Nous créons des décorations florales sur mesure pour votre mariage, en harmonie avec votre thème et vos couleurs. De l'autel aux centres de table, en passant par le bouquet de la mariée, nous nous occupons de tous les aspects floraux de votre événement.",
    category: "Événements",
    price: "À partir de 500€",
    slug: "/services/mariage",
    popular: true,
  },
  {
    id: 2,
    name: "Événements d'Entreprise",
    image: "/placeholder.svg?height=400&width=600",
    icon: Gift,
    description: "Décorations florales pour vos événements professionnels",
    longDescription:
      "Apportez une touche d'élégance à vos événements d'entreprise avec nos compositions florales. Idéal pour les lancements de produits, conférences, galas ou séminaires, nos arrangements floraux créent une atmosphère professionnelle et accueillante.",
    category: "Événements",
    price: "À partir de 300€",
    slug: "/services/entreprise",
    popular: false,
  },
  {
    id: 3,
    name: "Abonnements Floraux",
    image: "/placeholder.svg?height=400&width=600",
    icon: Flower,
    description: "Recevez régulièrement des fleurs fraîches à votre domicile ou bureau",
    longDescription:
      "Nos abonnements floraux vous permettent de recevoir des compositions fraîches et saisonnières à la fréquence de votre choix. Une façon simple d'apporter de la vie et des couleurs à votre intérieur ou votre espace de travail tout au long de l'année.",
    category: "Abonnements",
    price: "À partir de 45€/mois",
    slug: "/services/abonnement",
    popular: true,
  },
  {
    id: 4,
    name: "Décoration d'Anniversaire",
    image: "/placeholder.svg?height=400&width=600",
    icon: Gift,
    description: "Créez un événement mémorable avec nos décorations florales festives",
    longDescription:
      "Que vous célébriez un anniversaire, une fête d'enfants ou une réunion de famille, nos décorations florales apporteront joie et couleur à votre événement. Nous adaptons nos créations à votre thème et à vos préférences.",
    category: "Événements",
    price: "À partir de 150€",
    slug: "/services/anniversaire",
    popular: false,
  },
  {
    id: 5,
    name: "Décoration de Réception",
    image: "/placeholder.svg?height=400&width=600",
    icon: Users,
    description: "Sublimez vos réceptions avec des arrangements floraux élégants",
    longDescription:
      "Pour vos dîners, cocktails ou réceptions, nos compositions florales créent une ambiance raffinée et chaleureuse. Nous concevons des arrangements qui s'harmonisent parfaitement avec votre décor et votre thème.",
    category: "Événements",
    price: "À partir de 200€",
    slug: "/services/reception",
    popular: false,
  },
  {
    id: 6,
    name: "Ateliers Floraux",
    image: "/placeholder.svg?height=400&width=600",
    icon: Flower,
    description: "Apprenez l'art floral avec nos ateliers interactifs",
    longDescription:
      "Découvrez les secrets de l'art floral lors de nos ateliers interactifs. Idéal pour les particuliers, les équipes d'entreprise ou les événements spéciaux, nos ateliers vous permettent d'apprendre à créer vos propres compositions florales.",
    category: "Ateliers",
    price: "À partir de 75€/personne",
    slug: "/services/atelier",
    popular: true,
  },
]

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: "Sophie et Thomas",
    image: "/placeholder.svg?height=100&width=100",
    text: "ChezFlora a décoré notre mariage et le résultat était au-delà de nos espérances. Merci pour votre créativité et votre professionnalisme !",
    service: "Décoration de Mariage",
    rating: 5,
  },
  {
    id: 2,
    name: "Entreprise XYZ",
    image: "/placeholder.svg?height=100&width=100",
    text: "Nous faisons appel à ChezFlora pour tous nos événements d'entreprise. Leurs compositions sont toujours élégantes et parfaitement adaptées à notre image de marque.",
    service: "Événements d'Entreprise",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie L.",
    image: "/placeholder.svg?height=100&width=100",
    text: "Je suis abonnée aux livraisons mensuelles depuis 6 mois et chaque bouquet est une nouvelle surprise. Fraîcheur et originalité garanties.",
    service: "Abonnements Floraux",
    rating: 4,
  },
]

export default function ServicesPage() {
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
                <TabsList className="bg-beige/30 border-b border-soft-green/10">
                  <TabsTrigger value="all" className="text-light-brown">
                    Tous les services
                  </TabsTrigger>
                  <TabsTrigger value="events" className="text-light-brown">
                    Événements
                  </TabsTrigger>
                  <TabsTrigger value="subscriptions" className="text-light-brown">
                    Abonnements
                  </TabsTrigger>
                  <TabsTrigger value="workshops" className="text-light-brown">
                    Ateliers
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services
                    .filter((service) => service.category === "Événements")
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services
                    .filter((service) => service.category === "Abonnements")
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="workshops" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services
                    .filter((service) => service.category === "Ateliers")
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Featured Service */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Décoration de mariage"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-block bg-powder-pink px-3 py-1 rounded-full text-sm text-light-brown mb-4">
                  Service à la une
                </span>
                <h2 className="font-script text-3xl md:text-4xl text-light-brown mb-4">Décoration de Mariage</h2>
                <p className="text-light-brown/80 mb-6">
                  Votre mariage est un jour unique qui mérite une décoration florale exceptionnelle. Nos fleuristes
                  experts travaillent en étroite collaboration avec vous pour créer des arrangements floraux qui
                  reflètent votre style et votre personnalité.
                </p>
                <p className="text-light-brown/80 mb-6">
                  Du bouquet de la mariée aux centres de table, en passant par la décoration de la cérémonie et de la
                  réception, nous nous occupons de tous les aspects floraux de votre grand jour pour créer une
                  atmosphère magique et inoubliable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-soft-green hover:bg-soft-green/90 text-white">Découvrir ce service</Button>
                  <Button variant="outline" className="border-soft-green text-soft-green hover:bg-soft-green/10">
                    Demander un devis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            <h2 className="font-script text-3xl md:text-4xl text-center text-light-brown mb-12">
              Ce que disent nos clients
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden mb-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <h3 className="font-semibold text-lg text-light-brown mb-1">{testimonial.name}</h3>
                      <p className="text-soft-green text-sm mb-3">{testimonial.service}</p>

                      <div className="flex mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>

                      <p className="text-light-brown/80 italic">"{testimonial.text}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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

function ServiceCard({ service }: { service: any }) {
  const IconComponent = service.icon

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.popular && (
          <div className="absolute top-2 right-2 bg-soft-green px-2 py-1 rounded-full text-xs text-white">
            Populaire
          </div>
        )}
        <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
          {service.category}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="bg-soft-green/10 p-2 rounded-full mr-3">
            <IconComponent className="h-5 w-5 text-soft-green" />
          </div>
          <h3 className="font-script text-xl text-light-brown">{service.name}</h3>
        </div>
        <p className="text-light-brown/80 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-soft-green font-medium">{service.price}</span>
          <Button className="bg-beige hover:bg-beige/90 text-light-brown">
            <Link href={service.slug}>Voir détails</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

