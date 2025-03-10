import { Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample product data
const products = [
  {
    id: 1,
    name: "Bouquet Printanier",
    image: "/placeholder.svg?height=300&width=300",
    price: "45,00 €",
    category: "Bouquets",
    inStock: true,
    slug: "/boutique/bouquet-printanier",
  },
  {
    id: 2,
    name: "Roses Pastel",
    image: "/placeholder.svg?height=300&width=300",
    price: "35,00 €",
    category: "Fleurs Fraîches",
    inStock: true,
    slug: "/boutique/roses-pastel",
  },
  {
    id: 3,
    name: "Orchidée Élégante",
    image: "/placeholder.svg?height=300&width=300",
    price: "55,00 €",
    category: "Plantes",
    inStock: true,
    slug: "/boutique/orchidee-elegante",
  },
  {
    id: 4,
    name: "Composition Exotique",
    image: "/placeholder.svg?height=300&width=300",
    price: "65,00 €",
    category: "Compositions",
    inStock: false,
    slug: "/boutique/composition-exotique",
  },
  {
    id: 5,
    name: "Bouquet de Saison",
    image: "/placeholder.svg?height=300&width=300",
    price: "40,00 €",
    category: "Bouquets",
    inStock: true,
    slug: "/boutique/bouquet-saison",
  },
  {
    id: 6,
    name: "Plante Verte Décorative",
    image: "/placeholder.svg?height=300&width=300",
    price: "38,00 €",
    category: "Plantes",
    inStock: true,
    slug: "/boutique/plante-verte-decorative",
  },
  {
    id: 7,
    name: "Bouquet de Roses Rouges",
    image: "/placeholder.svg?height=300&width=300",
    price: "50,00 €",
    category: "Bouquets",
    inStock: true,
    slug: "/boutique/bouquet-roses-rouges",
  },
  {
    id: 8,
    name: "Terrarium Succulent",
    image: "/placeholder.svg?height=300&width=300",
    price: "60,00 €",
    category: "Plantes",
    inStock: true,
    slug: "/boutique/terrarium-succulent",
  },
  {
    id: 9,
    name: "Bouquet Champêtre",
    image: "/placeholder.svg?height=300&width=300",
    price: "42,00 €",
    category: "Bouquets",
    inStock: false,
    slug: "/boutique/bouquet-champetre",
  },
]

export default function BoutiquePage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Notre Boutique</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Découvrez notre sélection de fleurs fraîches, bouquets élégants et plantes d'intérieur pour tous les goûts
            et toutes les occasions.
          </p>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10 bg-white border-soft-green/20 focus:border-soft-green"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] bg-white border-soft-green/20">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="popularity">Popularité</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-soft-green/20 text-light-brown">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-semibold text-lg text-light-brown mb-4">Filtres</h2>

                <Accordion type="single" collapsible defaultValue="category">
                  <AccordionItem value="category">
                    <AccordionTrigger className="text-light-brown">Catégories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="bouquets" />
                          <label htmlFor="bouquets" className="text-sm text-light-brown cursor-pointer">
                            Bouquets
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="fleurs-fraiches" />
                          <label htmlFor="fleurs-fraiches" className="text-sm text-light-brown cursor-pointer">
                            Fleurs Fraîches
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="plantes" />
                          <label htmlFor="plantes" className="text-sm text-light-brown cursor-pointer">
                            Plantes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="compositions" />
                          <label htmlFor="compositions" className="text-sm text-light-brown cursor-pointer">
                            Compositions
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger className="text-light-brown">Prix</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-0-30" />
                          <label htmlFor="price-0-30" className="text-sm text-light-brown cursor-pointer">
                            0€ - 30€
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-30-50" />
                          <label htmlFor="price-30-50" className="text-sm text-light-brown cursor-pointer">
                            30€ - 50€
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="price-50-plus" />
                          <label htmlFor="price-50-plus" className="text-sm text-light-brown cursor-pointer">
                            Plus de 50€
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="availability">
                    <AccordionTrigger className="text-light-brown">Disponibilité</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="in-stock" />
                          <label htmlFor="in-stock" className="text-sm text-light-brown cursor-pointer">
                            En stock
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button className="w-full mt-4 bg-soft-green hover:bg-soft-green/90 text-white">
                  Appliquer les filtres
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link href={product.slug} key={product.id}>
                    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group">
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                          {product.category}
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Rupture de stock
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-light-brown">{product.name}</h3>
                        <p className="text-soft-green font-medium mt-1">{product.price}</p>
                        <div className="mt-3">
                          <Button
                            className="w-full bg-beige hover:bg-beige/90 text-light-brown"
                            disabled={!product.inStock}
                          >
                            {product.inStock ? "Voir détails" : "Indisponible"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" className="border-soft-green/20 text-light-brown" disabled>
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    className="border-soft-green bg-soft-green text-white hover:bg-soft-green/90"
                  >
                    1
                  </Button>
                  <Button variant="outline" className="border-soft-green/20 text-light-brown">
                    2
                  </Button>
                  <Button variant="outline" className="border-soft-green/20 text-light-brown">
                    3
                  </Button>
                  <Button variant="outline" className="border-soft-green/20 text-light-brown">
                    Suivant
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

