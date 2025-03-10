"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Minus, Plus, Share2, ShoppingBag, Star, Truck } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample product data
const product = {
  id: 1,
  name: "Bouquet Printanier",
  price: "45,00 €",
  originalPrice: "50,00 €",
  description:
    "Un magnifique bouquet composé de fleurs de saison aux couleurs vives et fraîches. Parfait pour apporter une touche de printemps à votre intérieur ou pour offrir à un être cher.",
  longDescription:
    "Ce bouquet printanier est composé avec soin par nos fleuristes experts, utilisant uniquement des fleurs fraîches et de saison. Les couleurs vives et joyeuses évoquent la renaissance et la fraîcheur du printemps. Chaque bouquet est unique et peut varier légèrement selon les fleurs disponibles, tout en conservant l'harmonie des couleurs et le style signature de ChezFlora. Livré dans un emballage élégant et éco-responsable, ce bouquet est parfait pour toutes les occasions ou simplement pour vous faire plaisir.",
  category: "Bouquets",
  inStock: true,
  stockQuantity: 15,
  rating: 4.8,
  reviewCount: 24,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  composition: ["Roses", "Tulipes", "Pivoines", "Verdure décorative"],
  careInstructions:
    "Changez l'eau tous les 2 jours. Coupez les tiges en biseau. Gardez à l'abri du soleil direct et des courants d'air.",
  deliveryInfo:
    "Livraison disponible à Paris et sa banlieue. Livraison le jour même pour toute commande passée avant 14h.",
}

// Sample related products
const relatedProducts = [
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
    id: 5,
    name: "Bouquet de Saison",
    image: "/placeholder.svg?height=300&width=300",
    price: "40,00 €",
    category: "Bouquets",
    inStock: true,
    slug: "/boutique/bouquet-saison",
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
]

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  
  const router = useRouter();
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const addToCart = () => {
    // Simulate adding to cart
    alert(`${quantity} ${product.name} ajouté(s) au panier`)
    router.push("/panier")
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
                <Link href="/boutique" className="text-light-brown/70 hover:text-light-brown">
                  Boutique
                </Link>
              </li>
              <li className="text-light-brown/70">/</li>
              <li>
                <Link href={`/boutique/${params.slug}`} className="text-light-brown font-medium">
                  {product.name}
                </Link>
              </li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden border border-soft-green/10">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-soft-green" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - vue ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                    {product.category}
                  </span>
                  {product.inStock ? (
                    <span className="ml-2 text-soft-green text-sm">En stock</span>
                  ) : (
                    <span className="ml-2 text-red-500 text-sm">Rupture de stock</span>
                  )}
                </div>
                <h1 className="font-script text-3xl md:text-4xl text-light-brown">{product.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-light-brown/70">
                      {product.rating} ({product.reviewCount} avis)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-light-brown">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-light-brown/60 line-through">{product.originalPrice}</span>
                )}
              </div>

              <p className="text-light-brown/80">{product.description}</p>

              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-soft-green/20 rounded-md">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-2 text-light-brown hover:bg-soft-green/10 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-light-brown">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-2 text-light-brown hover:bg-soft-green/10 transition-colors"
                        disabled={quantity >= product.stockQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-light-brown/70">{product.stockQuantity} disponibles</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-soft-green hover:bg-soft-green/90 text-white" onClick={addToCart}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter au panier
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-light-brown text-light-brown hover:bg-light-brown/10"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Ajouter aux favoris
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-soft-green/10">
                <div className="flex items-start space-x-2 text-light-brown/70">
                  <Truck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">Livraison gratuite à partir de 50€ d'achat</p>
                    <p className="text-sm">Livraison le jour même pour toute commande avant 14h</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button variant="ghost" className="text-light-brown hover:bg-soft-green/10 hover:text-light-brown">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full bg-beige/30 border-b border-soft-green/10">
                <TabsTrigger value="description" className="text-light-brown">
                  Description
                </TabsTrigger>
                <TabsTrigger value="composition" className="text-light-brown">
                  Composition
                </TabsTrigger>
                <TabsTrigger value="care" className="text-light-brown">
                  Entretien
                </TabsTrigger>
                <TabsTrigger value="delivery" className="text-light-brown">
                  Livraison
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 bg-white rounded-b-lg shadow-sm">
                <p className="text-light-brown/80">{product.longDescription}</p>
              </TabsContent>
              <TabsContent value="composition" className="p-6 bg-white rounded-b-lg shadow-sm">
                <h3 className="font-semibold text-light-brown mb-4">Composition du bouquet</h3>
                <ul className="list-disc pl-5 space-y-2 text-light-brown/80">
                  {product.composition.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-light-brown/70 text-sm italic">
                  La composition peut varier légèrement selon la disponibilité des fleurs, tout en conservant l'harmonie
                  des couleurs et le style.
                </p>
              </TabsContent>
              <TabsContent value="care" className="p-6 bg-white rounded-b-lg shadow-sm">
                <h3 className="font-semibold text-light-brown mb-4">Conseils d'entretien</h3>
                <p className="text-light-brown/80">{product.careInstructions}</p>
              </TabsContent>
              <TabsContent value="delivery" className="p-6 bg-white rounded-b-lg shadow-sm">
                <h3 className="font-semibold text-light-brown mb-4">Informations de livraison</h3>
                <p className="text-light-brown/80">{product.deliveryInfo}</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="font-script text-2xl text-light-brown mb-6">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
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
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-light-brown">{product.name}</h3>
                      <p className="text-soft-green font-medium mt-1">{product.price}</p>
                      <div className="mt-3">
                        <Button className="w-full bg-beige hover:bg-beige/90 text-light-brown">Voir détails</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

