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