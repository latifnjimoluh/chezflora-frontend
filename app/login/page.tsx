"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginUser } from "@/services/api";
import { useLocalStorage } from "@/hooks/useLocalStorage"; 

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
const [token, setToken] = useLocalStorage<string | null>("token", null);
const [role, setRole] = useLocalStorage<string | null>("role", null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData.identifier, formData.password);

      if (data.status === "verification") {
        setError("Votre compte n'est pas encore activé. Veuillez vérifier votre email.");
        if (typeof window !== "undefined") {
          localStorage.setItem("email", data.email);
        }
        setTimeout(() => {
          router.replace("/verify-otp");
        }, 2000);
        return;
      }

      // ✅ Stockage avec `useLocalStorage`
      setToken(data.token);
      setRole(data.role);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  console.log("LocalStorage Data:", localStorage);

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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="font-script text-3xl text-center text-light-brown mb-2">Connexion</h1>
            <p className="text-center text-light-brown/80 mb-6">Accédez à votre espace personnel</p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-light-brown">
                  Email ou Téléphone
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="votre@email.com ou téléphone"
                    className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-light-brown">
                    Mot de passe
                  </Label>
                  <Link href="/forgot-password" className="text-soft-green text-sm hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-brown/60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-beige/30 border-soft-green/20 focus:border-soft-green"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-soft-green hover:bg-soft-green/90 text-white mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-light-brown">
                Vous n'avez pas de compte ? {" "}
                <Link href="/register" className="text-soft-green hover:underline">
                  Inscrivez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-light-brown/70 text-sm">
        <p>&copy; {new Date().getFullYear()} ChezFlora. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
