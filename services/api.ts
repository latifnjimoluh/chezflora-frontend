import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


// Fonction pour la connexion
export const loginUser = async (identifier: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, {
      identifier,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la connexion", error);
    throw error.response?.data || { message: "Identifiants incorrects." };
  }
};

// Fonction pour l'inscription
export const registerUser = async (userData: { first_name: string; last_name: string; email: string; phone: string; password: string }): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'inscription", error);
    throw error.response?.data || { message: "Erreur lors de l'inscription." };
  }
};

// Fonction pour vérifier le code OTP
export const verifyOTP = async (email: string, otp_code: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp_code });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la vérification de l'OTP", error);
    throw error.response?.data || { message: "Code OTP incorrect." };
  }
};

// Fonction pour renvoyer un nouveau code OTP
export const resendOTP = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/resend-otp`, { email });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du nouvel OTP", error);
    throw error.response?.data || { message: "Impossible d'envoyer un nouveau code OTP." };
  }
};

// Fonction pour la réinitialisation du mot de passe (Forgot Password)
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la demande de réinitialisation du mot de passe", error);
    throw error.response?.data || { message: "Impossible de traiter votre demande." };
  }
};

// Fonction pour soumettre le nouveau mot de passe
export const resetPassword = async (resetToken: string, newPassword: string): Promise<any> => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/reset-password`, { resetToken, newPassword });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la réinitialisation du mot de passe", error);
    throw error.response?.data || { message: "Impossible de réinitialiser le mot de passe." };
  }
};


// 🔹 Récupérer les informations de l'utilisateur connecté
export const getUserProfile = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil utilisateur", error);
    throw error.response?.data || { message: "Impossible de récupérer les informations utilisateur." };
  }
};

// 🔹 Modifier les informations générales (Nom, Prénom, Téléphone)
export const updateUserProfile = async (profileData: any): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/api/user/update-profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil", error);
    throw error.response?.data || { message: "Impossible de mettre à jour le profil." };
  }
};

// 🔹 Demande de changement d'email (Envoi d'un OTP)
export const requestEmailChange = async (new_email: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/api/user/request-email-change`, { new_email }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la demande de changement d'email", error);
    throw error.response?.data || { message: "Impossible de demander le changement d'email." };
  }
};

// 🔹 Confirmer le changement d'email avec OTP
export const confirmEmailChange = async (new_email: string, otp_code: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/api/user/confirm-email-change`, { new_email, otp_code }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la confirmation du changement d'email", error);
    throw error.response?.data || { message: "Impossible de confirmer le changement d'email." };
  }
};

// 🔹 Modifier le mot de passe
export const updatePassword = async (current_password: string, new_password: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/api/user/update-password`, { current_password, new_password }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du mot de passe", error);
    throw error.response?.data || { message: "Impossible de mettre à jour le mot de passe." };
  }
};

// 🔹 Mettre à jour l'image de profil
export const updateProfileImage = async (imageFile: File): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(`${apiUrl}/api/user/update-profile-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'image de profil", error);
    throw error.response?.data || { message: "Impossible de mettre à jour l'image." };
  }
};

// 🔹 Demander la suppression du compte (envoi d'un OTP)
export const requestAccountDeletion = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/api/user/request-delete-account`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la demande de suppression du compte", error);
    throw error.response?.data || { message: "Impossible de demander la suppression du compte." };
  }
};

// Fonction pour confirmer la suppression du compte avec OTP
export const confirmAccountDeletion = async (otp_code: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token"); // Récupérer le token
    if (!token) {
      throw { message: "Utilisateur non authentifié. Veuillez vous reconnecter." };
    }

    const response = await axios.post(
      `${apiUrl}/api/user/confirm-delete-account`,
      { otp_code },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔹 Ajouter le token dans l'en-tête
        },
      }
    );

    // Supprimer le token du localStorage après la suppression du compte
    localStorage.removeItem("token");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la confirmation de la suppression du compte", error);
    throw error.response?.data || { message: "Code OTP incorrect ou expiré." };
  }
};

// Fonction pour récupérer tous les produits
export const getAllProducts = async (): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/api/products/get-all-product`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits", error);
    throw error.response?.data || { message: "Erreur lors de la récupération des produits." };
  }
};

// Fonction pour récupérer un produit spécifique par ID
export const getProductById = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/api/products/get-product/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit", error);
    throw error.response?.data || { message: "Produit non trouvé." };
  }
};

// Fonction pour vérifier le stock d'un produit
export const checkProductStock = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/api/products/check-stock/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la vérification du stock", error);
    throw error.response?.data || { message: "Erreur lors de la vérification du stock." };
  }
};

