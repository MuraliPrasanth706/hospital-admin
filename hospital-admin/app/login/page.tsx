"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { loginWithEmail } from "@/src/services/auth.service";
import { DEMO_ACCOUNTS } from "@/src/data/mock";
import { extractApiError } from "@/src/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithEmail({ email, password });
      setAuth(res.token, res.role, res.clinic_id);
      router.replace("/dashboard");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-8">
      <div className="flex w-full max-w-4xl min-h-[580px]">
        {/* Left blue panel */}
        <div className="w-[52%] bg-[#2563EB] flex flex-col justify-between p-10 text-white rounded-[2rem] rounded-r-[3.5rem]">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <polyline
                    points="3,12 6,12 8,6 11,18 13,9 15,14 17,12 21,12"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">QueueCare</span>
            </div>

            {/* Tagline */}
            <h1 className="text-3xl font-bold leading-tight mb-4">
              Run your clinic&apos;s queue
              <br />
              with calm precision.
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Real-time patient flow, doctor management, and instant
              <br />
              ETAs — built for India&apos;s busiest hospitals.
            </p>

            {/* Features */}
            <ul className="space-y-2.5 text-sm text-white">
              {[
                "Live queue visibility",
                "Hospital-scoped data",
                "Sub-minute actions",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-blue-200 text-xs">© 2026 QueueCare Health</p>
        </div>

        {/* Right white panel */}
        <div className="flex-1 bg-white flex flex-col justify-center px-12 py-10 -ml-8 rounded-[2rem] shadow-xl z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Sign in to your hospital
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            You&apos;ll only see data for your own clinic.
          </p>

          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            {/* Phone */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-gray-800 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apollo.com"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-gray-800 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2z" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            </div>

            {/* API error */}
            {error && (
              <p role="alert" className="text-sm text-red-600 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium mb-3">
              Demo hospital accounts — click to autofill
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                  }}
                  className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 transition-colors font-mono py-0.5"
                >
                  <span className="text-gray-500">{acc.hospital}</span>
                  <span>{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 flex items-center justify-between px-8 py-2.5 bg-transparent">
        <span className="text-xs text-gray-400">
          QueueCare · Hospital Queue Management · Desktop UI
        </span>
        <span className="text-xs text-gray-400">Hospital Admin Login · 04</span>
      </div>
    </div>
  );
}
