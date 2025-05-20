"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ChevronsUp, 
  ThumbsUp, 
  CreditCard,
  MapPinned
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const features = [
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Find Venues",
    description: "Discover the best venues in your area with detailed information, ratings, and photos."
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Book Events",
    description: "Reserve tables or entire venues for your events with real-time availability."
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Group Planning",
    description: "Create group events and coordinate with friends for seamless social gatherings."
  },
  {
    icon: <ThumbsUp className="h-10 w-10 text-primary" />,
    title: "Read Reviews",
    description: "See what others think about venues before you visit with verified user reviews."
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: "Special Offers",
    description: "Access exclusive deals and promotions from participating venues."
  },
  {
    icon: <MapPinned className="h-10 w-10 text-primary" />,
    title: "Interactive Maps",
    description: "Navigate easily with integrated maps showing venue locations and nearby attractions."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Everything you need for <span className="text-primary">perfect social outings</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Buzzvar simplifies the entire process of finding, booking, and enjoying venues with friends.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-primary/20 transition-all">
                <CardHeader>
                  <div className="mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border">
            <ChevronsUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">And many more features to explore</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 