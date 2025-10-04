// src/app/services/openingHoursService.ts
interface OpeningHour {
  dayName: string;
  hours: string;
}

interface OpeningHoursResponse {
  openingHours: OpeningHour[];
  lastUpdated: string;
}

export async function isCurrentlyOpen(): Promise<{
  isOpen: boolean;
  nextOpeningTime?: string;
  todayHours?: string;
}> {
  try {
    // Fetch current opening hours
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openingHours`);
    const data: OpeningHoursResponse = await response.json();
    
    if (!data.openingHours || data.openingHours.length === 0) {
      return { isOpen: false };
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
    
    // Map day numbers to German day names (as they come from Google)
    const dayNames = [
      'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
      'Donnerstag', 'Freitag', 'Samstag'
    ];
    
    const todayName = dayNames[currentDay];
    const todayHours = data.openingHours.find(day => day.dayName === todayName);
    
    if (!todayHours) {
      return { isOpen: false, todayHours: 'Heute geschlossen' };
    }

    // Check if closed today
    if (todayHours.hours.toLowerCase().includes('geschlossen') || 
        todayHours.hours.toLowerCase().includes('closed')) {
      // Find next opening day
      const nextOpeningTime = findNextOpeningTime(data.openingHours, currentDay);
      return { 
        isOpen: false, 
        todayHours: todayHours.hours,
        nextOpeningTime 
      };
    }

    // Parse opening hours (e.g., "10:00 – 22:00")
    const timeMatch = todayHours.hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    
    if (!timeMatch) {
      return { isOpen: false, todayHours: todayHours.hours };
    }

    const [, openHour, openMin, closeHour, closeMin] = timeMatch;
    const openingTime = parseInt(openHour) * 60 + parseInt(openMin);
    const closingTime = parseInt(closeHour) * 60 + parseInt(closeMin);

    const isOpen = currentTime >= openingTime && currentTime < closingTime;
    
    if (!isOpen) {
      const nextOpeningTime = findNextOpeningTime(data.openingHours, currentDay);
      return { 
        isOpen: false, 
        todayHours: todayHours.hours,
        nextOpeningTime 
      };
    }

    return { 
      isOpen: true, 
      todayHours: todayHours.hours 
    };

  } catch (error) {
    console.error('Error checking opening hours:', error);
    return { isOpen: false };
  }
}

function findNextOpeningTime(openingHours: OpeningHour[], currentDay: number): string | undefined {
  const dayNames = [
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
    'Donnerstag', 'Freitag', 'Samstag'
  ];

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayName = dayNames[nextDay];
    const nextDayHours = openingHours.find(day => day.dayName === nextDayName);
    
    if (nextDayHours && 
        !nextDayHours.hours.toLowerCase().includes('geschlossen') &&
        !nextDayHours.hours.toLowerCase().includes('closed')) {
      
      const dayLabel = i === 1 ? 'morgen' : nextDayName;
      return `${dayLabel} (${nextDayHours.hours})`;
    }
  }
  
  return undefined;
}

export function formatOpeningHours(openingHours: OpeningHour[]): string {
  return openingHours
    .map(day => `${day.dayName}: ${day.hours}`)
    .join('\n');
}
