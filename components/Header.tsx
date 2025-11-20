
import React from 'react';

const ForkKnifeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 21l-4.5-4.5V3.75m0 0h9M12 3.75v10.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h1.5v3.75h-1.5V6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75h1.5v3.75h-1.5V6.75z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center py-8 bg-white shadow-sm">
      <div className="flex items-center justify-center gap-4">
        <ForkKnifeIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          今天吃什麼？
        </h1>
      </div>
      <p className="mt-2 text-md text-gray-500">讓 AI 為您決定下一餐</p>
    </header>
  );
};
