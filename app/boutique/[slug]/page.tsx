"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Minus, Plus, Share2, ShoppingBag, Truck, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
// Modifier l'import pour ajouter la fonction addToCart
import { getProductById, checkProductStock, getAllProducts, addToCart } from "@/services/api"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stockInfo, setStockInfo] = useState<{ stock: number; message: string } | null>(null)
  const [showAddedToast, setShowAddedToast] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        // Récupérer les détails du produit
        const productData = await getProductById(params.slug)
        setProduct(productData)

        // Récupérer les informations de stock
        const stockData = await checkProductStock(params.slug)
        setStockInfo(stockData)

        // Récupérer les produits similaires
        const allProducts = await getAllProducts()
        // Filtrer pour exclure le produit actuel et limiter à 3 produits
        const filtered = allProducts.filter((p: any) => p.id_produit !== params.slug).slice(0, 3)
        setRelatedProducts(filtered)
      } catch (error) {
        console.error("Erreur lors du chargement des données du produit:", error)
        setError("Impossible de charger les détails du produit. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProductData()
    }
  }, [params.slug])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (stockInfo && quantity < stockInfo.stock) {
      setQuantity(quantity + 1)
    }
  }

  // Remplacer la fonction addToCart actuelle par celle-ci
  const handleAddToCart = async () => {
    try {
      // Ajouter au panier en utilisant la fonction importée
      await addToCart(params.slug, quantity)

      // Afficher la notification
      setShowAddedToast(true)

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowAddedToast(false)
      }, 3000)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      })
    }
  }

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace(".", ",")} €`
  }

  // Fonction pour extraire les images du produit
  const getProductImages = (product: any) => {
    if (!product) return []

    let images = []
    try {
      if (typeof product.images === "string") {
        images = JSON.parse(product.images)
      } else if (Array.isArray(product.images)) {
        images = product.images
      }
    } catch (e) {
      console.error("Erreur lors du parsing des images:", e)
      images = []
    }

    return images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto flex justify-center items-center h-96">
            <p className="text-light-brown">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto flex justify-center items-center h-96">
            <p className="text-red-500">{error || "Produit non trouvé"}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const productImages = getProductImages(product)
  const isInStock = stockInfo && stockInfo.stock > 0

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
                  {product.nom}
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
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.nom}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-soft-green" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.nom} - vue ${index + 1}`}
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
                    {product.categorie}
                  </span>
                  {isInStock ? (
                    <span className="ml-2 text-soft-green text-sm">En stock</span>
                  ) : (
                    <span className="ml-2 text-red-500 text-sm">Rupture de stock</span>
                  )}
                </div>
                <h1 className="font-script text-3xl md:text-4xl text-light-brown">{product.nom}</h1>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-light-brown">
                  {formatPrice(Number.parseFloat(product.prix))}
                </span>
              </div>

              <p className="text-light-brown/80">{product.description}</p>

              {isInStock && (
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
                        disabled={quantity >= stockInfo.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-light-brown/70">{stockInfo.stock} disponibles</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="flex-1 bg-soft-green hover:bg-soft-green/90 text-white"
                      onClick={handleAddToCart}
                    >
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
                <TabsTrigger value="details" className="text-light-brown">
                  Détails
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 bg-white rounded-b-lg shadow-sm">
                <p className="text-light-brown/80">{product.description}</p>
              </TabsContent>
              <TabsContent value="details" className="p-6 bg-white rounded-b-lg shadow-sm">
                <h3 className="font-semibold text-light-brown mb-4">Détails du produit</h3>
                <ul className="list-disc pl-5 space-y-2 text-light-brown/80">
                  <li>Catégorie: {product.categorie}</li>
                  <li>Dimensions: {product.dimensions || "Non spécifié"}</li>
                  <li>Poids: {product.poids ? `${product.poids} kg` : "Non spécifié"}</li>
                  {product.options_personnalisation && (
                    <li>Options de personnalisation: {product.options_personnalisation}</li>
                  )}
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-script text-2xl text-light-brown mb-6">Vous aimerez aussi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedImages = getProductImages(relatedProduct)
                  const relatedIsInStock = relatedProduct.stock > 0 && relatedProduct.statut === "Disponible"

                  return (
                    <Link href={`/boutique/${relatedProduct.id_produit}`} key={relatedProduct.id_produit}>
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group">
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image
                            src={relatedImages[0] || "/placeholder.svg"}
                            alt={relatedProduct.nom}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                            {relatedProduct.categorie}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-light-brown">{relatedProduct.nom}</h3>
                          <p className="text-soft-green font-medium mt-1">
                            {formatPrice(Number.parseFloat(relatedProduct.prix))}
                          </p>
                          <div className="mt-3">
                            <Button
                              className="w-full bg-beige hover:bg-beige/90 text-light-brown"
                              disabled={!relatedIsInStock}
                            >
                              {relatedIsInStock ? "Voir détails" : "Indisponible"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          {showAddedToast && (
            <div className="fixed bottom-4 right-4 bg-soft-green text-white p-4 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-bottom-5">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">{product.nom} ajouté au panier</p>
                <div className="flex mt-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-soft-green hover:bg-white/90"
                    onClick={() => router.push("/panier")}
                  >
                    Voir le panier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-soft-green/90"
                    onClick={() => setShowAddedToast(false)}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

