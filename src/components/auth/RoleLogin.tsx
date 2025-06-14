
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roles = [
  { label: "Farmer", value: "farmer" },
  { label: "Merchant", value: "merchant" },
  { label: "Admin", value: "admin" },
];

const RoleLogin = () => {
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Placeholder: Replace with Supabase auth calls!
      setTimeout(() => {
        setLoading(false);
        setMessage(
          mode === "login"
            ? `Logged in as ${role.toUpperCase()} (fake, wire up real Supabase auth next!)`
            : `Account created for ${role.toUpperCase()} (fake, wire up real Supabase signup next!)`
        );
      }, 800);
    } catch (err: any) {
      setLoading(false);
      setMessage("Something went wrong...");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-2">
        {roles.map((r) => (
          <Button
            key={r.value}
            variant={role === r.value ? "default" : "outline"}
            size="sm"
            onClick={() => setRole(r.value)}
            className={role === r.value ? "ring-2 ring-primary" : ""}
            type="button"
          >
            {r.label}
          </Button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={submitAuth}>
        <Input
          type="email"
          autoComplete="username"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="Password"
          minLength={6}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button className="w-full" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Signing up..."
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </Button>
      </form>
      <div className="text-sm flex items-center justify-between mt-2">
        <span>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <button
          className="text-blue-600 hover:underline px-1"
          onClick={() =>
            setMode((m) => (m === "login" ? "signup" : "login"))
          }
        >
          {mode === "login" ? "Sign up" : "Login"}
        </button>
      </div>
      {message && (
        <div className="mt-4 text-center text-base text-foreground font-medium animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};

export default RoleLogin;
