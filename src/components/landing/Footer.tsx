"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Venues", href: "/venues" },
      { label: "Groups", href: "/groups" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: <Twitter className="h-4 w-4" />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Github className="h-4 w-4" />, href: "https://github.com", label: "GitHub" },
  { icon: <Instagram className="h-4 w-4" />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Linkedin className="h-4 w-4" />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <Mail className="h-4 w-4" />, href: "mailto:info@buzzvar.com", label: "Email" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12 md:py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants}>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-2xl font-bold text-primary">BUZZVAR</Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Discover the perfect venues for your social gatherings.
                Find, book, and enjoy the best places in town.
              </p>
              
              <div className="flex items-center space-x-3 mt-2">
                {socialLinks.map((link, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    asChild
                  >
                    <Link href={link.href} aria-label={link.label}>
                      {link.icon}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {footerLinks.map((group, i) => (
            <motion.div key={i} variants={itemVariants}>
              <h3 className="text-sm font-semibold mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        
        <Separator className="my-8" />
        
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Buzzvar. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <ModeToggle />
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 