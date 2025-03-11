"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ShoppingBag } from 'lucide-react'
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
import { getAllProducts, addToCart } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function BoutiquePage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { toast } = useToast()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showAddedToast, setShowAddedToast] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getAllProducts()
        setProducts(data)
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err)
        setError("Impossible de charger les produits. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace(".", ",")} €`
  }

  // Fonction pour filtrer les produits par catégorie
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Filtrer les produits en fonction de la recherche et des catégories sélectionnées
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categorie)
    return matchesSearch && matchesCategory
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.prix - b.prix
      case "price-desc":
        return b.prix - a.prix
      case "newest":
      default:
        return new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime()
    }
  })

  // Extraire les catégories uniques
  const categories = Array.from(new Set(products.map((p) => p.categorie)))

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault() // Empêcher la navigation vers la page détail
    e.stopPropagation() // Empêcher la propagation de l'événement

    try {
      setAddingToCart(product.id_produit)
      await addToCart(product.id_produit, 1)
      
      // Afficher la notification
      setShowAddedToast(product.id_produit)
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowAddedToast(null)
      }, 3000)
      
      toast({
        title: "Produit ajouté",
        description: `${product.nom} ajouté au panier`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white border-soft-green/20">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
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
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <label htmlFor={`category-${category}`} className="text-sm text-light-brown cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
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
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-light-brown">Chargement des produits...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-light-brown">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => {
                    // Convertir la chaîne JSON en tableau si nécessaire
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

                    const mainImage = images && images.length > 0 ? images[0] : "/placeholder.svg?height=300&width=300"

                    const isInStock = product.stock > 0 && product.statut === "Disponible"

                    return (
                      <Link href={`/boutique/${product.id_produit}`} key={product.id_produit}>
                        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full group">
                          <div className="relative h-64 w-full overflow-hidden">
                            <Image
                              src={mainImage || "/placeholder.svg"}
                              alt={product.nom}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 bg-powder-pink px-2 py-1 rounded-full text-xs text-light-brown">
                              {product.categorie}
                            </div>
                            {!isInStock && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Rupture de stock
                                </span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg text-light-brown">{product.nom}</h3>
                            <p className="text-soft-green font-medium mt-1">
                              {formatPrice(Number.parseFloat(product.prix))}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <Button
                                className="flex-1 bg-beige hover:bg-beige/90 text-light-brown"
                                disabled={!isInStock}
                              >
                                Voir détails
                              </Button>
                              {isInStock && (
                                <Button
                                  className="bg-soft-green hover:bg-soft-green/90 text-white"
                                  onClick={(e) => handleAddToCart(e, product)}
                                  disabled={addingToCart === product.id_produit}
                                >
                                  {addingToCart === product.id_produit ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <ShoppingBag className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {showAddedToast && (
          <div className="fixed bottom-4 right-4 bg-soft-green text-white p-4 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-bottom-5">
            <ShoppingBag className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">Produit ajouté au panier</p>
              <div className="flex mt-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white text-soft-green hover:bg-white/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/panier");
                  }}
                >
                  Voir le panier
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-soft-green/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddedToast(null);
                  }}
                >
                  Continuer
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

