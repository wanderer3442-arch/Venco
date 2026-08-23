import Header from "@/components/Header";
import RegisterForm from "@/components/RegisterForm";
import ChatV from "@/components/ChatV";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md w-full px-6 py-10">
        <div className="rounded-2xl bg-paper border p-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-foreground/60">Email + password stored bcrypt-hashed.</p>
          <RegisterForm />
        </div>
      </main>
      <ChatV />
    </>
  );
}
