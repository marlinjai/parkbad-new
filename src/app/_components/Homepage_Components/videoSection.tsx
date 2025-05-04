"use client";

import { useEffect, useRef, useState } from "react";
import SvgOverlays from "./SvgOverlays";
import Image from "next/image";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };
    
    // Initial check
    const mobile = checkMobile();
    
    // Add listener for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle video loading and optimization
  useEffect(() => {
    // Create an intersection observer to detect when video is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when at least 10% of the video is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Effect for delayed video show after loading
  useEffect(() => {
    if (isVideoLoaded) {
      // Show video after 2.5 seconds delay
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [isVideoLoaded]);

  // Handle video loading when in view
  useEffect(() => {
    if (isInView && videoRef.current && !isVideoLoaded) {
      // Create and add source elements based on device type
      const videoElement = videoRef.current;
      
      // Create a function to set up the sources
      const setupVideoSources = () => {
        // Clear any existing sources
        while (videoElement.firstChild) {
          videoElement.removeChild(videoElement.firstChild);
        }
        
        // Create and add source elements
        const sources = [
          // WebM - better compression, modern browsers
          {
            src: isMobile 
              ? "/videos/header-480p.webm" 
              : "/Header_BG_II_big_webm_bigger.mp4", // Fallback to existing video
            type: "video/webm"
          },
          // MP4 - universal fallback
          {
            src: isMobile 
              ? "/videos/header-480p.mp4" 
              : "/Header_BG_II_big_webm_bigger.mp4",
            type: "video/mp4"
          }
        ];
        
        sources.forEach(source => {
          const sourceElement = document.createElement("source");
          sourceElement.src = source.src;
          sourceElement.type = source.type;
          videoElement.appendChild(sourceElement);
        });
        
        // Attempt to load the video
        videoElement.load();
      };
      
      // Set up sources
      setupVideoSources();
      
      // Listen for when the video has loaded enough to play
      const handleCanPlay = () => {
        // Mark video as loaded but don't show it yet (controlled by separate effect)
        setIsVideoLoaded(true);
        videoElement.play().catch(e => console.log("Auto-play prevented:", e));
      };
      
      videoElement.addEventListener('canplay', handleCanPlay);
      
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isInView, isVideoLoaded, isMobile]);

  return (
    <div className="video-BG relative flex min-h-vidbg flex-col content-center justify-between">
      {/* Optimized static image placeholder (LCP candidate) */}
      <Image
        src="/video-bg.webp"
        alt=""
        fill
        priority
        quality={85}
        className={`object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
        sizes="100vw"
        aria-hidden="true"
        style={{ zIndex: 1 }}
      />
      
      {/* Video background with optimized loading */}
      <video
        ref={videoRef}
        className={`left-0 top-0 max-h-vh90 md:max-h-vh100 min-h-vidbg w-vw100 object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        muted
        loop
        preload="none" // Don't preload until we're ready
        poster="/video-bg.webp"
        aria-hidden="true"
      />

      {/* SVG Overlay */}
      <div className="flex justify-center " style={{ zIndex: 2 }}>
        <SvgOverlays />
      </div>
    </div>
  );
}
