"use client";


import { usePathname } from 'next/navigation';
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample cart items
const initialCartItems = [
  {
    id: 1,
    name: "Bouquet Printanier",
    image: "/placeholder.svg?height=200&width=200",
    price: 45.0,
    quantity: 1,
    slug: "/boutique/bouquet-printanier",
  },
  {
    id: 3,
    name: "Orchidée Élégante",
    image: "/placeholder.svg?height=200&width=200",
    price: 55.0,
    quantity: 2,
    slug: "/boutique/orchidee-elegante",
  },
]

export default function PanierPage() {
  
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.trim() === "FLORA10") {
      setCouponApplied(true)
    } else {
      alert("Code promo invalide")
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = couponApplied ? subtotal * 0.1 : 0
  const deliveryFee = subtotal >= 50 ? 0 : 5.9
  const total = subtotal - discount + deliveryFee

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
                          key={item.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-soft-green/10"
                        >
                          <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={item.slug} className="font-medium text-light-brown hover:text-soft-green">
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center border border-soft-green/20 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-light-brown hover:bg-soft-green/10 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 py-1 text-light-brown">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-light-brown hover:bg-soft-green/10 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 flex items-center text-sm"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-light-brown">
                              {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
                            </p>
                            <p className="text-sm text-light-brown/70">
                              {item.price.toFixed(2).replace(".", ",")} € l'unité
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
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setCartItems([])}
                      >
                        Vider le panier
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
                        <span className="text-light-brown">{subtotal.toFixed(2).replace(".", ",")} €</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-soft-green">
                          <span>Réduction (10%)</span>
                          <span>-{discount.toFixed(2).replace(".", ",")} €</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-light-brown/70">Livraison</span>
                        <span className="text-light-brown">
                          {deliveryFee === 0 ? "Gratuite" : `${deliveryFee.toFixed(2).replace(".", ",")} €`}
                        </span>
                      </div>
                      <div className="border-t border-soft-green/10 pt-3 flex justify-between font-semibold">
                        <span className="text-light-brown">Total</span>
                        <span className="text-light-brown">{total.toFixed(2).replace(".", ",")} €</span>
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
                        onClick={() => router.push("/commande")}
                      >
                        Valider ma commande
                        <ArrowRight className="ml-2 h-4 w-4" />
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

