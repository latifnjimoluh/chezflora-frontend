import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-soft-green/10 text-light-brown">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-script text-xl mb-4">ChezFlora</h3>
            <p className="mb-4">
              Votre fleuriste artisanal, spécialisé dans les compositions florales élégantes et naturelles pour tous vos
              moments de vie.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="hover:text-powder-pink transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="hover:text-powder-pink transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-powder-pink transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-script text-xl mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/boutique" className="hover:text-powder-pink transition-colors">
                  Notre Boutique
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-powder-pink transition-colors">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-powder-pink transition-colors">
                  Blog & Inspirations
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-powder-pink transition-colors">
                  À Propos de Nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-powder-pink transition-colors">
                  Nous Contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-script text-xl mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2">123 Rue des Fleurs</p>
              <p className="mb-2">75001 Paris, France</p>
              <p className="mb-2">Téléphone: 01 23 45 67 89</p>
              <p className="mb-2">Email: contact@chezflora.fr</p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-script text-xl mb-4">Newsletter</h3>
            <p className="mb-4">Inscrivez-vous pour recevoir nos actualités et offres spéciales.</p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-white border-soft-green/30 focus:border-soft-green"
                required
              />
              <Button className="w-full bg-soft-green hover:bg-soft-green/90 text-white">S'inscrire</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-soft-green/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ChezFlora. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/mentions-legales" className="hover:text-powder-pink transition-colors">
              Mentions Légales
            </Link>
            <Link href="/cgv" className="hover:text-powder-pink transition-colors">
              CGV
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-powder-pink transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

