"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password are required"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password) {
    redirect("/signup?error=" + encodeURIComponent("Email and password are required"));
  }

  if (password.length < 6) {
    redirect("/signup?error=" + encodeURIComponent("Password must be at least 6 characters"));
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || email.split("@")[0] },
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  if (data.user?.identities?.length === 0) {
    redirect("/signup?error=" + encodeURIComponent("An account with this email already exists"));
  }

  if (data.user) {
    const name = displayName || email.split("@")[0];
    const { error: profileError } = await supabase.from("profiles").upsert(
      { id: data.user.id, display_name: name },
      { onConflict: "id" }
    );
    if (profileError) console.error("Failed to create profile:", profileError);
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect("/signup?success=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
