'use client';

import { useState, useEffect } from 'react';

const promotions = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    image: "/uploads/promotions/summer-sale.jpg",
    buttonText: "Shop Now",
    buttonLink: "/categories?promo=summer",
    backgroundColor: "bg-gradient-to-r from-orange-400 to-pink-500",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Discover the latest tech gadgets",
    image: "/uploads/promotions/new-arrivals.jpg",
    buttonText: "Explore",
    buttonLink: "/products?sort=newest",
    backgroundColor: "bg-gradient-to-r from-blue-400 to-purple-500",
  },
  {
    id: 3,
    title: "Free Shipping",
    description: "Free delivery on orders over R500",
    image: "/uploads/promotions/free-shipping.jpg",
    buttonText: "Learn More",
    buttonLink: "/shipping",
    backgroundColor: "bg-gradient-to-r from-green-400 to-teal-500",
  },
];

export default function PromotionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  return (
    <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg mx-4">
      {promotions.map((promo, index) => (
        <div
          key={promo.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          } ${promo.backgroundColor} rounded-lg`}
        >
          <div className="flex items-center justify-between h-full p-8">
            <div className="text-white max-w-md">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {promo.title}
              </h2>
              <p className="text-lg sm:text-xl mb-6 opacity-90">
                {promo.description}
              </p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {promo.buttonText}
              </button>
            </div>
            <div className="hidden md:block flex-1 max-w-md">
              <div className="w-full h-64 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-6xl">🎯</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-colors"
      >
        <span className="text-white text-xl">‹</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-colors"
      >
        <span className="text-white text-xl">›</span>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}