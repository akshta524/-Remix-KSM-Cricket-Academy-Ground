import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Filter
} from 'lucide-react';

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
}

export const Gallery: React.FC = () => {
  const categories = [
    'All',
    'Ground',
    'Pitch',
    'Practice Nets',
    'Bowling Machine',
    'Facilities',
    'Ground Views',
    'Evening Play',
    'Academy Players',
    'Coaching',
    'Hostel'
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const galleryItems: GalleryPhoto[] = [
    {
      id: 'g1',
      title: 'Panoramic Match Ground Outfield',
      category: 'Ground',
      imageUrl: '/src/assets/images/hero_cricket_ground_1793601200734.jpg',
      caption: 'Full-size 65m boundary match ground in Adibatla with manicured natural grass.'
    },
    {
      id: 'g2',
      title: 'Prepared Center Clay Pitch',
      category: 'Pitch',
      imageUrl: '/src/assets/images/hero_cricket_ground_1793601200734.jpg',
      caption: 'Even-bounce clay wicket prepared with heavy rollers for true ball bounce and seam movement.'
    },
    {
      id: 'g3',
      title: 'Practice Nets Training Bays',
      category: 'Practice Nets',
      imageUrl: '/src/assets/images/academy_cricket_nets_1793601202321.jpg',
      caption: 'Enclosed multi-bay outdoor practice nets with turf wickets and white/red leather cricket balls.'
    },
    {
      id: 'g4',
      title: 'Automated Bowling Machine Setup',
      category: 'Bowling Machine',
      imageUrl: '/src/assets/images/academy_cricket_nets_1793601202321.jpg',
      caption: 'Electronic bowling machine delivering 200 balls per hour at speeds from 80 km/h to 145 km/h.'
    },
    {
      id: 'g5',
      title: 'Evening Play Under High-Lumen Floodlights',
      category: 'Evening Play',
      imageUrl: '/src/assets/images/evening_floodlights_match_1793601203797.jpg',
      caption: 'Night match atmosphere with high-intensity LED stadium floodlights illuminating the entire field.'
    },
    {
      id: 'g6',
      title: 'Youth Academy Players Coaching Clinic',
      category: 'Academy Players',
      imageUrl: '/src/assets/images/academy_coaching_session_1793601202753.jpg',
      caption: 'Junior cricketers in academy whites receiving technical batting guidance from senior coaches.'
    },
    {
      id: 'g7',
      title: 'Senior Coach Technique Demonstration',
      category: 'Coaching',
      imageUrl: '/src/assets/images/academy_coaching_session_1793601202753.jpg',
      caption: 'Coach demonstrating balance, head stillness, and backlift angle for front foot defense.'
    },
    {
      id: 'g8',
      title: 'Air-Conditioned Academy Hostel Dorm',
      category: 'Hostel',
      imageUrl: '/src/assets/images/academy_hostel_room_1793601203458.jpg',
      caption: 'Comfortable residential player accommodation with AC, personal lockers, and quiet study areas.'
    },
    {
      id: 'g9',
      title: 'Ground Perimeter & Boundary Ropes',
      category: 'Ground Views',
      imageUrl: '/src/assets/images/hero_cricket_ground_1793601200734.jpg',
      caption: 'Clean boundary perimeter, scoreboard area, and pavilion shade in Nadargul Rural.'
    },
    {
      id: 'g10',
      title: 'Comprehensive Training Infrastructure',
      category: 'Facilities',
      imageUrl: '/src/assets/images/evening_floodlights_match_1793601203797.jpg',
      caption: 'Full-spectrum cricket facility combining match ground, 24/7 nets, hostel, and coaching.'
    }
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-20 bg-slate-50 dark:bg-[#050d08] border-t border-slate-200 dark:border-[#132c1a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#15803d] dark:text-[#84cc16] mb-2 uppercase tracking-wider">
            <span>13</span>
            <span>·</span>
            <span>Visual Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Barlow_Condensed'] text-slate-900 dark:text-white tracking-tight mb-4">
            KSM Cricket Ground <span className="text-[#16a34a] dark:text-[#4ade80]">Gallery</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Take a visual tour through our tournament ground, floodlight practice nets, bowling machine, academy clinic, and player hostel in Adibatla.
          </p>
        </div>

        {/* 10 Category Filtering Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-['Barlow_Condensed'] uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#16a34a] dark:bg-[#22c55e] text-white dark:text-black border-[#16a34a] dark:border-[#22c55e] shadow-md'
                  : 'bg-white dark:bg-[#091a0f] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1a3a23] hover:border-[#22c55e]/40 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-[#1b3a23] hover:border-[#22c55e]/60 transition-all cursor-pointer aspect-[4/3] shadow-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono text-[#4ade80] dark:text-[#84cc16] uppercase block">
                  {item.category}
                </span>
                <h3 className="text-base font-bold font-['Barlow_Condensed'] uppercase tracking-wide leading-snug mt-0.5">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && filteredItems[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg bg-black/60 border border-white/20 z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all z-10 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all z-10 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full max-h-[70vh] rounded-2xl overflow-hidden border border-[#22c55e]/40 shadow-2xl bg-black">
              <img
                src={filteredItems[selectedPhotoIndex].imageUrl}
                alt={filteredItems[selectedPhotoIndex].title}
                className="w-full h-full max-h-[70vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full mt-4 p-4 rounded-xl bg-white dark:bg-[#091a0f] border border-slate-200 dark:border-[#1b3a23] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase text-[#15803d] dark:text-[#84cc16]">
                  {filteredItems[selectedPhotoIndex].category} · Photo {selectedPhotoIndex + 1} of {filteredItems.length}
                </span>
                <h3 className="text-xl font-bold font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                  {filteredItems[selectedPhotoIndex].title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {filteredItems[selectedPhotoIndex].caption}
                </p>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                KSM Cricket Ground
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
