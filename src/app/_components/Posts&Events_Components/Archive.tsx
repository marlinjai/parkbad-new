"use client";

import { urlForImage } from "../../../sanity/lib/sanity.image";
import { client } from "../../../sanity/lib/sanity.client";
import { PostType, CustomEvent } from "@/types/sanityTypes";
import { useEffect, useState, useMemo, useRef } from "react";
import { parseISO, compareAsc, compareDesc, format, isFuture, isPast } from "date-fns";
import Image from "next/image";
import Button from "../UtilityComponents/Button";
import renderDate from "../Homepage_Components/RenderDate";
import { PostorEventItem, EventDay } from "@/types/componentTypes";
import { de } from "date-fns/locale";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SectionBackground from "../UtilityComponents/SectionBackground";

const builder = urlForImage(client);

// Helper function to get the most relevant date from any item type
function getItemDate(item: any): Date {
  // For events with multiple days, use the first day
  if (item.eventDays && item.eventDays.length > 0) {
    return new Date(item.eventDays[0].date);
  }
  
  // For legacy events, use start date
  if (item.startDate || item.eventStart) {
    return new Date(item.startDate || item.eventStart);
  }
  
  // For regular posts
  if (item.date) {
    return new Date(item.date);
  }
  
  return new Date(); // Fallback
}

