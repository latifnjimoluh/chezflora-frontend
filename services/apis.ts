import * as apiService from "@/services/api"

// Types
export interface Service {
  id_service: string | number
  nom: string
  description: string
  categorie: string
  images: string[] | string
  tarification: string
  disponibilite: string | boolean
  mis_en_avant: boolean
  dimension: string
  nb_personnes: number
  lieu: string
}

export interface Reservation {
  id: number
  client_id: number
  service_id: number
  prix: number
  dimension: string
  nb_personnes: number
  lieu: string
  statut: string
  date_evenement?: string
  adresse?: string
  details?: string
  message_client?: string
  date_reservation?: string
  service_nom?: string
  service_categorie?: string
  service_dimension?: string
  service_nb_personnes?: number
  service_lieu?: string
}

export interface DiscussionReservation {
  id: number
  client_id: number
  service_id: number
  dimension: string
  nb_personnes: number
  lieu: string
  prix_propose: number
  date_evenement?: string
  adresse?: string
  details?: string
  message_client: string
  statut: string
  date_creation: string
  reponse_admin?: string
  service_nom: string
  service_dimension?: string
  service_nb_personnes?: number
  service_lieu?: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
}

// Types pour les abonnements
export interface SubscriptionType {
  id: number
  nom: string
  description: string
  prix: number
  frequence: string
  duree_engagement: number
  image_url: string
  est_populaire: boolean
  est_actif: boolean
  caracteristiques?: string[]
}

// Types pour le contact
export interface ContactInfo {
  address: { value: string; icon: string }
  phone: { value: string; icon: string }
  email: { value: string; icon: string }
  hours: { value: string; icon: string }
}

export interface ContactSubject {
  id: number
  value: string
  label: string
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Types pour le blog
export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  category: string
  tags: string[]
  likes: number
}

export interface BlogComment {
  id: number
  post_id: number
  user_id: number
  content: string
  likes: number
  created_at: string
  username?: string
  avatar?: string
}

// Types pour le blog
export interface BlogCategory {
  name: string
  count: number
}

