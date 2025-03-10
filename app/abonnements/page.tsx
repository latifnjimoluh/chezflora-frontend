"use client"

import type React from "react"

import { usePathname } from 'next/navigation';
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ChevronDown, ChevronUp, Flower, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample subscriptions data
const subscriptions = [
  {
    id: "SUB-2023-001",
    name: "Abonnement Floral Mensuel",
    description: "Recevez un bouquet de fleurs fraîches chaque mois",
    status: "active",
    startDate: "15/03/2023",
    nextDelivery: "15/06/2023",
    endDate: "15/03/2024",
    price: "45,00 € / mois",
    frequency: "Mensuel",
    image: "/placeholder.svg?height=100&width=100",
    deliveryAddress: "123 Rue des Fleurs, 75001 Paris",
    paymentMethod: "Carte bancaire terminant par 4567",
    lastRenewal: "15/05/2023",
  },
  {
    id: "SUB-2023-002",
    name: "Ateliers Floraux Trimestriels",
    description: "Participez à un atelier floral chaque trimestre",
    status: "pending",
    startDate: "01/06/2023",
    nextDelivery: "01/06/2023",
    endDate: "01/06/2024",
    price: "75,00 € / trimestre",
    frequency: "Trimestriel",
    image: "/placeholder.svg?height=100&width=100",
    deliveryAddress: "Boutique ChezFlora, 75001 Paris",
    paymentMethod: "En attente de paiement",
    lastRenewal: "-",
  },
  {
    id: "SUB-2022-003",
    name: "Abonnement Plantes d'Intérieur",
    description: "Une nouvelle plante d'intérieur tous les deux mois",
    status: "cancelled",
    startDate: "10/10/2022",
    nextDelivery: "-",
    endDate: "10/04/2023",
    price: "35,00 € / 2 mois",
    frequency: "Bimestriel",
    image: "/placeholder.svg?height=100&width=100",
    deliveryAddress: "123 Rue des Fleurs, 75001 Paris",
    paymentMethod: "Carte bancaire terminant par 4567",
    lastRenewal: "10/02/2023",
  },
]

// Sample subscription plans
const subscriptionPlans = [
  {
    id: "plan-1",
    name: "Abonnement Floral Mensuel",
    description: "Recevez un bouquet de fleurs fraîches chaque mois",
    price: "45,00 € / mois",
    frequency: "Mensuel",
    image: "/placeholder.svg?height=300&width=300",
    features: [
      "Bouquet de saison composé par nos fleuristes",
      "Livraison gratuite à domicile",
      "Possibilité de personnaliser les couleurs",
      "Engagement minimum de 3 mois",
    ],
    popular: true,
  },
  {
    id: "plan-2",
    name: "Abonnement Plantes d'Intérieur",
    description: "Une nouvelle plante d'intérieur tous les deux mois",
    price: "35,00 € / 2 mois",
    frequency: "Bimestriel",
    image: "/placeholder.svg?height=300&width=300",
    features: [
      "Plante d'intérieur sélectionnée par nos experts",
      "Pot décoratif inclus",
      "Livraison gratuite à domicile",
      "Fiche d'entretien personnalisée",
      "Engagement minimum de 6 mois",
    ],
    popular: false,
  },
  {
    id: "plan-3",
    name: "Ateliers Floraux Trimestriels",
    description: "Participez à un atelier floral chaque trimestre",
    price: "75,00 € / trimestre",
    frequency: "Trimestriel",
    image: "/placeholder.svg?height=300&width=300",
    features: [
      "Atelier de 2h dans notre boutique",
      "Matériel et fleurs inclus",
      "Repartez avec votre création",
      "Places limitées à 8 personnes",
      "Engagement minimum de 1 an",
    ],
    popular: false,
  },
]

