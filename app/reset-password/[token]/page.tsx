"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage"; // ✅ Import du hook personnalisé

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; // Récupère le token depuis l'URL

  // ✅ Utilisation du hook useLocalStorage pour gérer le token
  const [resetToken, setResetToken] = useLocalStorage<string | null>("resetToken", null);

  useEffect(() => {
    if (token) {
      setResetToken(token); // ✅ Stocke le token en local avec le hook
      router.replace("/reset-password"); // Redirige vers la page de réinitialisation
    }
  }, [token, router, setResetToken]);

  return null;
}
