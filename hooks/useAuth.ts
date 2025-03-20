"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isUserLoggedIn } from "@/utils/format-utils"

/**
 * Hook pour vérifier l'authentification de l'utilisateur
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 * @param redirectPath - Chemin vers lequel rediriger après la connexion
 */
export const useAuth = (redirectPath?: string) => {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = isUserLoggedIn()

    if (!isLoggedIn) {
      // Rediriger vers la page de connexion avec le chemin de redirection
      const redirectUrl = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"

      router.push(redirectUrl)
    }
  }, [router, redirectPath])

  return { isAuthenticated: isUserLoggedIn() }
}