export default function AbonnementsPage() {
  
  const router = useRouter();
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<string[]>([])
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "",
    specialRequests: "",
  })

  const toggleSubscriptionDetails = (subscriptionId: string) => {
    setExpandedSubscriptions((prev) =>
      prev.includes(subscriptionId) ? prev.filter((id) => id !== subscriptionId) : [...prev, subscriptionId],
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-soft-green">Actif</Badge>
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Résilié</Badge>
      default:
        return <Badge className="bg-gray-500">Inconnu</Badge>
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setShowSubscribeForm(true)
    // Scroll to form
    setTimeout(() => {
      document.getElementById("subscription-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.paymentMethod
    ) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success scenario
      setSuccess(true)

      // Reset form after a delay
      setTimeout(() => {
        setShowSubscribeForm(false)
        setSelectedPlan(null)
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          postalCode: "",
          paymentMethod: "",
          specialRequests: "",
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async (subscriptionId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir résilier cet abonnement ?")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Votre demande de résiliation a été prise en compte.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1 py-8 px-4 md:px-8 lg:px-16 bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
        <div className="container mx-auto">
          <h1 className="font-script text-4xl text-center text-light-brown mb-2">Vos abonnements</h1>
          <p className="text-center text-light-brown/80 mb-8 max-w-2xl mx-auto">
            Gérez vos abonnements floraux et découvrez nos offres
          </p>

          <Tabs defaultValue="active" className="mb-8">
            <TabsList className="bg-beige/30 border-b border-soft-green/10 w-full justify-start">
              <TabsTrigger value="active" className="text-light-brown">
                Mes abonnements
              </TabsTrigger>
              <TabsTrigger value="discover" className="text-light-brown">
                Découvrir nos abonnements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Flower className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucun abonnement</h2>
                  <p className="text-light-brown/70 mb-6">Vous n'avez pas encore souscrit à un abonnement</p>
                  <Button
                    className="bg-soft-green hover:bg-soft-green/90 text-white"
                    onClick={() => router.push("?tab=discover")}
                  >
                    Découvrir nos abonnements
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <Card key={subscription.id} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleSubscriptionDetails(subscription.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={subscription.image || "/placeholder.svg"}
                              alt={subscription.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-light-brown">{subscription.name}</h3>
                            <div className="text-sm text-light-brown/70">
                              {subscription.frequency} • {subscription.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(subscription.status)}
                          {subscription.status === "active" && (
                            <div className="text-sm text-light-brown/70">
                              Prochaine livraison: {subscription.nextDelivery}
                            </div>
                          )}
                          {expandedSubscriptions.includes(subscription.id) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedSubscriptions.includes(subscription.id) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-light-brown mb-3">Détails de l'abonnement</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Référence:</span>
                                    <span className="text-light-brown">{subscription.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Date de début:</span>
                                    <span className="text-light-brown">{subscription.startDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Date de fin:</span>
                                    <span className="text-light-brown">{subscription.endDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Dernier renouvellement:</span>
                                    <span className="text-light-brown">{subscription.lastRenewal}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Prochaine livraison:</span>
                                    <span className="text-light-brown">{subscription.nextDelivery}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-light-brown mb-3">Informations de livraison</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Adresse:</span>
                                    <span className="text-light-brown">{subscription.deliveryAddress}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Moyen de paiement:</span>
                                    <span className="text-light-brown">{subscription.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                              {subscription.status === "active" && (
                                <>
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                  >
                                    Modifier l'abonnement
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                                    onClick={() => cancelSubscription(subscription.id)}
                                  >
                                    Résilier l'abonnement
                                  </Button>
                                </>
                              )}
                              {subscription.status === "pending" && (
                                <Button
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                  onClick={() => cancelSubscription(subscription.id)}
                                >
                                  Annuler la demande
                                </Button>
                              )}
                              {subscription.status === "cancelled" && (
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                >
                                  Souscrire à nouveau
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`border-none shadow-md overflow-hidden ${plan.popular ? "ring-2 ring-soft-green" : ""}`}
                  >
                    {plan.popular && (
                      <div className="bg-soft-green text-white text-center py-1 text-sm font-medium">
                        Le plus populaire
                      </div>
                    )}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-script text-xl text-light-brown mb-2">{plan.name}</h3>
                      <p className="text-light-brown/80 mb-4">{plan.description}</p>
                      <div className="text-soft-green font-medium text-xl mb-4">{plan.price}</div>

                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-soft-green mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-light-brown/80">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        Souscrire
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {showSubscribeForm && (
                <div id="subscription-form" className="mt-8 scroll-mt-8">
                  <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                      <h2 className="font-script text-2xl text-light-brown mb-6">
                        Souscrire à {subscriptionPlans.find((p) => p.id === selectedPlan)?.name}
                      </h2>

                      {error && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert className="mb-6 bg-soft-green/10 border-soft-green/30">
                          <CheckCircle2 className="h-4 w-4 text-soft-green" />
                          <AlertDescription className="text-soft-green">
                            Votre abonnement a été souscrit avec succès. Vous recevrez un email de confirmation.
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <h3 className="font-medium text-light-brown mb-4">Informations personnelles</h3>
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
                                Téléphone
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                                value={formData.phone}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-light-brown mb-4">Adresse de livraison</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-light-brown mb-4">Informations de paiement</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="paymentMethod" className="text-light-brown">
                                Moyen de paiement <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.paymentMethod}
                                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                                required
                              >
                                <SelectTrigger className="bg-beige/30 border-soft-green/20 focus:border-soft-green">
                                  <SelectValue placeholder="Sélectionnez un moyen de paiement" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="card">Carte bancaire</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="sepa">Prélèvement SEPA</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {formData.paymentMethod === "card" && (
                              <div className="p-4 bg-beige/30 rounded-md">
                                <div className="flex items-center mb-4">
                                  <CreditCard className="h-5 w-5 text-soft-green mr-2" />
                                  <span className="text-light-brown font-medium">Paiement sécurisé</span>
                                </div>
                                <p className="text-sm text-light-brown/80">
                                  Vous serez redirigé vers notre plateforme de paiement sécurisée après avoir validé
                                  votre commande.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialRequests" className="text-light-brown">
                            Demandes spéciales
                          </Label>
                          <Textarea
                            id="specialRequests"
                            name="specialRequests"
                            placeholder="Préférences de couleurs, allergies, instructions particulières..."
                            className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                            value={formData.specialRequests}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                            disabled={isLoading}
                          >
                            {isLoading ? "Traitement en cours..." : "Confirmer l'abonnement"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
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

