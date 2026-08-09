import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image, X, ZoomIn } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className="bg-blue-500/30 text-blue-100 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
            Photo Gallery
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Campus Gallery
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Highlights from science laboratories, seminars, sports, and campus events at Jamal College of Sciences, Mayar.
        </p>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 p-12 rounded-2xl text-center space-y-2">
          <Image className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-slate-800 font-bold text-lg">No photos in gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group text-left flex flex-col justify-between"
            >
              <div className="relative h-60 bg-slate-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                    <ZoomIn className="w-6 h-6" />
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 bg-blue-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-medium">
                  Date: {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl text-left">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                  {selectedImage.category}
                </span>
                <span className="text-xs text-blue-300 font-semibold">{selectedImage.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
