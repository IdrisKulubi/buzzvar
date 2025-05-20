import { auth } from "@/auth";
import { LoginCard } from "@/components/shared/auth/login-card";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background flex items-center justify-center px-4">
      <LoginCard />
    </div>
  );
}
