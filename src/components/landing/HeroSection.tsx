"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/60 z-10" />
      
      <div className="container relative z-20 flex flex-col-reverse lg:flex-row items-center pt-20 pb-16 md:py-32 gap-8">
        {/* Text content */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-4 mb-8">
            <Link 
              href="#features" 
              className={badgeVariants({ variant: "outline" })}
            >
              New Feature: Group Bookings
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover the perfect <br />
              <span className="text-primary">social venues</span> in town
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Find, book, and enjoy the best bars, restaurants, and event spaces
              with friends. All in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" asChild>
              <Link href="/venues">Explore Venues</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/api/auth/signup">Create Account</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              <span className="font-medium">2,000+</span> happy users
            </div>
          </div>
        </motion.div>

        {/* Animated object with Framer Motion and Tailwind */}
        <motion.div
          className="w-full lg:w-1/2 aspect-square max-w-[500px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/10" 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute inset-8 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.div 
              className="absolute inset-16 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            <motion.div 
              className="absolute w-1/2 h-1/2 rounded-full bg-primary/40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-primary/5 pointer-events-none" />
    </section>
  );
} 