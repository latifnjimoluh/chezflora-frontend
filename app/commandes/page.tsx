"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getUserOrders, cancelOrder, getOrderDetails } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Type pour les produits dans une commande
interface OrderProduct {
  id_produit: string
  produit_nom: string
  description: string
  quantite: number
  prix_unitaire: string
  prix_total: string
  images?: string[] // URLs des images du produit
}

// Type pour les commandes
interface Order {
  id_commande: string
  date_commande: string
  statut: string
  prix_total: string
  adresse_livraison: string
  ville: string
  code_postal: string
  telephone: string
  email: string
  mode_livraison: string
  mode_paiement: string
  message?: string
  quantity?: number
  produits?: OrderProduct[]
}

export default function CommandesPage() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("all")
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({})
  const { toast } = useToast()
  const router = useRouter()

  // Fonction pour formater le prix
  const formatPrice = (price: any) => {
    // Si le prix est déjà une chaîne de caractères
    if (typeof price === "string") {
      // Vérifier si le prix contient déjà une virgule
      if (price.includes(",")) {
        return price.includes("€") ? price : price + " €"
      }
      // Sinon, convertir le point en virgule si nécessaire
      return price.replace(".", ",") + (price.includes("€") ? "" : " €")
    }

    // Si le prix est un nombre
    if (typeof price === "number") {
      return price.toFixed(2).replace(".", ",") + " €"
    }

    // Fallback pour les cas non gérés
    return "0,00 €"
  }

  // Récupérer les commandes au chargement de la page
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getUserOrders()

        // Formater les données pour correspondre à notre structure
        const formattedOrders = data.map((order: any) => ({
          id_commande: order.id_commande,
          date_commande: formatDate(order.date_commande),
          statut: order.statut,
          prix_total: formatPrice(order.prix_total),
          adresse_livraison: order.adresse_livraison,
          ville: order.ville,
          code_postal: order.code_postal,
          telephone: order.telephone,
          email: order.email,
          mode_livraison: order.mode_livraison,
          mode_paiement: order.mode_paiement,
          message: order.message,
          quantity: order.quantity || 0,
        }))

        setOrders(formattedOrders)
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos commandes. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  // Fonction pour basculer l'affichage des détails d'une commande
  const toggleOrderDetails = async (orderId: string) => {
    // Si on ferme les détails, on met simplement à jour l'état
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders((prev) => prev.filter((id) => id !== orderId))
      return
    }

    // Si on ouvre les détails et qu'on ne les a pas encore chargés
    if (!orderDetails[orderId]) {
      try {
        setLoadingDetails((prev) => ({ ...prev, [orderId]: true }))
        const details = await getOrderDetails(orderId)

        // Mettre à jour les détails de la commande
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: details.commande,
        }))

        // Mettre à jour la commande avec les produits
        setOrders(
          orders.map((order) => {
            if (order.id_commande === orderId) {
              return {
                ...order,
                produits: details.commande.produits || [],
              }
            }
            return order
          }),
        )
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les détails de la commande.",
          variant: "destructive",
        })
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [orderId]: false }))
      }
    }

    // Mettre à jour l'état pour afficher les détails
    setExpandedOrders((prev) => [...prev, orderId])
  }

  // Fonction pour annuler une commande
  const handleCancelOrder = async (orderId: string) => {
    try {
      // Afficher un message de confirmation
      if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
        return
      }

      await cancelOrder(orderId)

      // Mettre à jour l'état local pour refléter l'annulation
      setOrders(orders.map((order) => (order.id_commande === orderId ? { ...order, statut: "annulé" } : order)))

      toast({
        title: "Succès",
        description: "Votre commande a été annulée avec succès.",
      })
    } catch (error: any) {
      console.error("Erreur lors de l'annulation de la commande:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la commande. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    }
  }

  // Fonction pour obtenir le badge de statut - version dynamique
  const getStatusBadge = (status: string) => {
    // Convertir le statut en minuscules pour une comparaison insensible à la casse
    const statusLower = status.toLowerCase()

    // Définir les couleurs et les libellés en fonction de mots-clés dans le statut
    if (statusLower.includes("annul") || statusLower.includes("cancel")) {
      return <Badge className="bg-red-500">{status}</Badge>
    }

    if (statusLower.includes("livr") || statusLower.includes("deliver")) {
      return <Badge className="bg-soft-green">{status}</Badge>
    }

    if (
      statusLower.includes("attente") ||
      statusLower.includes("prépar") ||
      statusLower.includes("prepar") ||
      statusLower.includes("wait")
    ) {
      return <Badge className="bg-blue-500">{status}</Badge>
    }

    if (statusLower.includes("command") || statusLower.includes("order")) {
      return <Badge className="bg-amber-500">{status}</Badge>
    }

    // Statut par défaut pour tout autre cas
    return <Badge className="bg-gray-500">{status}</Badge>
  }

  // Fonction pour obtenir l'icône de statut - également mise à jour pour être dynamique
  const getStatusIcon = (status: string) => {
    // Convertir le statut en minuscules pour une comparaison insensible à la casse
    const statusLower = status.toLowerCase()

    if (statusLower.includes("annul") || statusLower.includes("cancel")) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }

    if (statusLower.includes("livr") || statusLower.includes("deliver")) {
      return <CheckCircle className="h-5 w-5 text-soft-green" />
    }

    if (
      statusLower.includes("attente") ||
      statusLower.includes("prépar") ||
      statusLower.includes("prepar") ||
      statusLower.includes("wait")
    ) {
      return <Truck className="h-5 w-5 text-blue-500" />
    }

    if (statusLower.includes("command") || statusLower.includes("order")) {
      return <Package className="h-5 w-5 text-amber-500" />
    }

    // Icône par défaut pour tout autre cas
    return <Package className="h-5 w-5 text-gray-500" />
  }

  // Filtrer les commandes en fonction de l'onglet actif
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "processing")
            return order.statut === "commandé" || order.statut === "en attente de livraison"
          if (activeTab === "delivered") return order.statut === "livré"
          if (activeTab === "cancelled") return order.statut === "annulé"
          return true
        })

  // Fonction pour extraire la première image d'un produit
  const getProductImage = (images: string[] | undefined | string) => {
    if (!images) {
      return "/placeholder.svg?height=100&width=100"
    }

    try {
      // Si c'est une chaîne JSON, la parser
      if (typeof images === "string") {
        // Vérifier si la chaîne commence par [ (tableau JSON)
        if (images.trim().startsWith("[")) {
          const parsedImages = JSON.parse(images)
          return parsedImages[0] || "/placeholder.svg?height=100&width=100"
        }
        // Sinon, c'est peut-être une URL directe
        return images
      }

      // Si c'est déjà un tableau
      if (Array.isArray(images) && images.length > 0) {
        return images[0]
      }

      return "/placeholder.svg?height=100&width=100"
    } catch (e) {
      console.error("Erreur lors du traitement de l'image:", e)
      return "/placeholder.svg?height=100&width=100"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Suivi de vos commandes</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Consultez l'état de vos commandes et suivez leur livraison
          </p>

          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="bg-beige/30 border-b border-soft-green/10 w-full justify-start">
              <TabsTrigger value="all" className="text-light-brown">
                Toutes les commandes
              </TabsTrigger>
              <TabsTrigger value="processing" className="text-light-brown">
                En cours
              </TabsTrigger>
              <TabsTrigger value="delivered" className="text-light-brown">
                Livrées
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-light-brown">
                Annulées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement de vos commandes...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Package className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas encore passé de commande</p>
                  <Button
                    className="bg-soft-green hover:bg-soft-green/90 text-white"
                    onClick={() => router.push("/boutique")}
                  >
                    Découvrir nos produits
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id_commande} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id_commande)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.statut)}
                            <span className="font-medium text-light-brown">{order.id_commande.substring(0, 8)}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date_commande}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.statut)}
                          <div className="font-medium text-light-brown">{order.prix_total}</div>
                          {expandedOrders.includes(order.id_commande) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id_commande) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {loadingDetails[order.id_commande] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin h-6 w-6 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-light-brown text-sm">Chargement des détails...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>

                                {/* Liste des produits */}
                                {order.produits && order.produits.length > 0 ? (
                                  <div className="space-y-4 mb-4">
                                    <p className="font-medium text-light-brown mb-2">
                                      Nombre de produits: {order.produits.length}
                                    </p>
                                    {order.produits.map((produit, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start gap-4 border-b border-soft-green/10 pb-4"
                                      >
                                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                          <Image
                                            src={
                                              getProductImage(produit.images) || "/placeholder.svg?height=100&width=100"
                                            }
                                            alt={produit.produit_nom}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-light-brown">{produit.produit_nom}</p>
                                          <p className="text-sm text-light-brown/70 line-clamp-2 mb-2">
                                            {produit.description}
                                          </p>
                                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            <p className="text-sm text-light-brown/70">Quantité: {produit.quantite}</p>
                                            <p className="text-sm text-light-brown/70">
                                              Prix unitaire: {formatPrice(produit.prix_unitaire)}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-medium text-light-brown whitespace-nowrap">
                                          {formatPrice(produit.prix_total)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">
                                        Nombre de produits: {order.quantity || 0}
                                      </p>
                                      <p className="text-sm text-light-brown/70 italic">
                                        Chargez les détails pour voir les produits
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between border-t border-soft-green/10 pt-3">
                                  <p className="font-medium text-light-brown">Total</p>
                                  <p className="font-bold text-light-brown">{order.prix_total}</p>
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm text-light-brown/70">
                                    Mode de paiement: {order.mode_paiement === "card" ? "Carte bancaire" : "PayPal"}
                                  </p>
                                  <p className="text-sm text-light-brown/70">
                                    Mode de livraison:{" "}
                                    {order.mode_livraison === "standard"
                                      ? "Standard"
                                      : order.mode_livraison === "express"
                                        ? "Express"
                                        : "Aucune"}
                                  </p>
                                  {order.message && (
                                    <p className="text-sm text-light-brown/70 mt-2">Message: {order.message}</p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                  <p className="text-sm text-light-brown/70">Adresse: {order.adresse_livraison}</p>
                                  <p className="text-sm text-light-brown/70">Ville: {order.ville}</p>
                                  <p className="text-sm text-light-brown/70">Code postal: {order.code_postal}</p>
                                  <p className="text-sm text-light-brown/70">Téléphone: {order.telephone}</p>
                                  <p className="text-sm text-light-brown/70">Email: {order.email}</p>
                                </div>

                                <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                  {order.statut === "commandé" && (
                                    <Button
                                      variant="outline"
                                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancelOrder(order.id_commande)
                                      }}
                                    >
                                      Annuler la commande
                                    </Button>
                                  )}
                                  {order.statut === "en attente de livraison" && (
                                    <Button
                                      variant="outline"
                                      className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                    >
                                      Suivre la livraison
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                    onClick={() => router.push("/contact")}
                                  >
                                    Contacter le service client
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Les autres TabsContent sont similaires, mais pour simplifier, je ne les inclus pas tous ici */}
            <TabsContent value="processing" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement de vos commandes...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Package className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande en cours</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas de commande en cours de traitement</p>
                  <Button
                    className="bg-soft-green hover:bg-soft-green/90 text-white"
                    onClick={() => router.push("/boutique")}
                  >
                    Découvrir nos produits
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id_commande} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id_commande)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.statut)}
                            <span className="font-medium text-light-brown">{order.id_commande.substring(0, 8)}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date_commande}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.statut)}
                          <div className="font-medium text-light-brown">{order.prix_total}</div>
                          {expandedOrders.includes(order.id_commande) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id_commande) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {loadingDetails[order.id_commande] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin h-6 w-6 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-light-brown text-sm">Chargement des détails...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>

                                {/* Liste des produits */}
                                {order.produits && order.produits.length > 0 ? (
                                  <div className="space-y-4 mb-4">
                                    <p className="font-medium text-light-brown mb-2">
                                      Nombre de produits: {order.produits.length}
                                    </p>
                                    {order.produits.map((produit, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start gap-4 border-b border-soft-green/10 pb-4"
                                      >
                                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                          <Image
                                            src={
                                              getProductImage(produit.images) || "/placeholder.svg?height=100&width=100"
                                            }
                                            alt={produit.produit_nom}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-light-brown">{produit.produit_nom}</p>
                                          <p className="text-sm text-light-brown/70 line-clamp-2 mb-2">
                                            {produit.description}
                                          </p>
                                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            <p className="text-sm text-light-brown/70">Quantité: {produit.quantite}</p>
                                            <p className="text-sm text-light-brown/70">
                                              Prix unitaire: {formatPrice(produit.prix_unitaire)}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-medium text-light-brown whitespace-nowrap">
                                          {formatPrice(produit.prix_total)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">
                                        Nombre de produits: {order.quantity || 0}
                                      </p>
                                      <p className="text-sm text-light-brown/70 italic">
                                        Chargez les détails pour voir les produits
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between border-t border-soft-green/10 pt-3">
                                  <p className="font-medium text-light-brown">Total</p>
                                  <p className="font-bold text-light-brown">{order.prix_total}</p>
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm text-light-brown/70">
                                    Mode de paiement: {order.mode_paiement === "card" ? "Carte bancaire" : "PayPal"}
                                  </p>
                                  <p className="text-sm text-light-brown/70">
                                    Mode de livraison:{" "}
                                    {order.mode_livraison === "standard"
                                      ? "Standard"
                                      : order.mode_livraison === "express"
                                        ? "Express"
                                        : "Aucune"}
                                  </p>
                                  {order.message && (
                                    <p className="text-sm text-light-brown/70 mt-2">Message: {order.message}</p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                  <p className="text-sm text-light-brown/70">Adresse: {order.adresse_livraison}</p>
                                  <p className="text-sm text-light-brown/70">Ville: {order.ville}</p>
                                  <p className="text-sm text-light-brown/70">Code postal: {order.code_postal}</p>
                                  <p className="text-sm text-light-brown/70">Téléphone: {order.telephone}</p>
                                  <p className="text-sm text-light-brown/70">Email: {order.email}</p>
                                </div>

                                <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                  {order.statut === "commandé" && (
                                    <Button
                                      variant="outline"
                                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancelOrder(order.id_commande)
                                      }}
                                    >
                                      Annuler la commande
                                    </Button>
                                  )}
                                  {order.statut === "en attente de livraison" && (
                                    <Button
                                      variant="outline"
                                      className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                    >
                                      Suivre la livraison
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                    onClick={() => router.push("/contact")}
                                  >
                                    Contacter le service client
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="delivered" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement de vos commandes...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande livrée</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas encore de commande livrée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id_commande} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id_commande)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-soft-green" />
                            <span className="font-medium text-light-brown">{order.id_commande.substring(0, 8)}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date_commande}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.statut)}
                          <div className="font-medium text-light-brown">{order.prix_total}</div>
                          {expandedOrders.includes(order.id_commande) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id_commande) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {loadingDetails[order.id_commande] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin h-6 w-6 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-light-brown text-sm">Chargement des détails...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>

                                {/* Liste des produits */}
                                {order.produits && order.produits.length > 0 ? (
                                  <div className="space-y-4 mb-4">
                                    <p className="font-medium text-light-brown mb-2">
                                      Nombre de produits: {order.produits.length}
                                    </p>
                                    {order.produits.map((produit, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start gap-4 border-b border-soft-green/10 pb-4"
                                      >
                                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                          <Image
                                            src={
                                              getProductImage(produit.images) || "/placeholder.svg?height=100&width=100"
                                            }
                                            alt={produit.produit_nom}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-light-brown">{produit.produit_nom}</p>
                                          <p className="text-sm text-light-brown/70 line-clamp-2 mb-2">
                                            {produit.description}
                                          </p>
                                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            <p className="text-sm text-light-brown/70">Quantité: {produit.quantite}</p>
                                            <p className="text-sm text-light-brown/70">
                                              Prix unitaire: {formatPrice(produit.prix_unitaire)}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-medium text-light-brown whitespace-nowrap">
                                          {formatPrice(produit.prix_total)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">
                                        Nombre de produits: {order.quantity || 0}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between border-t border-soft-green/10 pt-3">
                                  <p className="font-medium text-light-brown">Total</p>
                                  <p className="font-bold text-light-brown">{order.prix_total}</p>
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm text-light-brown/70">
                                    Mode de paiement: {order.mode_paiement === "card" ? "Carte bancaire" : "PayPal"}
                                  </p>
                                  <p className="text-sm text-light-brown/70">
                                    Mode de livraison:{" "}
                                    {order.mode_livraison === "standard"
                                      ? "Standard"
                                      : order.mode_livraison === "express"
                                        ? "Express"
                                        : "Aucune"}
                                  </p>
                                  {order.message && (
                                    <p className="text-sm text-light-brown/70 mt-2">Message: {order.message}</p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                  <p className="text-sm text-light-brown/70">Adresse: {order.adresse_livraison}</p>
                                  <p className="text-sm text-light-brown/70">Ville: {order.ville}</p>
                                  <p className="text-sm text-light-brown/70">Code postal: {order.code_postal}</p>
                                  <p className="text-sm text-light-brown/70">Téléphone: {order.telephone}</p>
                                  <p className="text-sm text-light-brown/70">Email: {order.email}</p>
                                </div>

                                <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                    onClick={() => router.push("/boutique")}
                                  >
                                    Commander à nouveau
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement de vos commandes...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <XCircle className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande annulée</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas de commande annulée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id_commande} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id_commande)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-medium text-light-brown">{order.id_commande.substring(0, 8)}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date_commande}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.statut)}
                          <div className="font-medium text-light-brown">{order.prix_total}</div>
                          {expandedOrders.includes(order.id_commande) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id_commande) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {loadingDetails[order.id_commande] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin h-6 w-6 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-light-brown text-sm">Chargement des détails...</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>

                                {/* Liste des produits */}
                                {order.produits && order.produits.length > 0 ? (
                                  <div className="space-y-4 mb-4">
                                    <p className="font-medium text-light-brown mb-2">
                                      Nombre de produits: {order.produits.length}
                                    </p>
                                    {order.produits.map((produit, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start gap-4 border-b border-soft-green/10 pb-4"
                                      >
                                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                          <Image
                                            src={
                                              getProductImage(produit.images) || "/placeholder.svg?height=100&width=100"
                                            }
                                            alt={produit.produit_nom}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-light-brown">{produit.produit_nom}</p>
                                          <p className="text-sm text-light-brown/70 line-clamp-2 mb-2">
                                            {produit.description}
                                          </p>
                                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            <p className="text-sm text-light-brown/70">Quantité: {produit.quantite}</p>
                                            <p className="text-sm text-light-brown/70">
                                              Prix unitaire: {formatPrice(produit.prix_unitaire)}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-medium text-light-brown whitespace-nowrap">
                                          {formatPrice(produit.prix_total)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">
                                        Nombre de produits: {order.quantity || 0}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between border-t border-soft-green/10 pt-3">
                                  <p className="font-medium text-light-brown">Total</p>
                                  <p className="font-bold text-light-brown">{order.prix_total}</p>
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm text-light-brown/70">
                                    Mode de paiement: {order.mode_paiement === "card" ? "Carte bancaire" : "PayPal"}
                                  </p>
                                  <p className="text-sm text-light-brown/70">
                                    Mode de livraison:{" "}
                                    {order.mode_livraison === "standard"
                                      ? "Standard"
                                      : order.mode_livraison === "express"
                                        ? "Express"
                                        : "Aucune"}
                                  </p>
                                  {order.message && (
                                    <p className="text-sm text-light-brown/70 mt-2">Message: {order.message}</p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium text-light-brown mb-2">Informations</h3>
                                  <p className="text-sm text-light-brown/70">Adresse: {order.adresse_livraison}</p>
                                  <p className="text-sm text-light-brown/70">Ville: {order.ville}</p>
                                  <p className="text-sm text-light-brown/70">Code postal: {order.code_postal}</p>
                                  <p className="text-sm text-light-brown/70">Téléphone: {order.telephone}</p>
                                  <p className="text-sm text-light-brown/70">Email: {order.email}</p>
                                </div>

                                <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                    onClick={() => router.push("/boutique")}
                                  >
                                    Commander à nouveau
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

