// utils/dateFormatter.ts
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const day = date.getDate();
  const dayWithOrdinal = getOrdinalSuffix(day);
  
  // Get abbreviated month name
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  
  // Get full year
  const year = date.getFullYear();
  
  return `${dayWithOrdinal} - ${month} - ${year}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}th`; // 4th-20th
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}