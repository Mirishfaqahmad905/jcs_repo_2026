import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Maximize2,
  X,
  GraduationCap,
  Image as ImageIcon
} from 'lucide-react';
import { CarouselSlide } from '../types';

interface CollegeCarouselProps {
  slides: CarouselSlide[];
}

export const CollegeCarousel: React.FC<CollegeCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isPausedHover, setIsPausedHover] = useState<boolean>(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter active slides
  const activeSlides = slides && slides.length > 0 ? slides.filter(s => s.status !== 'hidden') : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    if (isPlaying && !isPausedHover) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPausedHover, activeSlides.length]);

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6 sm:my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>Jamal College Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            College Campus & Event Banner Carousel
          </h2>
        </div>

        {/* Carousel Play/Pause & Slide Count */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {currentIndex + 1} / {activeSlides.length}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all text-xs flex items-center justify-center shadow"
            title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* Main Animated Carousel Container */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 group h-[380px] sm:h-[480px] md:h-[560px]"
        onMouseEnter={() => setIsPausedHover(true)}
        onMouseLeave={() => setIsPausedHover(false)}
      >
        {/* Animated Image Slide */}
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out group-hover:scale-105"
            />
            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />

            {/* Slide Text Overlay Details */}
            <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-10 z-20 text-left text-white space-y-3">
              {slide.badge && (
                <div className="inline-flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-blue-400/40 shadow">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 drop-shadow-md leading-snug">
                {slide.title}
              </h3>

              {slide.subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
                  {slide.subtitle}
                </p>
              )}

              {/* Lightbox / Zoom Action Button */}
              <div className="pt-2 flex items-center justify-start gap-3">
                <button
                  onClick={() => setLightboxUrl(slide.imageUrl)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2 transition-all shadow"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Fullscreen</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Manual Left & Right Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
          title="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
          title="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-amber-400 shadow-sm'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Scrollable Thumbnail Strip */}
      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none custom-scrollbar">
        {activeSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 relative rounded-2xl overflow-hidden border-2 transition-all ${
              idx === currentIndex
                ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105 shadow-md'
                : 'border-slate-300 opacity-60 hover:opacity-100 hover:border-slate-400'
            } w-28 sm:w-36 h-16 sm:h-20`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/20" />
            <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              #{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 bg-slate-800 hover:bg-red-600 text-white rounded-full transition-all z-50 shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={lightboxUrl}
              alt="Fullscreen Preview"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
