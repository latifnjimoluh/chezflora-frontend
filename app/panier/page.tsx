"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getCart, addToCart, removeFromCart, decrementQuantity } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function PanierPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingItem, setProcessingItem] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [validatingCart, setValidatingCart] = useState(false)

  // Charger le panier au chargement de la page
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        setCartItems(data || []);
  
        // 🔹 Vérifier si l'ID du panier est stocké
        const storedPanierId = localStorage.getItem("id_panier");
        console.log(" ID du panier récupéré depuis localStorage :", storedPanierId);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger votre panier",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
  }, []);
    
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data || []);
  
      // Vérifier si un panier existe et stocker son ID dans le Local Storage
      if (data && data.length > 0) {
        const id_panier = data[0]?.id_panier; // Supposons que l'ID du panier est dans l'objet produit
        if (id_panier) {
          localStorage.setItem("id_panier", id_panier);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger votre panier",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  
  }

  const updateQuantity = async (id_produit: string, newQuantity: number, currentQuantity: number) => {
    try {
      setProcessingItem(id_produit)

      if (newQuantity > currentQuantity) {
        // Ajouter au panier (augmenter la quantité)
        const quantityToAdd = newQuantity - currentQuantity
        await addToCart(id_produit, quantityToAdd)
      } else if (newQuantity < currentQuantity) {
        // Réduire la quantité
        const diff = currentQuantity - newQuantity
        for (let i = 0; i < diff; i++) {
          await decrementQuantity(id_produit)
        }
      }

      // Rafraîchir le panier
      await fetchCart()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la quantité",
        variant: "destructive",
      })
    } finally {
      setProcessingItem(null)
    }
  }

  const removeItem = async (id_produit: string) => {
    try {
      setProcessingItem(id_produit)
      await removeFromCart(id_produit)

      // Rafraîchir le panier
      await fetchCart()

      toast({
        title: "Produit supprimé",
        description: "Le produit a été retiré de votre panier",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le produit",
        variant: "destructive",
      })
    } finally {
      setProcessingItem(null)
    }
  }

  const applyCoupon = () => {
    if (couponCode.trim() === "FLORA10") {
      setCouponApplied(true)
      toast({
        title: "Code promo appliqué",
        description: "Réduction de 10% appliquée à votre commande",
      })
    } else {
      toast({
        title: "Code promo invalide",
        description: "Le code promo saisi n'est pas valide",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    try {
      setValidatingCart(true)
      // Ne pas appeler validateCart() pour ne pas vider le panier
      // Simplement rediriger vers la page de commande
      router.push("/commande")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de valider votre panier",
        variant: "destructive",
      })
    } finally {
      setValidatingCart(false)
    }
  }

  // Calculer les totaux
  const subtotal = cartItems.reduce((total, item) => total + Number.parseFloat(item.prix) * item.quantite, 0)
  const discount = couponApplied ? subtotal * 0.1 : 0
  const deliveryFee = subtotal >= 50 ? 0 : 5.9
  const total = subtotal - discount + deliveryFee

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace(".", ",")} €`
  }

  // Fonction pour extraire les images du produit
  const getProductImage = (product: any) => {
    if (!product) return "/placeholder.svg?height=200&width=200"

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

    return images.length > 0 ? images[0] : "/placeholder.svg?height=200&width=200"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-off-white">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto flex justify-center items-center h-96">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-soft-green mb-4" />
              <p className="text-light-brown">Chargement de votre panier...</p>
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

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Votre panier floral</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Vérifiez vos articles et finalisez votre commande pour recevoir vos fleurs fraîches
          </p>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-16 w-16 text-light-brown/30" />
              </div>
              <h2 className="text-xl font-semibold text-light-brown mb-2">Votre panier est vide</h2>
              <p className="text-light-brown/70 mb-6">Ajoutez des produits à votre panier pour continuer vos achats</p>
              <Button
                className="bg-soft-green hover:bg-soft-green/90 text-white"
                onClick={() => router.push("/boutique")}
              >
                Découvrir nos produits
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id_produit}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-soft-green/10"
                        >
                          <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={getProductImage(item) || "/placeholder.svg"}
                              alt={item.nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link
                              href={`/boutique/${item.id_produit}`}
                              className="font-medium text-light-brown hover:text-soft-green"
                            >
                              {item.nom}
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center border border-soft-green/20 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id_produit, item.quantite - 1, item.quantite)}
                                  className="px-2 py-1 text-light-brown hover:bg-soft-green/10 transition-colors"
                                  disabled={processingItem === item.id_produit || item.quantite <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 py-1 text-light-brown">
                                  {processingItem === item.id_produit ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    item.quantite
                                  )}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id_produit, item.quantite + 1, item.quantite)}
                                  className="px-2 py-1 text-light-brown hover:bg-soft-green/10 transition-colors"
                                  disabled={processingItem === item.id_produit}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id_produit)}
                                className="text-red-500 hover:text-red-700 flex items-center text-sm"
                                disabled={processingItem === item.id_produit}
                              >
                                {processingItem === item.id_produit ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Supprimer
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-light-brown">
                              {formatPrice(Number.parseFloat(item.prix) * item.quantite)}
                            </p>
                            <p className="text-sm text-light-brown/70">
                              {formatPrice(Number.parseFloat(item.prix))} l'unité
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <Button
                        variant="outline"
                        className="border-light-brown text-light-brown hover:bg-light-brown/10"
                        onClick={() => router.push("/boutique")}
                      >
                        Continuer mes achats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="border-none shadow-md sticky top-4">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-xl text-light-brown mb-4">Récapitulatif</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-light-brown/70">Sous-total</span>
                        <span className="text-light-brown">{formatPrice(subtotal)}</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-soft-green">
                          <span>Réduction (10%)</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-light-brown/70">Livraison</span>
                        <span className="text-light-brown">
                          {deliveryFee === 0 ? "Gratuite" : formatPrice(deliveryFee)}
                        </span>
                      </div>
                      <div className="border-t border-soft-green/10 pt-3 flex justify-between font-semibold">
                        <span className="text-light-brown">Total</span>
                        <span className="text-light-brown">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Code promo"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                        />
                        <Button
                          variant="outline"
                          className="border-soft-green text-soft-green hover:bg-soft-green/10"
                          onClick={applyCoupon}
                        >
                          Appliquer
                        </Button>
                      </div>

                      <Button
                        className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                        onClick={handleCheckout}
                        disabled={validatingCart || cartItems.length === 0}
                      >
                        {validatingCart ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          <>
                            Valider ma commande
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <div className="text-sm text-light-brown/70 text-center">
                        <p>Livraison gratuite à partir de 50€ d'achat</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

