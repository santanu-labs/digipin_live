import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Developer dashboard",
};

export default function DashboardPage() {
  return (
    <main className="section">
      <p className="kicker">Developer provisioning</p>
      <h1>API keys</h1>
      <p className="lede">
        Sign in with a one-time email link. Production keys are hashed at rest and shown in
        plaintext exactly once.
      </p>
      <Dashboard />
    </main>
  );
}
