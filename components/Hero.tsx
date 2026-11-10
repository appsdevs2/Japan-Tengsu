import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCT_IMAGES = [
  "https://tokyorevil.com/wp-content/uploads/2021/08/Japan-Tengsu-2.jpg",
  "https://japanese-tengsu.com/wp-content/uploads/2022/05/1.jpeg",
  "https://japan-tengsu.us/wp-content/uploads/2021/04/Japan-tengsu-1.jpg",
  "https://hsa.gov.sg/images/default-source/default-album/japan-tengsu.jpg" // Possible URL, otherwise falls back gracefully
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);

  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100/50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-100/50 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-800 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              #1 Rated Herbal Supplement
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mb-6">
              Unlock Your Full <span className="text-brand-600">Potential</span> & Vitality
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:mx-0 mb-8">
              Experience the ancient wisdom of Japan Tengsu. A powerful, natural formula designed to support stamina, confidence, and peak performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 md:text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                View Packages
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </a>
              <a href="#benefits" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-colors">
                Learn More
              </a>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="text-green-500 w-4 h-4" />
                <span>FDA Approved Facility</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="text-green-500 w-4 h-4" />
                <span>100% Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="text-green-500 w-4 h-4" />
                <span>Discreet Shipping</span>
              </div>
            </div>
          </div>

          {/* Image/Visual Content - Slider */}
          <div className="lg:col-span-6 relative">
             <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-white bg-white h-80 sm:h-96 md:h-[450px] group">
                {PRODUCT_IMAGES.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Japan Tengsu Product Photo ${idx + 1}`} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    onError={(e) => {
                       // Fallback to placeholder if a specific external image URL is broken
                       e.currentTarget.src = `https://picsum.photos/seed/japantengsu_hero${idx}/800/600`;
                    }}
                  />
                ))}
                
                {/* Slider Controls */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slider Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {PRODUCT_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlide ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white z-10 pt-16 pointer-events-none">
                    <p className="font-bold text-xl drop-shadow-md">Japan Tengsu</p>
                    <p className="text-sm opacity-90 drop-shadow-md">Premium Herbal Formula</p>
                </div>
             </div>
             {/* Floating Badge */}
             <div className="absolute -top-6 -right-6 bg-accent-500 text-white w-24 h-24 rounded-full flex items-center justify-center font-bold text-center shadow-lg rotate-12 z-30 border-4 border-white pointer-events-none">
               Special<br/>Offer
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;