export default function Archive({
  posts = [],
  events = [],
}: {
  posts: PostType[];
  events: CustomEvent[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Parse URL params for initial filter state
  const paramTimeFilter = searchParams.get('zeitraum') || 'alle';
  const paramSortBy = searchParams.get('sortierung') || 'date_desc';
  const paramSearch = searchParams.get('suche') || '';

  const combinedData = useMemo(
    () => [
      ...events.map((event) => ({
        ...event,
        type: "event",
        title: event.eventTitle,
        startDate: event.eventStart,
        endDate: event.eventEnd,
        coverImage: event.eventImage,
        slug: event.slug,
      })),
      ...posts.map((post) => ({
        ...post,
        type: "post",
        startDate: post.date,
        endDate: post.date,
        title: post.title,
        slug: post.slug,
      })),
    ],
    [events, posts]
  );

  const [data, setData] = useState(combinedData);
  const [timeFilter, setTimeFilter] = useState(paramTimeFilter); // Primary filter: time-based
  const [sortBy, setSortBy] = useState(paramSortBy); // Sorting option
  const [searchQuery, setSearchQuery] = useState(paramSearch); // Search query
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [visibleItems, setVisibleItems] = useState<{[key: string]: boolean}>({});
  const [animatingItems, setAnimatingItems] = useState<{[key: string]: boolean}>({});
  const [initialRender, setInitialRender] = useState(true);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const imageRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd+K (Mac) or Ctrl+K (Windows/Linux) is pressed
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle search input debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Debounce search for 300ms
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Function to handle search
  const handleSearch = (query: string) => {
    // Don't filter if search is empty
    if (!query.trim()) return;
    
    // Otherwise, this will be handled in the main filter effect
  };

  // Handle filter and sort changes
  useEffect(() => {
    let filteredData = [...combinedData]; // Create a new array

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      
      filteredData = filteredData.filter((item) => {
        // Search in title
        const titleText = (item.title || '').toLowerCase();
        
        // Search in content
        const contentText = typeof item.content === 'string' 
          ? item.content 
          : JSON.stringify(item.content || '');
          
        const searchableText = `${titleText} ${contentText}`.toLowerCase();
        
        // Check if ALL search terms are found in the item
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Filter by time (past/future)
    if (timeFilter !== "alle") {
      filteredData = filteredData.filter((item) => {
        const itemDate = getItemDate(item);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day for fair comparison
        
        if (timeFilter === "kommende") {
          // Include all future events and today's events
          return itemDate >= today;
        } else if (timeFilter === "vergangene") {
          // Past events only (before today)
          return itemDate < today;
        }
        return true;
      });
    }

    // Simplified sorting with fewer options
    filteredData.sort((a, b) => {
      try {
        const dateA = getItemDate(a);
        const dateB = getItemDate(b);
        
        switch (sortBy) {
          case "date_asc":
            // Ascending date (oldest first)
            return compareAsc(dateA, dateB);
          case "date_desc":
            // Descending date (newest first)
            return compareDesc(dateA, dateB);
          case "title_asc":
            // A-Z
            return (a.title || "").localeCompare(b.title || "");
          case "title_desc":
            // Z-A
            return (b.title || "").localeCompare(a.title || "");
          default:
            // Default is date descending
            return compareDesc(dateA, dateB);
        }
      } catch (error) {
        console.error("Error sorting items:", error);
        return 0;
      }
    });

    setData(filteredData);
    
    // Reset visibility when data changes
    setVisibleItems({});
    setAnimatingItems({});
    setInitialRender(true);
    
    // After reset, immediately mark first batch as visible for new filter/sort
    const newVisibleItems: {[key: string]: boolean} = {};
    filteredData.slice(0, 12).forEach(item => {
      if (item._id) {
        newVisibleItems[item._id] = true;
      }
    });
    setVisibleItems(newVisibleItems);
    
    // After a short delay, mark that we're no longer in initial render
    const timer = setTimeout(() => {
      setInitialRender(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [sortBy, timeFilter, searchQuery, combinedData]);

  // Set up intersection observer for lazy loading images and animation
  useEffect(() => {
    if (initialRender) return; // Don't set up observers during initial render
    
    // Create intersection observer to detect when images enter viewport
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setImagesLoaded(prev => ({ ...prev, [id]: true }));
              imageObserver.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: '200px' } // Load images 200px before they come into view
    );
    
    // Create intersection observer for revealing items with animation
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              // Mark as animating first
              setAnimatingItems(prev => ({ ...prev, [id]: true }));
              
              // Use setTimeout to create a staggered effect
              const delay = Math.floor(Math.random() * 150); // Random delay between 0-150ms for natural staggering
              
              setTimeout(() => {
                setVisibleItems(prev => ({ ...prev, [id]: true }));
              }, delay);
              
              itemObserver.unobserve(entry.target);
            }
          }
        });
      },
      { 
        threshold: 0.05,  // Trigger when just 5% of the item is visible for earlier start
        rootMargin: '10% 0px -5% 0px' // Start animation before item fully enters viewport
      }
    );
    
    observerRef.current = itemObserver;

    // Register all existing refs with their observers
    Object.entries(imageRefs.current).forEach(([id, ref]) => {
      if (ref && !imagesLoaded[id]) {
        imageObserver.observe(ref);
      }
    });
    
    Object.entries(itemRefs.current).forEach(([id, ref]) => {
      if (ref && !visibleItems[id] && !animatingItems[id]) {
        itemObserver.observe(ref);
      }
    });

    // Clean up observers on unmount
    return () => {
      imageObserver.disconnect();
      itemObserver.disconnect();
    };
  }, [initialRender, imagesLoaded, visibleItems, animatingItems]);

  // Register refs with intersection observers when they change
  useEffect(() => {
    if (!observerRef.current || initialRender) return;
    
    // For each item ref that exists, observe it
    Object.entries(itemRefs.current).forEach(([id, ref]) => {
      if (ref && observerRef.current && !visibleItems[id] && !animatingItems[id]) {
        observerRef.current.observe(ref);
      }
    });
  }, [data, visibleItems, animatingItems, initialRender]);

  // Function to truncate title to a specific length
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (!title) return "";
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  // Function to get a compact date display
  const getCompactDateDisplay = (item: any) => {
    // For events with multiple days, show just the date range
    if (item.eventDays && item.eventDays.length > 0) {
      const days = item.eventDays;
      const firstDay = new Date(days[0].date);
      const lastDay = new Date(days[days.length - 1].date);
      
      // Format dates in compact form
      const firstDate = format(firstDay, "dd.MM.yyyy", { locale: de });
      const lastDate = format(lastDay, "dd.MM.yyyy", { locale: de });
      
      if (firstDate === lastDate) {
        return <p className="text-white text-base">{firstDate}</p>;
      }
      
      return <p className="text-white text-base">{firstDate} - {lastDate}</p>;
    }
    
    // For legacy events
    if (item.eventStart && item.eventEnd) {
      const start = new Date(item.eventStart);
      const end = new Date(item.eventEnd);
      
      const startDate = format(start, "dd.MM.yyyy");
      const endDate = format(end, "dd.MM.yyyy");
      
      if (startDate === endDate) {
        return <p className="text-white text-base">{startDate}</p>;
      }
      
      return <p className="text-white text-base">{startDate} - {endDate}</p>;
    }
    
    // For regular posts
    if (item.date) {
      return <p className="text-white text-base">{format(new Date(item.date), "dd.MM.yyyy")}</p>;
    }
    
    return null;
  };

  // Preload first 12 images immediately
  const preloadFirstBatch = (index: number) => {
    return index < 12;
  };

  // Get sort option label
  const getSortLabel = () => {
    switch (sortBy) {
      case "date_desc":
        return "Datum (zukünftige zuerst)";
      case "date_asc":
        return "Datum (vergangene zuerst)";
      case "title_asc":
        return "A - Z";
      case "title_desc":
        return "Z - A";
      default:
        return "Datum (zukünftige zuerst)";
    }
  };

  // Get active filter chips to display
  const getActiveFilters = () => {
    const filters = [];
    
    // Time filter
    if (timeFilter === 'kommende') {
      filters.push({ id: 'time', label: 'Kommende Veranstaltungen', icon: '📅' });
    } else if (timeFilter === 'vergangene') {
      filters.push({ id: 'time', label: 'Vergangene Veranstaltungen', icon: '🕒' });
    }
    
    // Show sort filter chip if not default
    if (sortBy !== 'date_desc') {
      filters.push({ id: 'sort', label: getSortLabel(), icon: '🔍' });
    }
    
    // Show search filter if active
    if (searchQuery) {
      filters.push({ id: 'search', label: `Suche: "${searchQuery}"`, icon: '🔎' });
    }
    
    return filters;
  };
  
  // Clear a specific filter
  const clearFilter = (filterId: string) => {
    if (filterId === 'time') {
      setTimeFilter('alle');
    } else if (filterId === 'sort') {
      setSortBy('date_desc');
    } else if (filterId === 'search') {
      setSearchQuery('');
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setTimeFilter('alle');
    setSortBy('date_desc');
    setSearchQuery('');
  };

  const activeFilters = getActiveFilters();

  return (
    <SectionBackground>
      {/* Header with title */}
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl m-10 text-brand-colour-light">
          Alle Veranstaltungen & Beiträge
        </h1>
        
        {/* Filter observer anchor */}
        <div ref={filterRef} className="w-full" />
        
        {/* Sticky filter container */}
        <div className={`w-full transition-all duration-300 z-10 px-4 py-3 ${
          isFilterSticky ? 'sticky top-0 shadow-lg bg-brand-colour-darker' : ''
        }`}>
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suche nach Veranstaltungen und Beiträgen..."
                className="w-full bg-brand-colour-darker text-white border border-brand-border-orange rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-brand-border-orange focus:ring-1 focus:ring-brand-border-orange"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-colour-light">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-brand-colour-light">
                <kbd className="px-2 py-1 bg-brand-accent-2 rounded">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-2 justify-center">
            {/* Primary filter: Time-based (Zeitraum) */}
            <div className="flex flex-col">
              <label className="text-sm text-brand-colour-light mb-1">Zeitraum</label>
              <select
                onChange={(e) => setTimeFilter(e.target.value)}
                value={timeFilter}
                className="border p-2 rounded-sm bg-brand-colour-darker text-white border-brand-border-orange focus:border-brand-border-orange focus:outline-none focus:ring-1 focus:ring-brand-border-orange"
              >
                <option value="alle">Alle Zeiträume</option>
                <option value="kommende">Kommende Veranstaltungen</option>
                <option value="vergangene">Vergangene Veranstaltungen</option>
              </select>
            </div>
            
            {/* Secondary filter: Sorting (Sortierung) */}
            <div className="flex flex-col">
              <label className="text-sm text-brand-colour-light mb-1">Sortierung</label>
              <select
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
                className="border p-2 rounded-sm bg-brand-colour-darker text-white border-brand-border-orange focus:border-brand-border-orange focus:outline-none focus:ring-1 focus:ring-brand-border-orange"
              >
                <option value="date_desc">Datum (zukünftige zuerst)</option>
                <option value="date_asc">Datum (vergangene zuerst)</option>
                <option value="title_asc">A - Z</option>
                <option value="title_desc">Z - A</option>
              </select>
            </div>
          </div>
          
          {/* Active filter chips/pills */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {activeFilters.map((filter) => (
                <div 
                  key={filter.id} 
                  className="flex items-center bg-brand-accent-2 text-white px-3 py-1 rounded-full text-sm border border-brand-border-orange"
                >
                  <span className="mr-1">{filter.icon}</span>
                  <span>{filter.label}</span>
                  <button 
                    onClick={() => clearFilter(filter.id)}
                    className="ml-2 text-white hover:text-brand-colour-light"
                    aria-label={`Filter ${filter.label} entfernen`}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {activeFilters.length > 1 && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-brand-colour-light hover:text-white underline px-2"
                >
                  Alle Filter zurücksetzen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="text-center text-brand-colour-light mb-4">
        {data.length} {data.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
      </div>

      {/* Results grid */}
      <div
        className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 ${
          data.length == 2
            ? "md:grid-cols-2"
            : data.length == 3
            ? "lg:grid-cols-3 md:grid-cols-2"
            : data.length >= 4
            ? "xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2"
            : null
        } p-4 md:p-10 gap-6`}
      >
        {data.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-brand-colour-light">Keine Ergebnisse gefunden</p>
            <button 
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-brand-accent-2 hover:bg-brand-border-orange transition-colors duration-300 text-white rounded-lg border border-brand-border-orange"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          data.map((item, index) => {
            const isVisible = visibleItems[item._id || ''] || initialRender;
            const staggerDelay = initialRender ? 0 : Math.min(index * 25, 300);
            
            return (
              <div 
                key={item._id} 
                ref={el => { itemRefs.current[item._id || ''] = el; }}
                data-id={item._id}
                style={{ 
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '500ms',
                  transitionDelay: `${staggerDelay}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                }}
                className="flex flex-col bg-brand-colour-darker rounded-lg shadow-lg h-full overflow-hidden hover:shadow-xl border border-brand-border-orange"
              >
                <a href={`/${item.slug}`} className="block overflow-hidden rounded-t-lg">
                  <div 
                    className="relative h-48 w-full bg-brand-accent-2 overflow-hidden"
                                         ref={el => { imageRefs.current[item._id || ''] = el; }}
                    data-id={item._id}
                  >
                    {(imagesLoaded[item._id || ''] || preloadFirstBatch(index)) && item.coverImage && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center blur-md transform scale-110"
                          style={{ 
                            backgroundImage: `url(${urlForImage(item.coverImage).width(10).url()})` 
                          }}
                        />
                        
                        <Image
                          src={urlForImage(item.coverImage).width(500).url()}
                          alt={item.title}
                          fill={true}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-all duration-700 hover:scale-105"
                          loading={preloadFirstBatch(index) ? "eager" : "lazy"}
                          priority={preloadFirstBatch(index)}
                        />
                      </>
                    )}
                  </div>
                </a>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h2 className="text-xl text-brand-colour-light font-semibold truncate" title={item.title}>
                      {truncateTitle(item.title)}
                    </h2>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="mb-4">
                      {getCompactDateDisplay(item)}
                      <p className="text-brand-colour-light text-sm mt-1">
                        {item.type === "event" ? "Veranstaltung" : "Beitrag"}
                      </p>
                    </div>
                    
                    <Button
                      styles="w-full bg-brand-border-orange border-brand-border-orange transition-colors duration-300 rounded-full border hover:border-brand-border-orange"
                      href={`/${item.slug}`}
                      text="weiterlesen"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionBackground>
  );
}