// 🔹 Ajouter un produit au panier
export const addToCart = async (id_produit: number, quantite: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${apiUrl}/api/panier/ajouter-panier`,
      { id_produit, quantite },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'ajout au panier", error);
    throw error.response?.data || { message: "Impossible d'ajouter le produit au panier." };
  }
};

// 🔹 Récupérer le panier de l'utilisateur

export const getCart = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/api/panier/mon-panier`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { panier, id_panier } = response.data;

    if (id_panier) {
      localStorage.setItem("id_panier", id_panier);
      console.log(" ID du panier stocké dans localStorage :", id_panier);
    }

    return panier;
  } catch (error: any) {
    console.error(" Erreur lors de la récupération du panier", error);
    throw error.response?.data || { message: "Impossible de récupérer le panier." };
  }
};

// 🔹 Supprimer un produit du panier
export const removeFromCart = async (id_produit: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/api/panier/supprimer-panier`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id_produit },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression du produit du panier", error);
    throw error.response?.data || { message: "Impossible de supprimer le produit du panier." };
  }
};

// 🔹 Valider et vider le panier
export const validateCart = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const id_panier = localStorage.getItem("id_panier"); // Récupérer l'ID du panier

    if (!id_panier) {
      throw new Error(" Aucun ID de panier trouvé !");
    }

    console.log(`Tentative de suppression du panier ID: ${id_panier}`);

    // 🔹 Utilisation de POST au lieu de DELETE
    const response = await axios.post(`${apiUrl}/api/panier/valider-panier`, 
      { id_panier }, // Envoyer id_panier dans le body
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Panier validé avec succès, suppression du localStorage !");
    localStorage.removeItem("id_panier"); // Supprimer l'ID du panier du localStorage

    return response.data;
  } catch (error: any) {
    console.error(" Erreur lors de la validation du panier", error);
    throw error.response?.data || { message: "Impossible de valider le panier." };
  }
};

// 🔹 Réduire la quantité d'un produit dans le panier
export const decrementQuantity = async (id_produit: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${apiUrl}/api/panier/reduire-quantite-panier`,
      { id_produit },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du panier", error);
    throw error.response?.data || { message: "Impossible de modifier la quantité du produit." };
  }
};

// Fonction pour passer une commande complète
export const passerCommande = async (commandeData: {
  produits: Array<{ id_produit: string; quantite: number }>
  adresse_livraison: string
  ville: string
  code_postal: string
  telephone: string
  email: string
  mode_livraison: string
  mode_paiement: string
  message?: string
}): Promise<any> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${apiUrl}/api/commandes/passer-commande`, commandeData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la création de la commande", error)
    throw error.response?.data || { message: "Impossible de créer la commande." }
  }
}

export const annulerCommande = async (id_commande: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");

    console.log(`Envoi de la requête d'annulation pour la commande ID: ${id_commande}`);

    const response = await axios.put(
      `${apiUrl}/api/commandes/annuler-commande`,
      { id_commande },  // Envoi de l'ID de la commande dans le body
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("Commande annulée avec succès :", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" Erreur lors de l'annulation de la commande :", error);
    throw error.response?.data || { message: "Impossible d'annuler la commande." };
  }
};

// Fonction pour récupérer toutes les commandes de l'utilisateur
export const getMesCommandes = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${apiUrl}/api/commandes/mes-commandes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des commandes", error)
    throw error.response?.data || { message: "Impossible de récupérer vos commandes." }
  }
}

// Fonction pour récupérer les détails d'une commande
export const getCommandeDetails = async (id_commande: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token")

    console.log(`Récupération des détails de la commande : ${id_commande}`)

    const response = await axios.get(`${apiUrl}/api/commandes/commande/${id_commande}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log(" Commande récupérée :", response.data)

    // Vérifier si les produits sont présents
    if (response.data.commande && response.data.commande.produits) {
      console.log(` Nombre de produits: ${response.data.commande.produits.length}`)
    } else {
      console.warn(" Aucun produit trouvé dans la réponse")
    }

    return response.data
  } catch (error: any) {
    console.error(" Erreur lors de la récupération des détails de la commande :", error)
    throw error.response?.data || { message: "Impossible de récupérer les détails de la commande." }
  }
}

// Fonction pour récupérer les commandes par statut
export const getMesCommandesParStatut = async (statut: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${apiUrl}/api/commandes/statut/${statut}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    console.error("Erreur lors de la récupération des commandes par statut", error)
    throw error.response?.data || { message: "Impossible de récupérer vos commandes." }
  }
}







// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Fonction pour déconnecter l'utilisateur
export const logoutUser = (): void => {
  localStorage.removeItem("token");
};

export default {
  loginUser,
  registerUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateUserProfile,
  requestEmailChange,
  confirmEmailChange,
  updatePassword,
  updateProfileImage,
  requestAccountDeletion,
  confirmAccountDeletion,
  isAuthenticated,
  logoutUser
};