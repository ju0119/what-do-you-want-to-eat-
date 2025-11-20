import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-orange-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const QuoteIcon = () => (
    <svg className="w-8 h-8 text-orange-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
    </svg>
);


export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, index }) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`;
    const animationDelay = `${index * 100}ms`;

    // Generate a dynamic image URL based on the prompt
    // Using pollinations.ai which is free and requires no key
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(restaurant.imagePrompt)}?width=800&height=600&nologo=true&seed=${index}`;

    return (
        <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-2xl duration-300 animate-fade-in-up flex flex-col border border-gray-100"
            style={{ animationDelay }}
        >
            {/* Image Section */}
            <div className="h-48 overflow-hidden relative bg-gray-200">
                <img 
                    src={imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-0 left-0 m-4">
                     <span className="bg-white/90 backdrop-blur-sm text-orange-600 font-bold px-3 py-1 rounded-full shadow-md">
                        #{restaurant.ranking}
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 m-4">
                    <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {restaurant.cuisine}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-grow">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800 truncate pr-2" title={restaurant.name}>
                        {restaurant.name}
                    </h2>
                </div>
                <p className="text-gray-600 italic text-sm">"{restaurant.description}"</p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                    <ClockIcon />
                    <span>{restaurant.hours}</span>
                </div>

                <blockquote className="relative mt-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                    <div className="absolute top-2 right-2 opacity-50">
                        <QuoteIcon />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed z-10 relative font-medium">
                        {restaurant.review}
                    </p>
                </blockquote>
                
                {restaurant.menu && restaurant.menu.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center mb-3">
                            <MenuIcon />
                            招牌菜色
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {restaurant.menu.map((item, i) => (
                                <li key={i} className="flex justify-between items-center group">
                                    <span className="text-gray-700 group-hover:text-orange-600 transition-colors">{item.name}</span>
                                    <span className="text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="px-6 pb-6 mt-auto">
                <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full block text-center bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-600 border border-gray-200 hover:border-orange-500 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
                >
                    <MapPinIcon />
                    <span className="truncate max-w-[200px]">{restaurant.address}</span>
                </a>
            </div>
        </div>
    );
};