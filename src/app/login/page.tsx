"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { BookOpen, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use NextAuth signIn with 'email' provider
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        alert("Failed to send login link. Please try again.");
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-paper-dark p-8 rounded-lg paper-shadow border border-ink/5"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <BookOpen className="w-12 h-12 text-accent mb-4" />
          <h1 className="font-caveat text-5xl text-ink font-bold mb-2">
            ReWind
          </h1>
          <p className="text-ink-light font-sans text-sm max-w-[250px]">
            A private space to remember the days that shaped us.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-memory-green/10 text-memory-green border border-memory-green/20 p-4 rounded-md text-center font-sans">
            <h3 className="font-bold mb-1">Check your inbox</h3>
            <p className="text-sm">
              We've sent a magic link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-medium text-ink mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@college.edu"
                required
                className="w-full px-4 py-3 bg-paper border border-ink/20 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-ink text-paper py-3 px-4 rounded-md hover:bg-ink-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-sans font-medium"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
