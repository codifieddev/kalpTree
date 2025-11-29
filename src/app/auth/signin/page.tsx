"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

function SignInForm() {
  const dispatch= useDispatch<AppDispatch>()
  const search = useSearchParams();
  const initialTenant = search?.get("tenant") || "demo";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState(initialTenant);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
   await signIn("credentials", {
        redirect: true,
        callbackUrl: "/admin",
        email,
        password,
        tenantSlug,
      });
     
  
      // With redirect: true, signIn returns void; errors will navigate to the error page.
      // We keep this note for future non-redirect flows.
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <label className="block mb-2 text-sm">Tenant Slug</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={tenantSlug}
          onChange={(e) => setTenantSlug(e.target.value)}
          placeholder="tenant slug (e.g., demo)"
        />
        <label className="block mb-2 text-sm">Email</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <label className="block mb-2 text-sm">Password</label>
        <input
          className="w-full border rounded px-3 py-2 mb-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
