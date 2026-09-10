import React, { useState } from 'react';
import { ASSETS } from '../../data/initialData';
import { Image as ImageIcon, Sparkles, ZoomIn } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string; category: string } | null>(null);

  const galleryItems = [
    {
      src: ASSETS.workshopClass,
      caption: 'Morning stitching class — trainees working side by side on sewing machines',
      category: 'workshop',
      tag: 'Workshop Classroom'
    },
    {
      src: ASSETS.studentFrock,
      caption: 'Student-made frock from the THS practical stitching class',
      category: 'creations',
      tag: 'Student Creation'
    },
    {
      src: ASSETS.centerBuilding,
      caption: 'Taleem-o-Hunar Society vocational complex and THS Medical Center',
      category: 'facility',
      tag: 'THS Campus'
    },
    {
      src: ASSETS.centerEntrance,
      caption: 'Center entrance — Taleem-o-Hunar Society, registered welfare organization',
      category: 'facility',
      tag: 'Center Entrance'
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Center Visual Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Moments of Craft, Focus & Achievement
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Take a visual tour inside our classrooms, cutting rooms, practical sewing tables, and student exhibitions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'workshop', label: 'Workshop & Machines' },
            { id: 'creations', label: 'Student Creations' },
            { id: 'facility', label: 'Center & Campus' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeCategory === cat.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 aspect-4/3 cursor-pointer shadow-md hover:shadow-2xl transition duration-300"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition"></div>

              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <p className="text-xs font-medium text-slate-100 leading-snug line-clamp-2 pr-2">
                  {item.caption}
                </p>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-[#166534] transition">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="w-full max-h-[70vh] object-contain bg-black"
                referrerPolicy="no-referrer"
              />
              <div className="p-6 bg-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {selectedImage.tag}
                  </span>
                  <p className="text-sm text-slate-200 mt-1 font-medium">
                    {selectedImage.caption}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
