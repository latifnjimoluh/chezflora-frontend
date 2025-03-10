"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=300&width=1920"
            alt="Contactez ChezFlora"
            width={1920}
            height={300}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
            <h1 className="font-script mb-4 text-center text-4xl md:text-5xl">Contactez-nous</h1>
            <p className="max-w-2xl text-center text-lg">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h2 className="font-script text-2xl text-light-brown mb-6">Envoyez-nous un message</h2>

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
                          Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-light-brown">
                            Nom complet <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            className="bg-beige/30 border-soft-green/20 focus:border-soft-green"
                            value={formData.name}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-light-brown">
                            Sujet <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => handleSelectChange("subject", value)}
                            required
                          >
                            <SelectTrigger className="bg-beige/30 border-soft-green/20 focus:border-soft-green">
                              <SelectValue placeholder="Sélectionnez un sujet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="information">Demande d'information</SelectItem>
                              <SelectItem value="commande">Question sur une commande</SelectItem>
                              <SelectItem value="service">Réservation de service</SelectItem>
                              <SelectItem value="reclamation">Réclamation</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-light-brown">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          className="bg-beige/30 border-soft-green/20 focus:border-soft-green min-h-[150px]"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-soft-green hover:bg-soft-green/90 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-script text-2xl text-light-brown mb-6">Nos coordonnées</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-soft-green/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-soft-green" />
                      </div>
                      <div>
                        <h3 className="font-medium text-light-brown">Adresse</h3>
                        <p className="text-light-brown/80">123 Rue des Fleurs</p>
                        <p className="text-light-brown/80">75001 Paris, France</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-soft-green/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-soft-green" />
                      </div>
                      <div>
                        <h3 className="font-medium text-light-brown">Téléphone</h3>
                        <p className="text-light-brown/80">01 23 45 67 89</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-soft-green/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-soft-green" />
                      </div>
                      <div>
                        <h3 className="font-medium text-light-brown">Email</h3>
                        <p className="text-light-brown/80">contact@chezflora.fr</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-soft-green/10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-soft-green" />
                      </div>
                      <div>
                        <h3 className="font-medium text-light-brown">Horaires d'ouverture</h3>
                        <p className="text-light-brown/80">Lundi - Vendredi: 9h00 - 19h00</p>
                        <p className="text-light-brown/80">Samedi: 10h00 - 18h00</p>
                        <p className="text-light-brown/80">Dimanche: Fermé</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-script text-2xl text-light-brown mb-6">Nous trouver</h2>
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=600"
                      alt="Carte ChezFlora"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-3 rounded-lg shadow-md">
                        <MapPin className="h-6 w-6 text-soft-green" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-off-white">
          <div className="container mx-auto">
            <h2 className="font-script text-3xl text-center text-light-brown mb-12">Questions fréquentes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg text-light-brown mb-2">Quels sont vos délais de livraison ?</h3>
                  <p className="text-light-brown/80">
                    Nous livrons à Paris et sa banlieue le jour même pour toute commande passée avant 14h. Pour les
                    autres régions, le délai est généralement de 24 à 48h.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg text-light-brown mb-2">Comment puis-je suivre ma commande ?</h3>
                  <p className="text-light-brown/80">
                    Vous recevrez un email de confirmation avec un numéro de suivi dès que votre commande sera expédiée.
                    Vous pouvez également suivre votre commande dans votre espace client.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg text-light-brown mb-2">
                    Puis-je modifier ou annuler ma commande ?
                  </h3>
                  <p className="text-light-brown/80">
                    Vous pouvez modifier ou annuler votre commande jusqu'à 24h avant la date de livraison prévue.
                    Contactez-nous par téléphone ou par email pour toute modification.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg text-light-brown mb-2">
                    Proposez-vous des services pour les entreprises ?
                  </h3>
                  <p className="text-light-brown/80">
                    Oui, nous proposons des services d'abonnement floral et de décoration pour les entreprises.
                    Contactez-nous pour obtenir un devis personnalisé.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-light-brown/80 mb-4">Vous n'avez pas trouvé la réponse à votre question ?</p>
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white">Contactez-nous</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

