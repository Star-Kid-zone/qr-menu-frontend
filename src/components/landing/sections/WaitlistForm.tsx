"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { PiBellRingingBold, PiPaperPlaneTiltBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

interface WaitlistFormProps {
  className?: string;
  /** Use over dark/cinematic sections — swaps the card chrome for a white-on-transparent look. */
  dark?: boolean;
}

export function WaitlistForm({ className, dark = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    toast.success("You're on the list — we'll email you at launch.");
  };

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full flex-col gap-3 rounded-2xl border p-2 xs:flex-row",
          dark ? "border-white/15 bg-white/5 backdrop-blur-sm" : "border-border bg-card shadow-neu",
        )}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@restaurant.com"
          aria-label="Email address"
          data-cursor-hover
          className={cn(
            "h-12 w-full flex-1 rounded-xl border-0 bg-transparent px-4 text-sm font-medium outline-none",
            dark ? "text-white placeholder:text-white/40" : "text-foreground placeholder:text-muted-foreground",
          )}
        />
        <Button
          type="submit"
          size="lg"
          rightIcon={<PiPaperPlaneTiltBold size={18} />}
          className={cn("w-full xs:w-auto", dark && "bg-primary text-primary-foreground hover:bg-primary/90")}
        >
          Notify me
        </Button>
      </form>
      {submitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 text-caption font-semibold",
            dark ? "text-primary" : "text-success",
          )}
        >
          <PiBellRingingBold size={14} />
          You&apos;re on the list.
        </motion.p>
      )}
    </div>
  );
}
