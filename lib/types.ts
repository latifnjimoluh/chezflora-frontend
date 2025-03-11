// Types pour l'API

// Authentification
export interface LoginRequest {
    identifier: string
    password: string
  }
  
  export interface RegisterRequest {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
  }
  
  export interface OTPRequest {
    email: string
    otp_code: string
  }
  
  // Utilisateur
  export interface User {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    role: string
    profile_image?: string
    is_verified: boolean
    date_creation: string
  }
  
  export interface UpdateProfileRequest {
    first_name?: string
    last_name?: string
    phone?: string
  }
  
  export interface EmailChangeRequest {
    new_email: string
  }
  
  export interface PasswordUpdateRequest {
    current_password: string
    new_password: string
  }
  
  // Produits
  export interface Product {
    id_produit: number
    nom: string
    description: string
    prix: number | string
    stock: number
    categorie_id?: number
    categorie_nom?: string
    image_url?: string
    date_creation?: string
    entretien?: string
  }
  
  // Commandes
  export interface PlaceOrderRequest {
    id_produit: number
    quantite: number
    livraison: boolean
  }
  
  export interface Order {
    id_commande: number
    id_client: number
    id_produit: number
    produit_nom?: string
    quantite: number
    prix_produit: number | string
    livraison: boolean
    prix_livraison: number | string
    prix_total: number | string
    statut: string
    date_commande: string
    image_url?: string
  }
  
  // Panier
  export interface AddToCartRequest {
    id_produit: number
    quantite: number
  }
  
  export interface CartItem {
    id_panier: number
    id_client: number
    id_produit: number
    nom: string
    prix: number | string
    quantite: number
    image_url?: string
  }
  
  // Services
  export interface Service {
    id_service: number
    nom: string
    description: string
    prix: number | string
    categorie_id?: number
    categorie_nom?: string
    image_url?: string
  }
  
  // Réservations
  export interface ReservationRequest {
    service_id: number
    dimension?: string
    nb_personnes?: number
    lieu?: string
    prix_propose?: number
  }
  
  // Abonnements
  export interface SubscriptionRequest {
    type_abonnement: string
    frequence: string
    adresse_livraison?: string
    disponibilites?: string
    dates_ateliers?: string
  }
  
  