"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Star, Clock, PlusCircle } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample venues data (in a real app, this would come from an API)
const venues = [
  {
    id: "1",
    name: "The Golden Lounge",
    type: "Bar & Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1074&auto=format&fit=crop",
    rating: 4.7,
    location: "Downtown",
    description: "Elegant cocktail bar with live jazz music and premium drinks.",
    openNow: true
  },
  {
    id: "2",
    name: "Skyline Terrace",
    type: "Rooftop Bar",
    imageUrl: "https://images.unsplash.com/photo-1517505962134-53a8b6e4b543?q=80&w=987&auto=format&fit=crop",
    rating: 4.5,
    location: "Central District",
    description: "Panoramic city views with craft cocktails and small plates.",
    openNow: true
  },
  {
    id: "3",
    name: "Vintage Cellar",
    type: "Wine Bar",
    imageUrl: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=1030&auto=format&fit=crop",
    rating: 4.8,
    location: "Old Town",
    description: "Cozy wine cellar with an extensive selection of international wines.",
    openNow: false
  },
  {
    id: "4",
    name: "Urban Brewhouse",
    type: "Brewery & Pub",
    imageUrl: "https://images.unsplash.com/photo-1555658636-6e4a36218be7?q=80&w=1170&auto=format&fit=crop",
    rating: 4.6,
    location: "Arts District",
    description: "Local craft beers and casual dining in an industrial setting.",
    openNow: true
  },
  {
    id: "5",
    name: "The Secret Garden",
    type: "Cocktail Bar",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1169&auto=format&fit=crop",
    rating: 4.9,
    location: "Riverside",
    description: "Hidden garden-themed bar with innovative botanical cocktails.",
    openNow: false
  },
];

export function VenueShowcaseSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  return (
    <section ref={sectionRef} className="py-20">
      <div className="container">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trending <span className="text-primary">Venues</span>
            </h2>
            <p className="text-muted-foreground">
              Explore the most popular venues in your area, handpicked for the best experiences.
            </p>
          </div>
          <Button asChild>
            <Link href="/venues">View All Venues</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {venues.map((venue) => (
                  <CarouselItem key={venue.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden border border-border/50 hover:border-primary/30 transition-all">
                      <div className="relative h-[220px] w-full overflow-hidden">
                        <Image
                          src={venue.imageUrl}
                          alt={venue.name}
                          fill
                          className="object-cover transition-transform hover:scale-105 duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={venue.id === "1"}
                          quality={85}
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <Badge variant={venue.openNow ? "default" : "outline"} className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {venue.openNow ? "Open Now" : "Closed"}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm text-sm px-2 py-1 rounded-md">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{venue.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg leading-tight">{venue.name}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Badge variant="secondary" className="font-normal">{venue.type}</Badge>
                            <span>•</span>
                            <span>{venue.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {venue.description}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between w-full">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/venues/${venue.id}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-full">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Custom navigation controls positioned at the bottom right */}
              <div className="flex justify-end gap-2 mt-6">
                <CarouselPrevious 
                  variant="outline" 
                  size="icon" 
                  className="static h-8 w-8 rounded-full transform-none translate-y-0 translate-x-0"
                />
                <CarouselNext 
                  variant="outline" 
                  size="icon" 
                  className="static h-8 w-8 rounded-full transform-none translate-y-0 translate-x-0"
                />
              </div>
            </Carousel>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 