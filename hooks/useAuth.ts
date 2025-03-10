"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Hook personnalisé pour protéger les pages nécessitant une connexion
export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login"); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
  }, [router]);
};
