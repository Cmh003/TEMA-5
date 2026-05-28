import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  image?: string;
}

export default function Card({ children, onClick, className = '', image }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl shadow-lg group bg-blue-950
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {image && (
        <>
         
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          
        
          <div className="absolute inset-0 bg-[#0a1628]/80 transition-colors duration-300" />
        </>
      )}

      
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center p-6 text-white">
        {children}
      </div>
    </div>
  );
}