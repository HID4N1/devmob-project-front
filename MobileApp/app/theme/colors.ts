
export const colors = {
    primaryBlue: '#2563EB', // vivid blue
    green: '#22C55E',       // bright green
    skyBlue: '#60A5FA',     // lighter accent blue
    orange: '#F59E0B',      // warm orange
    background: '#F3F4F6',  // soft gray background
    textDark: '#111827',
    textLight: '#6B7280',
    white: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.1)'
  } as const;
  
  export type AppColors = typeof colors;
  