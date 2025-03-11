"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, CreditCard, AlertCircle, Truck, Clock, MapPin, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getCart, validateCart, passerCommande } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

// Sample cart items
// const cartItems = [
//   {
//     id: 1,
//     name: "Bouquet Printanier",
//     image: "/placeholder.svg?height=100&width=100",
//     price: 45.0,
//     quantity: 1,
//   },
//   {
//     id: 3,
//     name: "Orchidée Élégante",
//     image: "/placeholder.svg?height=100&width=100",
//     price: 55.0,
//     quantity: 2,
//   },
// ]

export default function CommandePage() {
  const router = useRouter() //
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    message: "",
  })

  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace(".", ",")} €`
  }

  useEffect(() => {
    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCartItems(data || []);

            // 🔹 Récupérer et afficher l'ID du panier depuis le localStorage
            const storedPanierId = localStorage.getItem("id_panier");
            console.log(" ID du panier récupéré depuis localStorage :", storedPanierId);

            // 🔹 Afficher tout le localStorage pour debug
            console.log("Contenu du localStorage :", localStorage);

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
  }, [toast]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.fullName ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.phone ||
      !formData.email
    ) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données de commande
      const commandeData = {
        produits: cartItems.map((item) => ({
          id_produit: item.id_produit,
          quantite: item.quantite,
        })),
        adresse_livraison: formData.address,
        ville: formData.city,
        code_postal: formData.postalCode,
        telephone: formData.phone,
        email: formData.email,
        mode_livraison: deliveryMethod,
        mode_paiement: paymentMethod,
        message: formData.message || undefined,
      }

      // Passer la commande
      await passerCommande(commandeData)

      // Vider le panier après avoir passé la commande avec succès
      await validateCart()

      // Afficher le succès
      setSuccess(true)

      // Rediriger vers la page de confirmation après un délai
      setTimeout(() => {
        router.push("/commandes")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + Number.parseFloat(item.prix) * item.quantite, 0)
  const deliveryFee = deliveryMethod === "express" ? 9.9 : subtotal >= 50 ? 0 : 5.9
  const total = subtotal + deliveryFee

  const getProductImage = (product: any) => {
    if (!product) return "/placeholder.svg?height=100&width=100"

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

    return images.length > 0 ? images[0] : "/placeholder.svg?height=100&width=100"
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Validation de votre commande</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Finalisez votre commande en remplissant les informations ci-dessous
          </p>

          {success ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-soft-green" />
              </div>
              <h2 className="font-script text-2xl text-light-brown mb-4">Commande confirmée !</h2>
              <p className="text-light-brown/80 mb-6">
                Votre commande a été enregistrée avec succès. Vous allez recevoir un email de confirmation.
              </p>
              <div className="flex justify-center space-x-2">
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-soft-green rounded-full animate-bounce"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Form */}
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Informations de livraison</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-light-brown">
                              Nom complet <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-light-brown">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-light-brown">
                              Téléphone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-light-brown">
                              Adresse <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="address"
                              name="address"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-light-brown">
                              Code postal <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.postalCode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-light-brown">
                              Ville <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Mode de livraison</h2>
                        <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="standard" id="standard" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="standard" className="font-medium text-light-brown flex items-center">
                                <Truck className="h-4 w-4 mr-2" />
                                Livraison standard
                                {subtotal >= 50 && <span className="ml-2 text-soft-green text-sm">(Gratuite)</span>}
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">Livraison sous 2-3 jours ouvrés</p>
                              {subtotal < 50 && <p className="text-sm font-medium text-light-brown mt-1">5,90 €</p>}
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="express" id="express" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="express" className="font-medium text-light-brown flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Livraison express
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">
                                Livraison le jour même pour toute commande avant 14h
                              </p>
                              <p className="text-sm font-medium text-light-brown mt-1">9,90 €</p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <h2 className="font-semibold text-xl text-light-brown mb-4">Mode de paiement</h2>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="card" id="card" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="card" className="font-medium text-light-brown flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Carte bancaire
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">Paiement sécurisé par carte bancaire</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 bg-white p-3 rounded-md border border-soft-green/20">
                            <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="paypal" className="font-medium text-light-brown flex items-center">
                                PayPal
                              </Label>
                              <p className="text-sm text-light-brown/70 mt-1">Paiement sécurisé via PayPal</p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-light-brown">
                          Message (optionnel)
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Instructions spéciales pour la livraison ou message à joindre au bouquet..."
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Traitement en cours..." : "Confirmer ma commande"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="border-none shadow-md sticky top-4">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-xl text-light-brown mb-4">Récapitulatif</h2>

                    <div className="space-y-4 mb-6">
                      {loading ? (
                        <div className="flex justify-center items-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-soft-green" />
                        </div>
                      ) : cartItems.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-light-brown/70">Votre panier est vide</p>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div key={item.id_produit} className="flex items-start gap-3">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={getProductImage(item) || "/placeholder.svg"}
                                alt={item.nom}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-light-brown">{item.nom}</p>
                              <p className="text-sm text-light-brown/70">Quantité: {item.quantite}</p>
                            </div>
                            <p className="font-medium text-light-brown">
                              {formatPrice(Number.parseFloat(item.prix) * item.quantite)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-3 mb-6 border-t border-soft-green/10 pt-4">
                      <div className="flex justify-between">
                        <span className="text-light-brown/70">Sous-total</span>
                        <span className="text-light-brown">{subtotal.toFixed(2).replace(".", ",")} €</span>
                      </div>
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

                    <div className="bg-beige/30 p-4 rounded-md">
                      <div className="flex items-start space-x-2 text-light-brown/80">
                        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-soft-green" />
                        <div>
                          <p className="text-sm font-medium text-light-brown">Zone de livraison</p>
                          <p className="text-sm">Paris et sa banlieue uniquement</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-light-brown/70">
                      <p>En confirmant votre commande, vous acceptez nos conditions générales de vente.</p>
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

