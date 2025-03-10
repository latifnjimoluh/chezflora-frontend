"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample orders data
const orders = [
  {
    id: "CMD-2023-001",
    date: "15/03/2023",
    status: "delivered",
    total: "95,00 €",
    items: [
      {
        id: 1,
        name: "Bouquet Printanier",
        image: "/placeholder.svg?height=100&width=100",
        price: "45,00 €",
        quantity: 1,
      },
      {
        id: 3,
        name: "Orchidée Élégante",
        image: "/placeholder.svg?height=100&width=100",
        price: "55,00 €",
        quantity: 1,
      },
    ],
    deliveryAddress: "123 Rue des Fleurs, 75001 Paris",
    deliveryDate: "17/03/2023",
    trackingNumber: "TRK123456789",
  },
  {
    id: "CMD-2023-002",
    date: "02/04/2023",
    status: "processing",
    total: "40,00 €",
    items: [
      {
        id: 5,
        name: "Bouquet de Saison",
        image: "/placeholder.svg?height=100&width=100",
        price: "40,00 €",
        quantity: 1,
      },
    ],
    deliveryAddress: "123 Rue des Fleurs, 75001 Paris",
    deliveryDate: "Prévue le 04/04/2023",
    trackingNumber: "TRK987654321",
  },
  {
    id: "CMD-2023-003",
    date: "10/04/2023",
    status: "cancelled",
    total: "55,00 €",
    items: [
      {
        id: 3,
        name: "Orchidée Élégante",
        image: "/placeholder.svg?height=100&width=100",
        price: "55,00 €",
        quantity: 1,
      },
    ],
    deliveryAddress: "123 Rue des Fleurs, 75001 Paris",
    deliveryDate: "Annulée",
    trackingNumber: "-",
  },
]

export default function CommandesPage() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-amber-500">En préparation</Badge>
      case "shipped":
        return <Badge className="bg-blue-500">Expédiée</Badge>
      case "delivered":
        return <Badge className="bg-soft-green">Livrée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge className="bg-gray-500">En attente</Badge>
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

          <Tabs defaultValue="all" className="mb-8">
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
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Package className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas encore passé de commande</p>
                  <Button
                    className="bg-soft-green hover:bg-soft-green/90 text-white"
                    onClick={() => (window.location.href = "/boutique")}
                  >
                    Découvrir nos produits
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {order.status === "processing" && <Package className="h-5 w-5 text-amber-500" />}
                            {order.status === "shipped" && <Truck className="h-5 w-5 text-blue-500" />}
                            {order.status === "delivered" && <CheckCircle className="h-5 w-5 text-soft-green" />}
                            {order.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                            <span className="font-medium text-light-brown">{order.id}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <div className="font-medium text-light-brown">{order.total}</div>
                          {expandedOrders.includes(order.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-start gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">{item.name}</p>
                                      <p className="text-sm text-light-brown/70">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-light-brown">{item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                <p className="text-sm text-light-brown/70">Adresse: {order.deliveryAddress}</p>
                                <p className="text-sm text-light-brown/70">Date: {order.deliveryDate}</p>
                                <p className="text-sm text-light-brown/70">Numéro de suivi: {order.trackingNumber}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                {order.status === "processing" && (
                                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                                    Annuler la commande
                                  </Button>
                                )}
                                {order.status === "shipped" && (
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
                                >
                                  Contacter le service client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "processing" || order.status === "shipped")
                  .map((order) => (
                    <Card key={order.id} className="border-none shadow-md overflow-hidden">
                      {/* Same card content as above, filtered for processing orders */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {order.status === "processing" && <Package className="h-5 w-5 text-amber-500" />}
                            {order.status === "shipped" && <Truck className="h-5 w-5 text-blue-500" />}
                            <span className="font-medium text-light-brown">{order.id}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <div className="font-medium text-light-brown">{order.total}</div>
                          {expandedOrders.includes(order.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Same expanded content as above */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-start gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">{item.name}</p>
                                      <p className="text-sm text-light-brown/70">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-light-brown">{item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                <p className="text-sm text-light-brown/70">Adresse: {order.deliveryAddress}</p>
                                <p className="text-sm text-light-brown/70">Date: {order.deliveryDate}</p>
                                <p className="text-sm text-light-brown/70">Numéro de suivi: {order.trackingNumber}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                                  Annuler la commande
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Contacter le service client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "processing" || order.status === "shipped").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <Package className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande en cours</h2>
                    <p className="text-light-brown/70 mb-6">Vous n'avez pas de commande en cours de traitement</p>
                    <Button
                      className="bg-soft-green hover:bg-soft-green/90 text-white"
                      onClick={() => (window.location.href = "/boutique")}
                    >
                      Découvrir nos produits
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="mt-6">
              {/* Similar content for delivered orders */}
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "delivered")
                  .map((order) => (
                    <Card key={order.id} className="border-none shadow-md overflow-hidden">
                      {/* Card content for delivered orders */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-soft-green" />
                            <span className="font-medium text-light-brown">{order.id}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <div className="font-medium text-light-brown">{order.total}</div>
                          {expandedOrders.includes(order.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Expanded content for delivered orders */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-start gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">{item.name}</p>
                                      <p className="text-sm text-light-brown/70">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-light-brown">{item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations de livraison</h3>
                                <p className="text-sm text-light-brown/70">Adresse: {order.deliveryAddress}</p>
                                <p className="text-sm text-light-brown/70">Date: {order.deliveryDate}</p>
                                <p className="text-sm text-light-brown/70">Numéro de suivi: {order.trackingNumber}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Commander à nouveau
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "delivered").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande livrée</h2>
                    <p className="text-light-brown/70 mb-6">Vous n'avez pas encore de commande livrée</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {/* Similar content for cancelled orders */}
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "cancelled")
                  .map((order) => (
                    <Card key={order.id} className="border-none shadow-md overflow-hidden">
                      {/* Card content for cancelled orders */}
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-medium text-light-brown">{order.id}</span>
                          </div>
                          <div className="text-sm text-light-brown/70">Commandé le {order.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <div className="font-medium text-light-brown">{order.total}</div>
                          {expandedOrders.includes(order.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedOrders.includes(order.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          {/* Expanded content for cancelled orders */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-light-brown mb-3">Détails de la commande</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-start gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-light-brown">{item.name}</p>
                                      <p className="text-sm text-light-brown/70">Quantité: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-light-brown">{item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium text-light-brown mb-2">Informations</h3>
                                <p className="text-sm text-light-brown/70">Adresse: {order.deliveryAddress}</p>
                                <p className="text-sm text-light-brown/70">Statut: {order.deliveryDate}</p>
                              </div>

                              <div className="flex flex-col justify-end items-start md:items-end gap-2">
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Commander à nouveau
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                {orders.filter((order) => order.status === "cancelled").length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <XCircle className="h-16 w-16 text-light-brown/30" />
                    </div>
                    <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune commande annulée</h2>
                    <p className="text-light-brown/70 mb-6">Vous n'avez pas de commande annulée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

