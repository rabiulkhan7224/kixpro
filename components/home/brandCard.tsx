"use client"; // Required for hooks and GSAP

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const brands = [
  { name: 'ESSENTIALS', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
  { name: 'CLEENS', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
  { name: 'ASICS', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800' },
  { name: 'SAMUEL BAILEY', img: 'https://images.unsplash.com/photo-1523381235212-d73f8038f91a?q=80&w=800' },
];

const BrandCard = () => {
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Select all buttons inside this container
    const buttons = gsap.utils.toArray(".shop-now-btn");

    gsap.from(buttons, {
      y: -100,             // Move from top to down
      opacity: 0,
      duration: 1,
    //   stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",  // Animation starts when top of component hits 70% of viewport
        toggleActions: "play none none reverse",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full px-4 py-2 bg-white overflow-hidden">
      <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter">Greatest Brands</h2>
      
      <div className="flex flex-row items-center justify-center gap-4 h-[550px] w-full max-w-[1400px] mx-auto">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-[2rem] transition-all duration-500 ease-in-out group"
            style={{
              // Your specific expansion logic
              width: activeImage === index ? "40rem" : "10rem",
              height: "100%",
            }}
            onClick={() => setActiveImage(index)}
            onMouseEnter={() => setActiveImage(index)}
          >
            {/* Image Layer: Scales 1.2 on hover */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-[1.2]"
              style={{
                backgroundImage: `url(${brand.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

            {/* Brand Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h3 className={`text-white font-black uppercase transition-all duration-500 text-center
                ${activeImage === index ? 'text-5xl opacity-100 scale-100' : 'text-sm opacity-0 scale-50'}`}>
                {brand.name}
              </h3>
            </div>
{/*               */}
            {/* Button: Animated via GSAP ScrollTrigger */}
            <div className={`absolute bottom-10 left-0 right-0 px-8 transition-opacity duration-500
 ${activeImage === index ? 'opacity-100' : 'opacity-50'}`}>
              <button className="shop-now-btn flex items-center justify-between w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Shop Now
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandCard;