"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, PartyPopper, ChevronRight } from "lucide-react";

export function LoginCard() {
  return (
    <div className="relative w-full max-w-md">
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ 
          delay: 0.5, 
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-10 right-10 text-primary/20 select-none"
      >
        <PartyPopper size={54} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ 
          delay: 0.8, 
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -bottom-16 right-20 text-primary/20 select-none"
      >
        <Sparkles size={48} />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-card/80 backdrop-blur-xl rounded-xl p-8 shadow-lg border border-primary/20"
      >
        <div className="space-y-6">
          {/* Logo and Title */}
          <div className="text-center space-y-3">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                type: "spring", 
                stiffness: 200
              }}
            >
              <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full border border-primary/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.1, 0.5, 0.1], 
                    scale: [0.8, 1.1, 0.8] 
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                />
                <span className="text-primary text-4xl">
                  B
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              BUZZVAR
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Discover and enjoy the perfect venues
            </motion.p>
          </div>

          {/* Sign in form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signIn("google", { callbackUrl: "/" });
              }}
              className="space-y-4"
            >
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg group" 
                size="lg"
              >
                <svg
                  className="mr-3 h-5 w-5"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
                <ChevronRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-primary/30 hover:bg-primary/5 hover:text-primary text-muted-foreground group"
                size="lg"
              >
                <span>Continue as guest</span>
                <ChevronRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p>By continuing, you agree to our</p>
            <p className="space-x-1">
              <span className="text-primary hover:underline cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span>and</span>
              <span className="text-primary hover:underline cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
