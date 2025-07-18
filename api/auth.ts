import { showMessage } from "@/utils/formatNotification";
import { supabase } from "@/utils/supabase";

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    showMessage(error.message);
  } else if (data.session) {
    showMessage("Connexion réussie 🎉");
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  if (!session) {
    showMessage(
      "Veuillez vérifier votre boîte mail pour activer votre compte."
    );
  } else {
    showMessage("Inscription réussie 🎉");
  }
}

export function logout() {
  supabase.auth.signOut();
  showMessage("Déconnexion réussie");
}
