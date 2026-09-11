"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Mon Stage Lean
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {mode === "login" ? "Connexion" : "Inscription"}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Formation en ligne au Lean Management
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Nom d&apos;utilisateur
          <input
            name="username"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            autoComplete="username"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mot de passe
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>
        {mode === "register" && (
          <label className="block text-sm font-medium text-slate-700">
            Confirmer le mot de passe
            <input
              type="password"
              name="confirm"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              autoComplete="new-password"
            />
          </label>
        )}

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-emerald-700 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending
            ? "Patientez..."
            : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-emerald-700">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-emerald-700">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
