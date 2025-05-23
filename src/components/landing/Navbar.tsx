"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MenuIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md dark:border-neutral-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/logo/buzzvarlogo.png"
              alt="Buzzvar Logo"
              className="h-32 w-32 "
              width={84}
              height={84}
            />
          </Link>
        </motion.div>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/venues" className={navigationMenuTriggerStyle()}>
                  Venues
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="dark:text-neutral-200">Features</NavigationMenuTrigger>
              <NavigationMenuContent className="dark:bg-neutral-900 dark:border-neutral-800">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-primary/10 p-6 no-underline outline-none focus:shadow-md dark:bg-primary/20"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-primary">Buzzvar</div>
                        <p className="text-sm leading-tight text-muted-foreground dark:text-neutral-300">
                          Discover the perfect venues for your social gatherings
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/venues"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      >
                        <div className="text-sm font-medium leading-none dark:text-neutral-200">Find Venues</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-neutral-400">Browse venues in your area.</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/groups"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      >
                        <div className="text-sm font-medium leading-none dark:text-neutral-200">Group Events</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-neutral-400">Join or create group events.</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/api/auth/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden dark:text-neutral-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden dark:bg-neutral-900" 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/"
                className="text-foreground hover:text-primary px-2 py-1.5 rounded-md dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/venues"
                className="text-foreground hover:text-primary px-2 py-1.5 rounded-md dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                Venues
              </Link>
              <Link 
                href="/parties"
                className="text-foreground hover:text-primary px-2 py-1.5 rounded-md dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                Group Events
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild>
                <Link href="/api/auth/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/api/auth/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}