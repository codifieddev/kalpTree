"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/hooks/slices/user/userSlice";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import { signIn, getSession } from "next-auth/react";

function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //   const res = await axios.post("/api/public/onboarding", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     bo,
      //   });
      const res = await fetch("/api/public/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: email,
          adminPassword: password,
          role: "superadmin",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/auth/signin");
      }

      //   dispatch(setUser(res.data.user));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-between border-r border-border">
        <div>
          <img
            src="/kalptree-white-logo.svg"
            alt="KalpTree"
            className="w-52 brightness-0 invert my-10"
          />

          <h2 className="text-4xl lg:text-[72px] font-bold text-primary-foreground leading-tight mb-6">
            Create <br />
            <span className="text-secondary">Super Admin</span>
          </h2>

          <p className="text-primary-foreground/80 text-lg max-w-md">
            Securely bootstrap your platform with a super admin account.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm font-medium text-primary-foreground/70">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            Full Access
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-secondary" />
            Multi-Tenant Ready
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground font-medium">
              This account will be created as <strong>Super Admin</strong>.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input/50 border rounded-xl pl-10 py-3"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input/50 border rounded-xl pl-10 pr-12 py-3"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center gap-2"
            >
              {loading ? "Creating..." : "Create Super Admin"}
              {!loading && <ArrowRight />}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-bold text-primary hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
