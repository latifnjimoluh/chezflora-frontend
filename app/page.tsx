"use client"


import { usePathname } from 'next/navigation';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCarousel from "@/components/product-carousel"
import TestimonialCard from "@/components/testimonial-card"
import BlogCard from "@/components/blog-card"
import { Flower, Truck, Gift, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="Composition florale élégante"
          width={1920}
          height={600}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
          <h1 className="font-script mb-6 text-center text-4xl md:text-5xl lg:text-6xl">
            Offrez un peu de nature et d'élégance avec ChezFlora
          </h1>
          <Button className="bg-soft-green hover:bg-soft-green/90 text-white">Découvrir nos produits</Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Notre Histoire</h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">
            ChezFlora est née d'une passion pour la beauté naturelle des fleurs et d'un désir de partager cette élégance
            avec le monde. Nous créons des compositions florales uniques qui apportent joie et sérénité dans votre
            quotidien.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">Livraison rapide</h3>
              <p className="text-light-brown/80">Vos fleurs livrées en parfait état, dans les meilleurs délais</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Flower className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">Personnalisation</h3>
              <p className="text-light-brown/80">Des bouquets sur mesure, adaptés à vos goûts et occasions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-powder-pink p-4 rounded-full mb-4">
                <Gift className="h-8 w-8 text-light-brown" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-light-brown">Décoration florale</h3>
              <p className="text-light-brown/80">Des créations uniques pour sublimer vos espaces et événements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Nos Produits</h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">
            Découvrez notre sélection de fleurs fraîches, bouquets élégants et plantes d'intérieur pour tous les goûts
            et toutes les occasions.
          </p>

          <ProductCarousel />

          <div className="flex justify-center mt-12">
            <Button className="bg-beige hover:bg-beige/90 text-light-brown">Voir la boutique</Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Nos Services</h2>
          <p className="text-center max-w-3xl mx-auto text-light-brown mb-12">
            ChezFlora vous accompagne dans tous vos événements avec des services floraux personnalisés et
            professionnels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-soft-green/10 p-4 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-soft-green" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-light-brown">Mariages</h3>
                  <p className="text-light-brown/80 mb-4">
                    Des compositions florales qui sublimeront votre jour spécial
                  </p>
                  <Link href="/services/mariages" className="text-soft-green hover:underline">
                    En savoir plus
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-soft-green/10 p-4 rounded-full mb-4">
                    <Gift className="h-8 w-8 text-soft-green" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-light-brown">Événements</h3>
                  <p className="text-light-brown/80 mb-4">
                    Décorations florales pour vos événements professionnels et privés
                  </p>
                  <Link href="/services/evenements" className="text-soft-green hover:underline">
                    En savoir plus
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-soft-green/10 p-4 rounded-full mb-4">
                    <Flower className="h-8 w-8 text-soft-green" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-light-brown">Abonnements</h3>
                  <p className="text-light-brown/80 mb-4">
                    Recevez régulièrement des fleurs fraîches à votre domicile ou bureau
                  </p>
                  <Link href="/services/abonnements" className="text-soft-green hover:underline">
                    En savoir plus
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-12">
            <Button className="bg-powder-pink hover:bg-powder-pink/90 text-light-brown">Réserver un service</Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">
            Ce que disent nos clients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sophie Martin"
              image="/placeholder.svg?height=100&width=100"
              rating={5}
              text="Les fleurs étaient magnifiques et ont duré bien plus longtemps que prévu. Le service client est impeccable !"
            />
            <TestimonialCard
              name="Thomas Dubois"
              image="/placeholder.svg?height=100&width=100"
              rating={5}
              text="ChezFlora a décoré notre mariage et le résultat était au-delà de nos espérances. Merci pour votre créativité !"
            />
            <TestimonialCard
              name="Marie Leroy"
              image="/placeholder.svg?height=100&width=100"
              rating={4}
              text="Je suis abonnée depuis 6 mois et chaque bouquet est une nouvelle surprise. Fraîcheur et originalité garanties."
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h2 className="font-script text-center text-3xl md:text-4xl text-light-brown mb-8">Blog & Inspirations</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlogCard
              title="Comment prendre soin de vos orchidées"
              image="/placeholder.svg?height=200&width=400"
              excerpt="Découvrez nos conseils d'experts pour garder vos orchidées en pleine santé toute l'année."
              date="12 mai 2023"
              slug="/blog/soin-orchidees"
            />
            <BlogCard
              title="Les tendances florales de la saison"
              image="/placeholder.svg?height=200&width=400"
              excerpt="Quelles sont les fleurs et les compositions qui font sensation cette saison ? Notre guide complet."
              date="28 avril 2023"
              slug="/blog/tendances-florales"
            />
            <BlogCard
              title="Créer un jardin d'intérieur durable"
              image="/placeholder.svg?height=200&width=400"
              excerpt="Nos astuces pour aménager un espace vert chez vous, même avec peu de place et de lumière."
              date="15 avril 2023"
              slug="/blog/jardin-interieur"
            />
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-light-brown text-light-brown hover:bg-light-brown/10">
              Voir tous les articles
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

