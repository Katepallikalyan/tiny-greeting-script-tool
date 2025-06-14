import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

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

  // Clear messages on mode or role change
  useEffect(() => setMessage(null), [mode, role]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        // LOGIN with email & password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage(error.message || "Login failed.");
          toast({
            title: "Login error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setMessage(`Welcome back, logged in as ${role.toUpperCase()}!`);
          toast({
            title: "Logged in!",
            description: "You are now signed in.",
          });
          // Force page reload so authenticated content is displayed
          window.location.reload();
        }
      } else {
        // SIGNUP with email & password and attach "role"
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
            emailRedirectTo: `${window.location.origin}/FARMBRIDGE`
          },
        });
        if (error) {
          setMessage(error.message || "Sign up failed.");
          toast({
            title: "Signup error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setMessage(
            `Check your email to confirm your registration as ${role.toUpperCase()}.`
          );
          toast({
            title: "Sign up successful",
            description:
              "Please check your inbox and confirm your email to activate your account.",
          });
        }
      }
    } catch (err: any) {
      setMessage("Unexpected error. Try again.");
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <form className="space-y-4" onSubmit={handleAuth}>
        <Input
          type="email"
          autoComplete="username"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="Password"
          minLength={6}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
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
          disabled={loading}
          type="button"
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
