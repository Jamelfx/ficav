"use client";

import { Navigation } from "@/components/ficav/Navigation";
import { Footer } from "@/components/ficav/Footer";
import { HeroSection } from "@/components/ficav/HeroSection";
import { StatsCounter } from "@/components/ficav/StatsCounter";
import { FilmsCarousel } from "@/components/ficav/FilmsCarousel";
import { NewsFeed } from "@/components/ficav/NewsFeed";
import { AssociationsPreview } from "@/components/ficav/AssociationsPreview";
import { UpcomingEvents } from "@/components/ficav/UpcomingEvents";
import { PresidentMessage } from "@/components/ficav/PresidentMessage";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-cinema">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Statistics Counters */}
        <StatsCounter />
        
        {/* Films Carousel */}
        <FilmsCarousel />
        
        {/* News Feed */}
        <NewsFeed />
        
        {/* Associations Preview */}
        <AssociationsPreview />
        
        {/* Upcoming Events */}
        <UpcomingEvents />
        
        {/* President's Message */}
        <PresidentMessage />
      </main>
      
      <Footer />
    </div>
  );
}
