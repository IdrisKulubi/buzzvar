"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/spotlight";
import { RainbowButton } from "../magicui/rainbow-button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black/[0.96] ">
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />
      
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      
      <div className="container relative z-20 flex flex-col items-center pt-20 pb-16 md:py-32">
        {/* Text content */}
        <motion.div 
          className="flex-1 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-4 mb-8">
            <Link 
              href="#features" 
              className={badgeVariants({ variant: "outline", className: "bg-white/10 text-white dark:bg-black/10 dark:text-white" })}
            >
              New Feature: Group Bookings
            </Link>
            <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent">
              Discover the perfect <br />
              <span className="text-primary">social venues</span> in town
            </h1>
            <p className="text-lg text-neutral-300 max-w-[600px] mx-auto">
              Find, book, and enjoy the best bars, restaurants, and event spaces
              with friends. All in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RainbowButton size="lg" variant="outline" asChild className="border-white/20 text-black dark:text-white hover:bg-white/10">
              <Link href="/venues">Explore Venues</Link>
            </RainbowButton>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-black dark:text-white hover:bg-white/10">
              <Link href="/api/auth/signup">Create Account</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-neutral-300">
              <span className="font-medium">2,000+</span> happy users
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}