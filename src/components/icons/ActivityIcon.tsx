import React from 'react';

type ActivityType = 'bike' | 'run' | 'walk' | 'skate' | 'ball';

interface ActivityIconProps {
  activity: ActivityType;
  size?: number;
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ 
  activity, 
  size = 100,
  className = '' 
}) => {
  // Return simple SVG illustrations based on activity type
  // For production, you would use more detailed SVGs or images
  
  const bikeIcon = (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="25" cy="70" r="20" stroke="white" strokeWidth="4" />
      <circle cx="75" cy="70" r="20" stroke="white" strokeWidth="4" />
      <path d="M25 70L45 30H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M45 50L75 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M65 30V40" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <circle cx="65" cy="25" r="5" fill="#FFDD67" />
    </svg>
  );
  
  // Default to bike for now, expand with other activities as needed
  return bikeIcon;
};