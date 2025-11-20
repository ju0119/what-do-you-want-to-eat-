import React, { useState, useCallback } from 'react';
import { fetchRestaurants } from './services/geminiService';
import { Restaurant } from './types';
import { Header } from './components/Header';
import { RestaurantCard } from './components/RestaurantCard';
import { Spinner } from './components/Spinner';
import { ErrorDisplay } from './components/ErrorDisplay';

const FindFoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

const CUISINE_OPTIONS = [
  { id: '全部', label: '全部', icon: '🍽️' },
  { id: '中式', label: '中式', icon: '🥢' },
  { id: '日式', label: '日式', icon: '🍱' },
  { id: '西式', label: '西式', icon: '🍔' },
  { id: '韓式', label: '韓式', icon: '🥘' },
  { id: '泰式', label: '泰式', icon: '🌶️' },
  { id: '咖啡廳', label: '咖啡', icon: '☕' },
  { id: '火鍋', label: '火鍋', icon: '🍲' },
];

const DISTANCE_OPTIONS = [
  { id: '500公尺', label: '步行 (500m)', icon: '🚶' },
  { id: '1公里', label: '附近 (1km)', icon: '🏃' },
  { id: '3公里', label: '開車 (3km)', icon: '🚗' },
];

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCuisine, setSelectedCuisine] = useState<string>('全部');
  const [selectedDistance, setSelectedDistance] = useState<string>('1公里');
  
  const handleFetchRecommendations = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRestaurants([]);
    setLoadingMessage('正在獲取您的位置...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLoadingMessage(`正在尋找附近的${selectedCuisine !== '全部' ? selectedCuisine : '美味'}餐廳...`);
        
        fetchRestaurants(latitude, longitude, selectedCuisine, selectedDistance)
          .then((data) => {
            setRestaurants(data);
          })
          .catch((err) => {
            const errMsg = err instanceof Error ? err.message : '發生未知錯誤';
            setError(errMsg);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      (geoError) => {
        let errorMessage = '無法獲取您的位置。';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage += ' 請允許網站存取您的位置資訊。';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage += ' 位置資訊目前不可用。';
            break;
          case geoError.TIMEOUT:
            errorMessage += ' 獲取位置超時。';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  }, [selectedCuisine, selectedDistance]);
  
  const renderContent = () => {
    if (isLoading) {
      return <Spinner message={loadingMessage} />;
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={handleFetchRecommendations} />;
    }

    if (restaurants.length > 0) {
      return (
        <>
            {/* Results Filter Info */}
            <div className="bg-orange-50 rounded-lg p-4 mb-8 flex flex-wrap items-center justify-between border border-orange-100">
                <div className="flex items-center text-orange-800 mb-2 sm:mb-0">
                    <FilterIcon />
                    <span className="font-medium">
                        篩選條件：{selectedCuisine}料理 · 距離 {selectedDistance} 內
                    </span>
                </div>
                <button 
                    onClick={() => setRestaurants([])} 
                    className="text-sm text-orange-600 hover:text-orange-800 underline"
                >
                    更改條件
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.map((r, i) => (
                    <RestaurantCard key={i} restaurant={r} index={i} />
                ))}
            </div>
            <div className="text-center mt-16 pb-12">
                <button
                    onClick={handleFetchRecommendations}
                    className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full shadow-lg hover:bg-gray-700 focus:outline-none transition-transform transform hover:scale-105 duration-300 flex items-center justify-center mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696V7.75a8.25 8.25 0 00-11.664 0v4.992m11.664 0l-3.181 3.183" />
                    </svg>
                    換一批試試
                </button>
            </div>
        </>
      );
    }
    
    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">今天想吃點什麼？</h2>
                <p className="text-gray-500 mb-8">選擇您喜歡的類型和距離，讓 AI 為您導航</p>

                {/* Filters Section */}
                <div className="space-y-6 text-left">
                    
                    {/* Cuisine Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">選擇料理類型</label>
                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                            {CUISINE_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedCuisine(option.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border ${
                                        selectedCuisine === option.id 
                                        ? 'bg-orange-50 border-orange-500 shadow-sm' 
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-2xl mb-1">{option.icon}</span>
                                    <span className={`text-xs font-medium ${selectedCuisine === option.id ? 'text-orange-700' : 'text-gray-600'}`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">選擇距離範圍</label>
                        <div className="flex space-x-3">
                            {DISTANCE_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedDistance(option.id)}
                                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        selectedDistance === option.id 
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                                    }`}
                                >
                                    <span className="mr-2">{option.icon}</span>
                                    <span className="text-sm font-bold">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <button
                    onClick={handleFetchRecommendations}
                    className="w-full mt-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all transform hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center"
                >
                    <FindFoodIcon />
                    開始搜尋
                </button>
            </div>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen font-sans pb-8 relative">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-sm text-gray-400">
        Powered by Google Gemini API
      </footer>
    </div>
  );
};

export default App;