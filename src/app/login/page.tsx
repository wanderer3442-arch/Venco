import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import ChatV from "@/components/ChatV";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md w-full px-6 py-10">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Welcome back</h1>
          <p className="text-sm text-foreground/60">Gmail (Google) or email + password.</p>
          <LoginForm />
        </div>
      </main>
      <ChatV />
    </>
  );
}
