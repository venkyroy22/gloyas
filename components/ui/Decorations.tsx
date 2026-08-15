import React from 'react';

const StarSVG = ({ cx, cy, r, color }: { cx: number, cy: number, r: number, color: string }) => (
  <path
    d={`M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`}
    fill={color}
  />
);

export const HeroDecorationsSVG = () => (
  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[0] opacity-80" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
    
    {/* Stars - Top Left / Center */}
    <StarSVG cx={150} cy={150} r={10} color="#278DFD" />
    <StarSVG cx={350} cy={80} r={6} color="#000000" />
    <StarSVG cx={600} cy={350} r={5} color="#278DFD" />
    {/* Removed stars that were overlapping the text */}
    
    {/* Stars - Top Right / Center Right */}
    <StarSVG cx={700} cy={120} r={6} color="#000000" />
    <StarSVG cx={950} cy={200} r={9} color="#278DFD" />
    <StarSVG cx={1100} cy={700} r={12} color="#278DFD" />
    <StarSVG cx={1350} cy={300} r={7} color="#000000" />
    <StarSVG cx={1250} cy={100} r={5} color="#278DFD" />
    
    {/* Solid Dots */}
    <circle cx="100" cy="500" r="4" fill="#000000" opacity="0.3" />
    <circle cx="350" cy="200" r="6" fill="#278DFD" opacity="0.5" />
    <circle cx="650" cy="650" r="3" fill="#000000" opacity="0.4" />
    <circle cx="1000" cy="150" r="5" fill="#278DFD" opacity="0.3" />
    <circle cx="1250" cy="550" r="4" fill="#000000" opacity="0.2" />
    <circle cx="850" cy="450" r="3" fill="#278DFD" opacity="0.4" />
    <circle cx="200" cy="700" r="5" fill="#000000" opacity="0.2" />
    <circle cx="1400" cy="600" r="6" fill="#278DFD" opacity="0.3" />
    
    {/* Hollow Circles / Rings */}
    <circle cx="280" cy="300" r="8" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="800" cy="250" r="12" stroke="#278DFD" strokeWidth="1.5" fill="none" opacity="0.3" />
    <circle cx="1150" cy="450" r="10" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="500" cy="150" r="6" stroke="#278DFD" strokeWidth="1.5" fill="none" opacity="0.4" />
    <circle cx="1300" cy="750" r="14" stroke="#278DFD" strokeWidth="1" fill="none" opacity="0.3" />

    {/* Plus Signs / Crosses */}
    <path d="M 400 495 L 400 505 M 395 500 L 405 500" stroke="#000000" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
    <path d="M 900 145 L 900 155 M 895 150 L 905 150" stroke="#278DFD" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    <path d="M 150 345 L 150 355 M 145 350 L 155 350" stroke="#278DFD" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    <path d="M 1050 645 L 1050 655 M 1045 650 L 1055 650" stroke="#000000" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
  </svg>
);
