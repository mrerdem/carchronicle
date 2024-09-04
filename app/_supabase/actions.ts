import { createClient } from "@/app/_supabase/client";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const response = await supabase.auth.signInWithPassword(data);

  return response;
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const response = await supabase.auth.signUp(data);

  return response;
}

export async function signout() {
  const supabase = createClient();

  const response = await supabase.auth.signOut();

  return response;
}

export async function verifyLogin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return true;
  }
  return false;
}
