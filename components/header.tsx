"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingBag, User } from "lucide-react"
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Supprime toutes les données stockées
    setIsLoggedIn(false);
    router.replace("/"); // Redirige vers la page d'accueil
  };

  // Vérifier si la page actuelle correspond à un chemin donné
  const isActive = (path: string) => {
    return pathname === path;
  }

  // Vérifier si la page actuelle commence par un chemin donné (pour les sections)
  const isActiveSection = (path: string) => {
    return pathname?.startsWith(path) ?? false; 
  };
  

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-light-brown"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=50&width=150"
                alt="ChezFlora Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${isActive("/") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
            >
              Accueil
            </Link>
            <div className="relative group">
              <button
                className={`flex items-center ${isActiveSection("/boutique") || isActiveSection("/panier") || isActiveSection("/commandes") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
              >
                Boutique <Menu className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block group-focus-within:block">
                <Link
                  href="/boutique"
                  className={`block px-4 py-2 ${isActive("/boutique") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Tous nos produits
                </Link>
                <Link
                  href="/panier"
                  className={`block px-4 py-2 ${isActive("/panier") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Mon panier
                </Link>
                <Link
                  href="/commandes"
                  className={`block px-4 py-2 ${isActive("/commandes") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Mes commandes
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button
                className={`flex items-center ${isActiveSection("/services") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
              >
                Services <Menu className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block group-focus-within:block">
                <Link
                  href="/services"
                  className={`block px-4 py-2 ${isActive("/services") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Nos services
                </Link>
                <Link
                  href="/services/reservation"
                  className={`block px-4 py-2 ${isActive("/services/reservation") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Réserver un service
                </Link>
                <Link
                  href="/services/reservations"
                  className={`block px-4 py-2 ${isActive("/services/reservations") ? "bg-soft-green/10 text-soft-green" : "text-light-brown"} hover:bg-soft-green/10 hover:text-soft-green`}
                >
                  Mes réservations
                </Link>
              </div>
            </div>
            <Link
              href="/abonnements"
              className={`${isActiveSection("/abonnements") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
            >
              Abonnements
            </Link>
            <Link
              href="/blog"
              className={`${isActiveSection("/blog") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`${isActive("/contact") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <Link href="/panier" className="text-light-brown hover:text-soft-green transition-colors">
              <ShoppingBag size={24} />
            </Link>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-light-brown hover:text-soft-green transition-colors">
                    <User size={24} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-script text-light-brown">Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Gérer mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-light-brown hover:text-soft-green transition-colors">
                    <User size={24} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-script text-light-brown">Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer text-soft-green">
                      Connexion
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="cursor-pointer">
                      S'inscrire
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-soft-green/20">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  href="/"
                  className={`block ${isActive("/") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <div
                  className={`block ${isActiveSection("/boutique") || isActiveSection("/panier") || isActiveSection("/commandes") ? "text-soft-green" : "text-light-brown"} font-medium mb-1`}
                >
                  Boutique
                </div>
                <ul className="pl-4 space-y-2 mt-2">
                  <li>
                    <Link
                      href="/boutique"
                      className={`block ${isActive("/boutique") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tous nos produits
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/panier"
                      className={`block ${isActive("/panier") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon panier
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/commandes"
                      className={`block ${isActive("/commandes") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mes commandes
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <div
                  className={`block ${isActiveSection("/services") ? "text-soft-green" : "text-light-brown"} font-medium mb-1`}
                >
                  Services
                </div>
                <ul className="pl-4 space-y-2 mt-2">
                  <li>
                    <Link
                      href="/services"
                      className={`block ${isActive("/services") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Nos services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services/reservation"
                      className={`block ${isActive("/services/reservation") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Réserver un service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services/reservations"
                      className={`block ${isActive("/services/reservations") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mes réservations
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/abonnements"
                  className={`block ${isActiveSection("/abonnements") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Abonnements
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`block ${isActiveSection("/blog") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`block ${isActive("/contact") ? "text-soft-green font-medium" : "text-light-brown"} hover:text-soft-green transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="block text-soft-green hover:text-soft-green/80 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Gérer mon profil
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Se déconnecter
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block text-soft-green hover:text-soft-green/80 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block text-light-brown hover:text-soft-green transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

