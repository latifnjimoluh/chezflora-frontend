"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Send, Loader2, CheckCircle2 } from "lucide-react"
import API from "@/services/apis"

export default function Footer() {
  const [footerData, setFooterData] = useState({
    address: "Mendong, Yaounde ",
    phone: "01 23 45 67 89",
    email: "contact@chezflora.com",
    hours: "Lun-Sam: 9h-19h | Dim: 10h-13h",
    description:
      "Votre fleuriste artisanal, spécialisé dans les compositions florales élégantes et naturelles pour tous vos moments de vie.",
  })

  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=50&width=150")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Récupérer tous les contenus du site
        const siteContents = await API.siteContent.getAllContents()

        if (siteContents) {
          setFooterData({
            address: siteContents.footer_address || footerData.address,
            phone: siteContents.footer_phone || footerData.phone,
            email: siteContents.footer_email || footerData.email,
            hours: siteContents.footer_hours || footerData.hours,
            description: siteContents.site_description || footerData.description,
          })

          if (siteContents.logo_url) {
            setLogoUrl(siteContents.logo_url)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du footer:", error)
      }
    }

    fetchFooterData()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setSubscriptionError("Veuillez entrer une adresse email valide.")
      return
    }

    setIsSubmitting(true)
    setSubscriptionError(null)

    try {
      await API.blog.subscribeToNewsletter(email)
      setSubscriptionSuccess(true)
      setEmail("")

      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setSubscriptionSuccess(false)
      }, 5000)
    } catch (error: any) {
      console.error("Erreur lors de l'inscription à la newsletter:", error)
      setSubscriptionError(error.message || "Une erreur est survenue lors de l'inscription.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-white border-t border-soft-green/10 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="mb-4">
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt="ChezFlora Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-light-brown/80 mb-6">{footerData.description}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-soft-green hover:text-soft-green/80 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-soft-green hover:text-soft-green/80 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-soft-green hover:text-soft-green/80 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-script text-xl text-light-brown mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/boutique" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/abonnements" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-light-brown/80 hover:text-soft-green transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-script text-xl text-light-brown mb-4">Nous Contacter</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-soft-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-light-brown/80">{footerData.address}</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-soft-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-light-brown/80">{footerData.phone}</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-soft-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-light-brown/80">{footerData.email}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-soft-green mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-light-brown/80">{footerData.hours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-script text-xl text-light-brown mb-4">Newsletter</h3>
            <p className="text-light-brown/80 mb-4">Inscrivez-vous pour recevoir nos actualités et offres spéciales.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="pr-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 bg-soft-green hover:bg-soft-green/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {subscriptionSuccess && (
                <div className="text-soft-green text-sm flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Merci pour votre inscription !</span>
                </div>
              )}

              {subscriptionError && <div className="text-red-500 text-sm">{subscriptionError}</div>}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-soft-green/10 pt-6 text-center">
          <p className="text-light-brown/60 text-sm">
            &copy; {new Date().getFullYear()} ChezFlora. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

