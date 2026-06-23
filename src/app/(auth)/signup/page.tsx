import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: "bg-zinc-100 text-black hover:bg-zinc-200",
            card: "bg-black border border-zinc-800 shadow-none",
            headerTitle: "text-zinc-100",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border-zinc-800 text-zinc-300 hover:bg-zinc-900",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-500",
            footerActionLink: "text-zinc-300 hover:text-zinc-100",
            footer: "hidden",
          },
        } as any}
      />
    </div>
  );
}
