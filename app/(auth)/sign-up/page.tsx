"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUp } from "@/lib/auth/auth_client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { getStrengthBars, getStrengthText, validateForm } from "@/lib/helper";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setPasswordChecks(checks);

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const strength = (passedChecks / totalChecks) * 100;
    setPasswordStrength(strength);
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm(name, email, password, confirmPassword, setError)) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message ?? "Failed to sign up. Please try again.",
        );
      } else {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strengthBars = getStrengthBars(password, passwordStrength);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-r from-background via-accent/5 to-background p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join thousands of professionals tracking their dream jobs
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Haftamu Desta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            {error && <p>{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="haftamu@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 border-border/50 focus:border-primary focus:ring-primary/20"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium mb-6">
                    Password Strength
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      passwordStrength === 0 && "text-muted-foreground",
                      passwordStrength > 0 &&
                        passwordStrength < 40 &&
                        "text-red-500",
                      passwordStrength >= 40 &&
                        passwordStrength < 70 &&
                        "text-yellow-500",
                      passwordStrength >= 70 && "text-green-500",
                    )}
                  >
                    {getStrengthText(password, passwordStrength)}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {strengthBars.map((bar, index) => (
                    <div key={index} className="relative flex-1">
                      <div
                        className={cn(
                          "h-2 w-full rounded-full transition-all duration-300",
                          bar.color,
                        )}
                      />
                      {bar.active && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                          {bar.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span
                    className={cn(
                      strengthBars[0].active && "font-medium text-red-600",
                    )}
                  >
                    Too Short
                  </span>
                  <span
                    className={cn(
                      strengthBars[1].active && "font-medium text-orange-600",
                    )}
                  >
                    Weak
                  </span>
                  <span
                    className={cn(
                      strengthBars[2].active && "font-medium text-yellow-600",
                    )}
                  >
                    Fair
                  </span>
                  <span
                    className={cn(
                      strengthBars[3].active && "font-medium text-green-600",
                    )}
                  >
                    Strong
                  </span>
                  <span
                    className={cn(
                      strengthBars[4].active && "font-medium text-emerald-600",
                    )}
                  >
                    Very Strong
                  </span>
                </div>
              </div>

              {password.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: "length",
                        text: "8+ characters",
                        met: passwordChecks.length,
                      },
                      {
                        key: "uppercase",
                        text: "One uppercase",
                        met: passwordChecks.uppercase,
                      },
                      {
                        key: "lowercase",
                        text: "One lowercase",
                        met: passwordChecks.lowercase,
                      },
                      {
                        key: "number",
                        text: "One number",
                        met: passwordChecks.number,
                      },
                      {
                        key: "special",
                        text: "One special char",
                        met: passwordChecks.special,
                      },
                    ].map((req) => (
                      <div key={req.key} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full",
                            req.met
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          {req.met ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs",
                            req.met
                              ? "text-green-600 font-medium"
                              : "text-gray-500",
                          )}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={cn(
                  "border-border/50 focus:border-primary focus:ring-primary/20",
                  confirmPassword &&
                    password !== confirmPassword &&
                    "border-destructive focus:border-destructive",
                )}
                placeholder="Re-enter your password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Passwords do not match
                </p>
              )}
              {confirmPassword &&
                password === confirmPassword &&
                password.length >= 8 && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Passwords match
                  </p>
                )}
            </div>

            <div className="rounded-lg border border-border/50 bg-accent/20 p-4">
              <p className="text-sm text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-medium text-primary hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-primary hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