// API structure adaptée pour maintenir la compatibilité avec les composants existants
const API = {
  auth: {
    isAuthenticated: (): boolean => {
      return !!apiService.getAuthToken()
    },
    login: async (identifier: string, password: string) => {
      return await apiService.loginUser(identifier, password)
    },
    register: async (userData: any) => {
      return await apiService.registerUser(userData)
    },
    logout: () => {
      apiService.logoutUser()
    },
    verifyOTP: async (email: string, otp_code: string) => {
      return await apiService.verifyOTP(email, otp_code)
    },
    resendOTP: async (email: string) => {
      return await apiService.resendOTP(email)
    },
    forgotPassword: async (email: string) => {
      return await apiService.forgotPassword(email)
    },
    resetPassword: async (resetToken: string, newPassword: string) => {
      return await apiService.resetPassword(resetToken, newPassword)
    },
    // Fonction pour récupérer l'utilisateur courant
    getCurrentUser: async () => {
      return await apiService.getUserProfile()
    },
  },
  services: {
    getAllServices: async () => {
      return await apiService.getAllActiveServices()
    },
    getServiceById: async (id: string | number) => {
      try {
        return await apiService.getServiceById(id)
      } catch (error) {
        console.error(`Erreur lors de la récupération du service (ID: ${id}):`, error)
        throw error
      }
    },
    getServicesSurDevis: async () => {
      return await apiService.getServicesSurDevis()
    },
    // Nouvelle fonction pour récupérer les catégories de services
    getServiceCategories: async () => {
      try {
        const response = await apiService.getServiceCategories()
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories de services:", error)
        return [] // Retourner un tableau vide en cas d'erreur
      }
    },
  },
  reservations: {
    getUserReservations: async (token?: string) => {
      // Le token est ignoré car il est géré par l'intercepteur
      return await apiService.getUserReservations()
    },
    getUserDiscussions: async (token?: string) => {
      // Le token est ignoré car il est géré par l'intercepteur
      return await apiService.getUserDiscussions()
    },
    finalizeReservation: async (data: { reservation_id: number; action: "valider" | "annuler" }) => {
      return await apiService.finalizeReservation(data.reservation_id, data.action)
    },
    annulerReservation: async (id: number) => {
      return await apiService.cancelReservation(id)
    },
    reserveService: async (data: any) => {
      return await apiService.reserveService(data)
    },
    ajouterDiscussionDevis: async (data: any) => {
      return await apiService.addDiscussionDevis(data)
    },
  },
  products: {
    getAllProducts: async () => {
      return await apiService.getAllProducts()
    },
    getProductById: async (id: number) => {
      return await apiService.getProductById(id)
    },
    checkStock: async (id: number) => {
      return await apiService.checkProductStock(id)
    },
    // Nouvelle fonction pour récupérer les produits mis en avant
    getFeaturedProducts: async () => {
      try {
        const response = await apiService.getFeaturedProducts()
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des produits mis en avant:", error)
        return []
      }
    },
  },
  cart: {
    getCart: async () => {
      try {
        const response = await apiService.getCart()
        // S'assurer que le résultat est un tableau
        return Array.isArray(response) ? response : response && response.items ? response.items : []
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error)
        return [] // Retourner un tableau vide en cas d'erreur
      }
    },
    addToCart: async (id_produit: string | number, quantite: number) => {
      return await apiService.addToCart(Number(id_produit), quantite)
    },
    removeFromCart: async (id_produit: string | number) => {
      return await apiService.removeFromCart(Number(id_produit))
    },
    validateCart: async (id_panier: string | number) => {
      return await apiService.validateCart(Number(id_panier))
    },
    decrementCartItem: async (id_produit: string | number) => {
      return await apiService.decrementCartItem(Number(id_produit))
    },
  },
  orders: {
    placeOrder: async (orderData: any) => {
      return await apiService.placeOrder(orderData)
    },
    cancelOrder: async (id_commande: number) => {
      return await apiService.cancelOrder(id_commande)
    },
    getUserOrders: async () => {
      return await apiService.getUserOrders()
    },
    getUserOrdersByStatus: async (statut: string) => {
      return await apiService.getUserOrdersByStatus(statut)
    },
    getOrderDetails: async (id_commande: number) => {
      return await apiService.getOrderDetails(id_commande)
    },
  },
  user: {
    getUserProfile: async () => {
      return await apiService.getUserProfile()
    },
    updateUserProfile: async (profileData: any) => {
      return await apiService.updateUserProfile(profileData)
    },
    updatePassword: async (passwordData: any) => {
      return await apiService.updatePassword(passwordData)
    },
    requestEmailChange: async (new_email: string) => {
      return await apiService.requestEmailChange(new_email)
    },
    confirmEmailChange: async (otp_code: string) => {
      return await apiService.confirmEmailChange(otp_code)
    },
    requestAccountDeletion: async () => {
      return await apiService.requestAccountDeletion()
    },
    confirmAccountDeletion: async (otp_code: string) => {
      return await apiService.confirmAccountDeletion(otp_code)
    },
  },
  subscriptions: {
    subscribeToService: async (subscriptionData: any) => {
      return await apiService.subscribeToService(subscriptionData)
    },
    getUserSubscriptions: async () => {
      return await apiService.getUserSubscriptions()
    },
    cancelSubscription: async (id_abonnement: number) => {
      return await apiService.cancelSubscription(id_abonnement)
    },
    checkSubscriptionExpiry: async () => {
      return await apiService.checkSubscriptionExpiry()
    },
    // Nouvelle fonction pour récupérer les types d'abonnements
    getAllSubscriptionTypes: async () => {
      return await apiService.getAllSubscriptionTypes()
    },
  },
  // Nouvelle section pour les fonctions de contact
  contact: {
    getContactInfo: async () => {
      return await apiService.getContactInfo()
    },
    getContactSubjects: async () => {
      return await apiService.getContactSubjects()
    },
    sendContactMessage: async (messageData: ContactMessage) => {
      return await apiService.sendContactMessage(messageData)
    },
    getFaqs: async (category?: string) => {
      return await apiService.getFaqs(category)
    },
  },
  blog: {
    getAllPosts: async () => {
      return await apiService.getAllBlogPosts()
    },
    getPostBySlug: async (slug: string) => {
      return await apiService.getBlogPostBySlug(slug)
    },
    getPostComments: async (postId: number) => {
      return await apiService.getBlogPostComments(postId)
    },
    addComment: async (postId: number, content: string) => {
      return await apiService.addBlogComment(postId, content)
    },
    deleteComment: async (commentId: number) => {
      return await apiService.deleteBlogComment(commentId)
    },
    likePost: async (postId: number) => {
      return await apiService.likeBlogPost(postId)
    },
    unlikePost: async (postId: number) => {
      return await apiService.unlikeBlogPost(postId)
    },
    checkPostLike: async (postId: number) => {
      return await apiService.checkBlogPostLike(postId)
    },
    likeComment: async (commentId: number) => {
      return await apiService.likeBlogComment(commentId)
    },
    unlikeComment: async (commentId: number) => {
      return await apiService.unlikeBlogComment(commentId)
    },
    checkCommentLike: async (commentId: number) => {
      return await apiService.checkBlogCommentLike(commentId)
    },
    getCategories: async () => {
      return await apiService.getBlogCategories()
    },
    getPopularTags: async () => {
      return await apiService.getPopularBlogTags()
    },
    subscribeToNewsletter: async (email: string) => {
      return await apiService.subscribeToNewsletter(email)
    },
    // Nouvelles fonctions pour récupérer les articles par tag, catégorie et auteur
    getPostsByTag: async (tag: string) => {
      try {
        console.log(`Récupération des articles avec le tag: ${tag}...`)
        // Essayer d'abord d'utiliser l'API dédiée si elle existe
        try {
          const response = await apiService.getPostsByTag(tag)
          return response
        } catch (apiError) {
          console.log("API dédiée non disponible, filtrage côté client...")
          // Fallback: récupérer tous les articles et filtrer côté client
          const posts = await apiService.getAllBlogPosts()

          // Filtrer les articles qui contiennent le tag spécifié
          return posts.filter((post) => {
            // Vérifier si post.tags est une chaîne JSON ou un tableau
            let tags = post.tags
            if (typeof post.tags === "string") {
              try {
                tags = JSON.parse(post.tags)
              } catch (e) {
                tags = []
              }
            }

            // Vérifier si le tag existe dans le tableau de tags
            return Array.isArray(tags) && tags.some((t) => t.toLowerCase() === tag.toLowerCase())
          })
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des articles par tag (${tag}):`, error)
        return [] // Retourner un tableau vide au lieu de lancer une erreur
      }
    },

    getPostsByCategory: async (category: string) => {
      try {
        console.log(`Récupération des articles de la catégorie: ${category}...`)
        // Essayer d'abord d'utiliser l'API dédiée si elle existe
        try {
          const response = await apiService.getPostsByCategory(category)
          return response
        } catch (apiError) {
          console.log("API dédiée non disponible, filtrage côté client...")
          // Fallback: récupérer tous les articles et filtrer côté client
          const posts = await apiService.getAllBlogPosts()

          // Filtrer les articles qui appartiennent à la catégorie spécifiée
          return posts.filter((post) => post.category && post.category.toLowerCase() === category.toLowerCase())
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des articles par catégorie (${category}):`, error)
        return [] // Retourner un tableau vide au lieu de lancer une erreur
      }
    },

    getPostsByAuthor: async (author: string) => {
      try {
        console.log(`Récupération des articles de l'auteur: ${author}...`)
        // Essayer d'abord d'utiliser l'API dédiée si elle existe
        try {
          const response = await apiService.getPostsByAuthor(author)
          return response
        } catch (apiError) {
          console.log("API dédiée non disponible, filtrage côté client...")
          // Fallback: récupérer tous les articles et filtrer côté client
          const posts = await apiService.getAllBlogPosts()

          // Filtrer les articles qui sont écrits par l'auteur spécifié
          return posts.filter((post) => post.author && post.author.toLowerCase() === author.toLowerCase())
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des articles par auteur (${author}):`, error)
        return [] // Retourner un tableau vide au lieu de lancer une erreur
      }
    },

    getAuthorInfo: async (author: string) => {
      try {
        console.log(`Récupération des informations de l'auteur: ${author}...`)
        // Essayer d'abord d'utiliser l'API dédiée si elle existe
        try {
          const response = await apiService.getAuthorInfo(author)
          return response
        } catch (apiError) {
          console.log("API dédiée non disponible, utilisation de données simulées...")
          // Fallback: simuler une réponse
          return {
            name: author,
            avatar: "/placeholder.svg?height=100&width=100",
            bio: "Experte en horticulture et passionnée de plantes d'intérieur. Partage ses connaissances et astuces pour aider chacun à créer son propre coin de verdure.",
            specialties: ["Plantes d'intérieur", "Orchidées", "Jardinage urbain"],
          }
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des informations de l'auteur (${author}):`, error)
        // Retourner des données par défaut au lieu de lancer une erreur
        return {
          name: author,
          avatar: "/placeholder.svg?height=100&width=100",
          bio: "Experte en horticulture et passionnée de plantes d'intérieur.",
          specialties: ["Plantes d'intérieur"],
        }
      }
    },
    // Nouvelle fonction pour récupérer des articles aléatoires
    getRandomPosts: async (limit: number) => {
      try {
        const response = await apiService.getRandomBlogPosts(limit)
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des articles aléatoires:", error)
        return []
      }
    },
  },
  testimonials: {
    getAll: async () => {
      try {
        const response = await apiService.getAllTestimonials()
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages:", error)
        return []
      }
    },

    getFeatured: async () => {
      try {
        const response = await apiService.getFeaturedTestimonials()
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages mis en avant:", error)
        return []
      }
    },

    addTestimonial: async (data: any) => {
      return await apiService.addTestimonial(data)
    },

    updateTestimonial: async (id: number, data: any) => {
      return await apiService.updateTestimonial(id, data)
    },

    deleteTestimonial: async (id: number) => {
      return await apiService.deleteTestimonial(id)
    },

    toggleFeatured: async (id: number) => {
      return await apiService.toggleTestimonialFeatured(id)
    },
  },
  // Ajouter ces nouvelles sections à votre fichier API existant
  siteContent: {
    getAllContents: async () => {
      try {
        const response = await apiService.getAllSiteContents()
        return response
      } catch (error) {
        console.error("Erreur lors de la récupération des contenus du site:", error)
        return {}
      }
    },

    getContentByKey: async (key: string) => {
      try {
        const response = await apiService.getSiteContentByKey(key)
        return response
      } catch (error) {
        console.error(`Erreur lors de la récupération du contenu "${key}":`, error)
        return null
      }
    },

    updateContent: async (key: string, value: string) => {
      return await apiService.updateSiteContent(key, value)
    },

    deleteContent: async (key: string) => {
      return await apiService.deleteSiteContent(key)
    },
  },
}

// Fonctions individuelles pour la compatibilité avec les imports nommés
export const annulerReservation = async (id: number) => {
  return await apiService.cancelReservation(id)
}

export default API

