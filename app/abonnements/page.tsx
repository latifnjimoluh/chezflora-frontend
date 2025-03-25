"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Flower,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  getUserSubscriptions,
  cancelSubscription,
  subscribeToService,
  checkSubscriptionExpiry,
  getAllSubscriptionTypes,
} from "@/services/api"
import { useToast } from "@/hooks/use-toast"

// Types pour les abonnements
interface Subscription {
  id_abonnement: string | number
  type_abonnement: string
  frequence: string
  date_debut: string
  date_fin: string
  statut: string
  adresse_livraison?: string
  disponibilites?: string
  dates_ateliers?: string
  prix?: string
  derniere_livraison?: string
  prochaine_livraison?: string
  moyen_paiement?: string
}

// Type pour les types d'abonnements
interface SubscriptionType {
  id: number
  nom: string
  description: string
  prix: number
  frequence: string
  duree_engagement: number
  image_url: string
  est_populaire: boolean
  est_actif: boolean
  caracteristiques?: string[]
}

export default function AbonnementsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<string[]>([])
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "",
    specialRequests: "",
    disponibilites: "",
    dates_ateliers: "",
    date_souscription:"",
  })

  // Récupérer les abonnements de l'utilisateur au chargement de la page
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        const data = await getUserSubscriptions()
        setSubscriptions(data || [])
      } catch (error: any) {
        console.error("Erreur lors de la récupération des abonnements:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos abonnements. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
        setSubscriptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [toast])

  // Récupérer les types d'abonnements disponibles
  useEffect(() => {
    const fetchSubscriptionTypes = async () => {
      try {
        setLoadingPlans(true)
        const data = await getAllSubscriptionTypes()
        setSubscriptionTypes(data || [])
      } catch (error: any) {
        console.error("Erreur lors de la récupération des types d'abonnements:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les types d'abonnements. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
        // Utiliser des données par défaut en cas d'erreur
        setSubscriptionTypes([])
      } finally {
        setLoadingPlans(false)
      }
    }

    fetchSubscriptionTypes()
  }, [toast])

  // Vérifier si des abonnements expirent bientôt
  useEffect(() => {
    const checkExpirations = async () => {
      try {
        const expiryData = await checkSubscriptionExpiry()
        if (expiryData && expiryData.expiring_soon && expiryData.expiring_soon.length > 0) {
          toast({
            title: "Rappel",
            description: `Vous avez ${expiryData.expiring_soon.length} abonnement(s) qui expire(nt) bientôt.`,
            variant: "default",
          })
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des expirations:", error)
      }
    }

    checkExpirations()
  }, [toast])

  const toggleSubscriptionDetails = (subscriptionId: string) => {
    setExpandedSubscriptions((prev) =>
      prev.includes(subscriptionId) ? prev.filter((id) => id !== subscriptionId) : [...prev, subscriptionId],
    )
  }

  // Fonction pour obtenir le badge de statut - version dynamique
  const getStatusBadge = (status: string) => {
    // Convertir le statut en minuscules pour une comparaison insensible à la casse
    const statusLower = status.toLowerCase()

    // Définir les couleurs et les libellés en fonction de mots-clés dans le statut
    if (
      statusLower.includes("annul") ||
      statusLower.includes("résil") ||
      statusLower.includes("cancel") ||
      statusLower.includes("termin")
    ) {
      return <Badge className="bg-red-500">{status}</Badge>
    }

    if (
      statusLower.includes("actif") ||
      statusLower.includes("activ") ||
      statusLower.includes("en cours") ||
      statusLower.includes("abonné")
    ) {
      return <Badge className="bg-soft-green">{status}</Badge>
    }

    if (statusLower.includes("attente") || statusLower.includes("pending") || statusLower.includes("wait")) {
      return <Badge className="bg-amber-500">{status}</Badge>
    }

    if (statusLower.includes("pause") || statusLower.includes("suspen")) {
      return <Badge className="bg-blue-500">{status}</Badge>
    }

    // Statut par défaut pour tout autre cas
    return <Badge className="bg-gray-500">{status}</Badge>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlanSelect = (planId: number) => {
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
      const selectedPlanData = subscriptionTypes.find((plan) => plan.id === selectedPlan)

      if (!selectedPlanData) {
        throw new Error("Plan d'abonnement non trouvé")
      }

      // Préparer les données pour l'API
      const subscriptionData = {
        type_abonnement: selectedPlanData.nom,
        frequence: selectedPlanData.frequence,
        adresse_livraison: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        disponibilites: formData.disponibilites || undefined,
        dates_ateliers: formData.dates_ateliers || undefined,
      }

      // Appeler l'API pour souscrire à l'abonnement
      await subscribeToService(subscriptionData)

      // Afficher le message de succès
      setSuccess(true)
      toast({
        title: "Succès",
        description: "Votre abonnement a été souscrit avec succès. Vous recevrez un email de confirmation.",
      })

      // Rafraîchir la liste des abonnements
      const updatedSubscriptions = await getUserSubscriptions()
      setSubscriptions(updatedSubscriptions || [])

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
          disponibilites: "",
          dates_ateliers: "",
          date_souscription:"",
        })
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error("Erreur lors de la souscription:", err)
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.")
      toast({
        title: "Erreur",
        description: err.message || "Impossible de souscrire à l'abonnement. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async (subscriptionId: string | number) => {
    if (window.confirm("Êtes-vous sûr de vouloir résilier cet abonnement ?")) {
      try {
        setIsLoading(true)
        await cancelSubscription(Number(subscriptionId))

        toast({
          title: "Succès",
          description: "Votre abonnement a été résilié avec succès.",
        })

        // Mettre à jour la liste des abonnements
        const updatedSubscriptions = await getUserSubscriptions()
        setSubscriptions(updatedSubscriptions || [])
      } catch (err: any) {
        console.error("Erreur lors de la résiliation:", err)
        toast({
          title: "Erreur",
          description: err.message || "Impossible de résilier l'abonnement. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    } catch (e) {
      return dateString; // Retourne la valeur brute si l'erreur persiste
    }
  };
  

  // Fonction pour formater le prix
  const formatPrice = (price: any, frequency: string) => {
    // 🔹 Vérifier si price est un nombre valide
    const parsedPrice = typeof price === "number" ? price : Number.parseFloat(price)
  
    // 🔹 Gérer les cas où le prix est invalide
    if (isNaN(parsedPrice)) {
      console.error("❌ Prix invalide :", price)
      return "Prix non disponible"
    }
  
    // 🔹 Formatter le prix
    const formattedPrice = parsedPrice.toFixed(2).replace(".", ",") + " XAF"
  
    switch (frequency.toLowerCase()) {
      case "mensuel":
        return `${formattedPrice} / mois`
      case "bimestriel":
        return `${formattedPrice} / 2 mois`
      case "trimestriel":
        return `${formattedPrice} / trimestre`
      case "semestriel":
        return `${formattedPrice} / semestre`
      case "annuel":
        return `${formattedPrice} / an`
      default:
        return `${formattedPrice} / ${frequency}`
    }
  }
  

  // Fonction pour obtenir le nom convivial de la fréquence
  const getFrequencyName = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      mensuel: "Mensuel",
      bimestriel: "Bimestriel",
      trimestriel: "Trimestriel",
      semestriel: "Semestriel",
      annuel: "Annuel",
    }

    return frequencyMap[frequency.toLowerCase()] || frequency
  }

  // Fonction pour déterminer si des champs spécifiques sont nécessaires
  const needsSpecificFields = (planName: string) => {
    const planNameLower = planName.toLowerCase()

    if (planNameLower.includes("atelier")) {
      return {
        dates_ateliers: true,
        disponibilites: true,
        adresse_livraison: false,
      }
    }

    if (planNameLower.includes("conseil") || planNameLower.includes("décoration")) {
      return {
        dates_ateliers: false,
        disponibilites: true,
        adresse_livraison: false,
      }
    }

    if (planNameLower.includes("floral") || planNameLower.includes("plante")) {
      return {
        dates_ateliers: false,
        disponibilites: false,
        adresse_livraison: true,
      }
    }

    return {
      dates_ateliers: false,
      disponibilites: false,
      adresse_livraison: true,
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement de vos abonnements...</p>
                </div>
              ) : subscriptions.length === 0 ? (
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
                    <Card key={subscription.id_abonnement} className="border-none shadow-md overflow-hidden">
                      <div
                        className="p-4 bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        onClick={() => toggleSubscriptionDetails(String(subscription.id_abonnement))}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src="/placeholder.svg?height=100&width=100"
                              alt={subscription.type_abonnement}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-light-brown">{subscription.type_abonnement}</h3>
                            <div className="text-sm text-light-brown/70">
                              {getFrequencyName(subscription.frequence)} • {subscription.prix || "Prix non spécifié"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(subscription.statut)}
                          {subscription.statut.toLowerCase().includes("actif") && subscription.prochaine_livraison && (
                            <div className="text-sm text-light-brown/70">
                              Prochaine livraison: {formatDate(subscription.prochaine_livraison)}
                            </div>
                          )}
                          {expandedSubscriptions.includes(String(subscription.id_abonnement)) ? (
                            <ChevronUp className="h-5 w-5 text-light-brown" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-light-brown" />
                          )}
                        </div>
                      </div>

                      {expandedSubscriptions.includes(String(subscription.id_abonnement)) && (
                        <CardContent className="p-4 border-t border-soft-green/10 bg-beige/10">
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-light-brown mb-3">Détails de l'abonnement</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Référence:</span>
                                    <span className="text-light-brown">{subscription.id_abonnement}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Date de début:</span>
                                    <span className="text-light-brown">{formatDate(subscription.date_souscription)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-light-brown/70">Date de fin:</span>
                                    <span className="text-light-brown">{formatDate(subscription.date_echeance)}</span>
                                  </div>
                                  {subscription.derniere_livraison && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Dernière livraison:</span>
                                      <span className="text-light-brown">
                                        {formatDate(subscription.derniere_livraison)}
                                      </span>
                                    </div>
                                  )}
                                  {subscription.prochaine_livraison && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Prochaine livraison:</span>
                                      <span className="text-light-brown">
                                        {formatDate(subscription.prochaine_livraison)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-light-brown mb-3">Informations de livraison</h4>
                                <div className="space-y-2">
                                  {subscription.adresse_livraison && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Adresse:</span>
                                      <span className="text-light-brown">{subscription.adresse_livraison}</span>
                                    </div>
                                  )}
                                  {subscription.disponibilites && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Disponibilités:</span>
                                      <span className="text-light-brown">{subscription.disponibilites}</span>
                                    </div>
                                  )}
                                  {subscription.dates_ateliers && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Dates des ateliers:</span>
                                      <span className="text-light-brown">{subscription.dates_ateliers}</span>
                                    </div>
                                  )}
                                  {subscription.moyen_paiement && (
                                    <div className="flex justify-between">
                                      <span className="text-light-brown/70">Moyen de paiement:</span>
                                      <span className="text-light-brown">{subscription.moyen_paiement}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                              {subscription.statut.toLowerCase().includes("actif") ||
                              subscription.statut.toLowerCase().includes("abonné") ? (
                                <>
                                  <Button
                                    variant="outline"
                                    className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                    onClick={() =>
                                      router.push(
                                        `/contact?subject=Modification de l'abonnement ${subscription.id_abonnement}`,
                                      )
                                    }
                                  >
                                    Modifier l'abonnement
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleCancelSubscription(subscription.id_abonnement)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Traitement...
                                      </>
                                    ) : (
                                      "Résilier l'abonnement"
                                    )}
                                  </Button>
                                </>
                              ) : null}
                              {subscription.statut.toLowerCase().includes("attente") && (
                                <Button
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                  onClick={() => handleCancelSubscription(subscription.id_abonnement)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Traitement... /> Traitement...
                                    </>
                                  ) : (
                                    "Annuler la demande"
                                  )}
                                </Button>
                              )}
                              {subscription.statut.toLowerCase().includes("résil") && (
                                <Button
                                  variant="outline"
                                  className="border-soft-green text-soft-green hover:bg-soft-green/10"
                                  onClick={() => router.push("?tab=discover")}
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
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-soft-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-light-brown">Chargement des offres d'abonnement...</p>
                </div>
              ) : subscriptionTypes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Flower className="h-16 w-16 text-light-brown/30" />
                  </div>
                  <h2 className="text-xl font-semibold text-light-brown mb-2">Aucune offre disponible</h2>
                  <p className="text-light-brown/70 mb-6">
                    Nos offres d'abonnement ne sont pas disponibles pour le moment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {subscriptionTypes.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`border-none shadow-md overflow-hidden ${plan.est_populaire ? "ring-2 ring-soft-green" : ""}`}
                    >
                      {plan.est_populaire && (
                        <div className="bg-soft-green text-white text-center py-1 text-sm font-medium">
                          Le plus populaire
                        </div>
                      )}
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={plan.image_url || "/placeholder.svg?height=300&width=300"}
                          alt={plan.nom}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-script text-xl text-light-brown mb-2">{plan.nom}</h3>
                        <p className="text-light-brown/80 mb-4">{plan.description}</p>
                        <div className="text-soft-green font-medium text-xl mb-4">
                          {formatPrice(plan.prix, plan.frequence)}
                        </div>

                        <div className="space-y-2 mb-6">
                          {plan.caracteristiques &&
                            plan.caracteristiques.map((feature, index) => (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-soft-green mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-light-brown/80">{feature}</span>
                              </div>
                            ))}
                          {!plan.caracteristiques && (
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-soft-green mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-light-brown/80">
                                Engagement minimum de {plan.duree_engagement} mois
                              </span>
                            </div>
                          )}
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
              )}

              {showSubscribeForm && selectedPlan !== null && (
                <div id="subscription-form" className="mt-8 scroll-mt-8">
                  <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                      <h2 className="font-script text-2xl text-light-brown mb-6">
                        Souscrire à {subscriptionTypes.find((p) => p.id === selectedPlan)?.nom}
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

                        {/* Champs d'adresse conditionnels selon le type d'abonnement */}
                        {selectedPlan &&
                          subscriptionTypes.find((p) => p.id === selectedPlan) &&
                          needsSpecificFields(subscriptionTypes.find((p) => p.id === selectedPlan)!.nom)
                            .adresse_livraison && (
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
                          )}

                        {/* Champs spécifiques selon le type d'abonnement */}
                        {selectedPlan && subscriptionTypes.find((p) => p.id === selectedPlan) && (
                          <>
                            {needsSpecificFields(subscriptionTypes.find((p) => p.id === selectedPlan)!.nom)
                              .disponibilites && (
                              <div>
                                <h3 className="font-medium text-light-brown mb-4">Informations spécifiques</h3>
                                <div className="space-y-2">
                                  <Label htmlFor="disponibilites" className="text-light-brown">
                                    Vos disponibilités <span className="text-red-500">*</span>
                                  </Label>
                                  <Textarea
                                    id="disponibilites"
                                    name="disponibilites"
                                    placeholder="Indiquez vos jours et heures de disponibilité"
                                    className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                                    value={formData.disponibilites}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            {needsSpecificFields(subscriptionTypes.find((p) => p.id === selectedPlan)!.nom)
                              .dates_ateliers && (
                              <div className="space-y-2">
                                <Label htmlFor="dates_ateliers" className="text-light-brown">
                                  Dates préférées pour les ateliers <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                  id="dates_ateliers"
                                  name="dates_ateliers"
                                  placeholder="Indiquez les dates qui vous conviendraient pour participer aux ateliers"
                                  className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[100px]"
                                  value={formData.dates_ateliers}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            )}
                          </>
                        )}

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
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Traitement en cours...
                              </>
                            ) : (
                              "Confirmer l'abonnement"
                            )}
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

