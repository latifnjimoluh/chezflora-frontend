"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

import {getOrderDetails, cancelOrder} from "@/services/api"


export default function CommandeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id)
    }
  }, [params.id])

  const fetchOrderDetails = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrderDetails(id)
      setOrder(data)
    } catch (error: any) {
      setError(error.message || "Impossible de charger les détails de la commande")
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les détails de la commande",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true)
      await cancelOrder(params.id)

      // Rafraîchir les détails de la commande
      await fetchOrderDetails(params.id)

      toast({
        title: "Commande annulée",
        description: "Votre commande a été annulée avec succès",
      })

      setShowCancelDialog(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la commande",
        variant: "destructive",
      })
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "commandé":
        return <Badge className="bg-amber-500">Commandé</Badge>
      case "en attente de livraison":
        return <Badge className="bg-blue-500">En attente de livraison</Badge>
      case "livré":
        return <Badge className="bg-soft-green">Livré</Badge>
      case "annulé":
        return <Badge className="bg-red-500">Annulé</Badge>
      default:
        return <Badge className="bg-gray-500">En attente</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "commandé":
        return <Package className="h-5 w-5 text-amber-500" />
      case "en attente de livraison":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "livré":
        return <CheckCircle className="h-5 w-5 text-soft-green" />
      case "annulé":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // Fonction pour formater la
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return `${price.toFixed(2).replace(".", ",")} €`
  }

  // Fonction pour extraire les images du produit
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
          <Button
            variant="ghost"
            className="mb-6 text-light-brown hover:text-soft-green hover:bg-soft-green/10"
            onClick={() => router.push("/commandes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à mes commandes
          </Button>

          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Détails de la commande</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Consultez les informations détaillées de votre commande
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-soft-green mb-4" />
                <p className="text-light-brown">Chargement des détails de la commande...</p>
              </div>
            </div>
          ) : !order ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-light-brown/30" />
              </div>
              <h2 className="text-xl font-semibold text-light-brown mb-2">Commande introuvable</h2>
              <p className="text-light-brown/70 mb-6">Nous n'avons pas pu trouver les détails de cette commande</p>
              <Button
                className="bg-soft-green hover:bg-soft-green/90 text-white"
                onClick={() => router.push("/commandes")}
              >
                Voir toutes mes commandes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.statut)}
                        <span className="font-medium text-light-brown">Commande #{order.id_commande}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-light-brown/70">
                        <Calendar className="h-4 w-4" />
                        Commandé le {formatDate(order.date_commande)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">{getStatusBadge(order.statut)}</div>
                  </div>

                  <CardContent className="p-6 border-t border-soft-green/10">
                    <h3 className="font-medium text-lg text-light-brown mb-4">Produits commandés</h3>
                    <div className="space-y-4">
                      {order.produits.map((item: any) => (
                        <div
                          key={item.id_produit}
                          className="flex items-start gap-4 pb-4 border-b border-soft-green/10 last:border-0"
                        >
                          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={getProductImage(item) || "/placeholder.svg"}
                              alt={item.produit_nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-light-brown">{item.produit_nom}</p>
                            <div className="flex flex-wrap gap-4 mt-1">
                              <p className="text-sm text-light-brown/70">
                                Prix unitaire: {formatPrice(item.prix_unitaire)}
                              </p>
                              <p className="text-sm text-light-brown/70">Quantité: {item.quantite}</p>
                            </div>
                          </div>
                          <p className="font-medium text-light-brown">{formatPrice(item.prix_total)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-soft-green/10">
                      <div className="flex justify-between mb-2">
                        <span className="text-light-brown/70">Sous-total</span>
                        <span className="text-light-brown">
                          {formatPrice(
                            order.produits.reduce((total: number, item: any) => total + Number(item.prix_total), 0),
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-light-brown/70">Livraison</span>
                        <span className="text-light-brown">
                          {formatPrice(
                            order.prix_total -
                              order.produits.reduce((total: number, item: any) => total + Number(item.prix_total), 0),
                          )}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span className="text-light-brown">Total</span>
                        <span className="text-light-brown">{formatPrice(order.prix_total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {(order.statut === "commandé" || order.statut === "en attente de livraison") && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Annuler la commande
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Card className="border-none shadow-md sticky top-4">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg text-light-brown mb-4">Informations de livraison</h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-soft-green mt-0.5" />
                        <div>
                          <p className="font-medium text-light-brown">Adresse de livraison</p>
                          <p className="text-light-brown/70">{order.adresse_livraison}</p>
                          <p className="text-light-brown/70">
                            {order.code_postal} {order.ville}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-soft-green mt-0.5" />
                        <div>
                          <p className="font-medium text-light-brown">Mode de livraison</p>
                          <p className="text-light-brown/70">
                            {order.mode_livraison === "standard"
                              ? "Livraison standard (2-3 jours)"
                              : order.mode_livraison === "express"
                                ? "Livraison express (le jour même)"
                                : "Aucune livraison"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-soft-green mt-0.5" />
                        <div>
                          <p className="font-medium text-light-brown">Mode de paiement</p>
                          <p className="text-light-brown/70">
                            {order.mode_paiement === "card" ? "Carte bancaire" : "PayPal"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-soft-green mt-0.5" />
                        <div>
                          <p className="font-medium text-light-brown">Email</p>
                          <p className="text-light-brown/70">{order.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-soft-green mt-0.5" />
                        <div>
                          <p className="font-medium text-light-brown">Téléphone</p>
                          <p className="text-light-brown/70">{order.telephone}</p>
                        </div>
                      </div>
                    </div>

                    {order.message && (
                      <div className="mt-6 pt-4 border-t border-soft-green/10">
                        <p className="font-medium text-light-brown mb-2">Message</p>
                        <p className="text-light-brown/70 italic">{order.message}</p>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-soft-green/10">
                      <Button
                        variant="outline"
                        className="w-full border-soft-green text-soft-green hover:bg-soft-green/10"
                        onClick={() => router.push("/contact")}
                      >
                        Contacter le service client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Dialog de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la commande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer l'annulation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

