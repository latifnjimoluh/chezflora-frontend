"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/services/api";

export default function ForgotPasswordPage() {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white bg-[url('/floral-pattern-light.svg')] bg-opacity-5 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8">
          <Image
            src="/placeholder.svg?height=50&width=150"
            alt="ChezFlora Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        <div className="w-full max-w-md">
          {success ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-soft-green" />
              </div>
              <h2 className="font-script text-2xl text-light-brown mb-4">Email envoyé !</h2>
              <p className="text-light-brown/80 mb-6">
                Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de
                passe.
              </p>
              <Button className="bg-soft-green hover:bg-soft-green/90 text-white" onClick={() => router.push("/login")}>
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="font-script text-3xl text-center text-light-brown mb-2">Mot de passe oublié</h1>
              <p className="text-center text-light-brown/80 mb-6">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-light-brown">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-soft-green hover:bg-soft-green/90 text-white mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-light-brown">
                  <Link href="/login" className="text-soft-green hover:underline">
                    Retour à la connexion
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
