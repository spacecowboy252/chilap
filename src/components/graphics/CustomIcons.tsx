import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const WalletIcon: React.FC<IconProps> = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Rect x="4" y="8" width="24" height="16" rx="3" fill={color} opacity="0.9" />
    <Rect x="6" y="10" width="20" height="2" fill={color} opacity="0.7" />
    <Circle cx="22" cy="16" r="2" fill={color} opacity="0.8" />
    <Path d="M4 12 L8 8 L24 8 L28 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
  </Svg>
);

export const HourglassIcon: React.FC<IconProps> = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Path 
      d="M8 6 L24 6 L24 12 L16 16 L24 20 L24 26 L8 26 L8 20 L16 16 L8 12 Z" 
      fill={color} 
      opacity="0.9" 
    />
    <Rect x="8" y="16" width="16" height="6" fill={color} opacity="0.7" />
    <Circle cx="12" cy="18" r="1" fill={color} opacity="0.8" />
    <Circle cx="16" cy="20" r="1" fill={color} opacity="0.8" />
    <Circle cx="20" cy="19" r="1" fill={color} opacity="0.8" />
  </Svg>
);

export const CalendarStarIcon: React.FC<IconProps> = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Rect x="4" y="6" width="24" height="20" rx="2" fill={color} opacity="0.9" />
    <Rect x="4" y="6" width="24" height="6" rx="2" fill={color} opacity="0.7" />
    <Circle cx="10" cy="4" r="1.5" fill={color} />
    <Circle cx="22" cy="4" r="1.5" fill={color} />
    <Polygon 
      points="16,14 17.2,17.2 20.4,17.2 17.8,19.4 18.6,22.6 16,20.8 13.4,22.6 14.2,19.4 11.6,17.2 14.8,17.2" 
      fill={color} 
      opacity="0.8" 
    />
  </Svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Path 
      d="M10 8 L22 8 L22 16 C22 20 19 22 16 22 C13 22 10 20 10 16 Z" 
      fill={color} 
      opacity="0.9" 
    />
    <Rect x="14" y="22" width="4" height="4" fill={color} opacity="0.8" />
    <Rect x="12" y="26" width="8" height="2" rx="1" fill={color} opacity="0.9" />
    <Path d="M8 10 C6 10 4 12 4 14 C4 16 6 18 8 18" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
    <Path d="M24 10 C26 10 28 12 28 14 C28 16 26 18 24 18" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
    <Circle cx="16" cy="13" r="2" fill={color} opacity="0.6" />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 16, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Polygon 
      points="8,2 9.2,5.8 13,5.8 10.4,8.4 11.6,12.2 8,10 4.4,12.2 5.6,8.4 3,5.8 6.8,5.8" 
      fill={color} 
      opacity="0.8" 
    />
  </Svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 12, color = '#FFB6C1' }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12">
    <Path d="M6 2 L7 5 L10 6 L7 7 L6 10 L5 7 L2 6 L5 5 Z" fill={color} opacity="0.7" />
  </Svg>
);

export const BadgeIcon: React.FC<IconProps> = ({ size = 20, color = '#FF6B6B' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20">
    <Circle cx="10" cy="8" r="6" fill={color} opacity="0.8" />
    <Polygon points="10,14 7,18 10,16 13,18" fill={color} opacity="0.9" />
    <Circle cx="10" cy="8" r="3" fill={color} opacity="0.6" />
  </Svg>
); 