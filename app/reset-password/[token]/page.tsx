"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; // Récupère le token depuis l'URL

  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("resetToken", token); // Stocke le token dans le localStorage
      router.replace("/reset-password"); // Redirige vers la page de réinitialisation
    }
  }, [token, router]);

  return null;
}
