"use client";

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  oldPrice?: string;
  images: string[];
  tag?: string;
  subTag?: string;
  sale: boolean;
}

// Generating 10 mock products
const products: Product[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  brand: i % 2 === 0 ? "ESSENTIALS" : "DENIM TEARS",
  name: i % 2 === 0 
    ? "Fear Of God Essentials Hoodie 'Light Oatmeal'" 
    : "The Cotton Wreath Shorts 'Black'",
  price: i % 2 === 0 ? "£95.00" : "£169.99",
  oldPrice: i % 2 === 0 ? undefined : "£239.99",
  images: [
    `https://picsum.photos/seed/product${i}-1/600/800`, // Main Image
    `https://picsum.photos/seed/product${i}-2/600/800`, // Hover Image
  ],
  tag: i === 0 ? "SELLING FAST!" : i === 2 ? "DON'T SLEEP!" : undefined,
  subTag: i === 0 ? "Last sold 46 minutes ago" : i === 2 ? "19 sold recently" : undefined,
  sale: true,
}));

const ProductCard = ({ product }: { product: Product }) => {
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="product-card group flex flex-col cursor-pointer">
      {/* Image Container */}
      <div 
        className="relative bg-[#F5F5F3] aspect-[4/5] overflow-hidden rounded-sm"
        onMouseEnter={() => setCurrentImg(1)}
        onMouseLeave={() => setCurrentImg(0)}
      >
        {product.sale && (
          <span className="absolute top-3 left-3 bg-[#E60000] text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">
            SALE
          </span>
        )}

        {/* Hover Action Button (+) */}
        <button className="absolute bottom-4 right-4 z-20 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
          <span className="text-2xl font-light">+</span>
        </button>

        <img
          src={product.images[currentImg]}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply transition-opacity duration-500"
        />

        {/* Urgency Status Bar */}
        {product.tag && (
          <div className="absolute bottom-0 w-full bg-black text-white py-2 px-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-tight">{product.tag}</p>
            <p className="text-[9px] opacity-70">{product.subTag}</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-4 space-y-1 px-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 min-h-[36px] group-hover:underline">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 font-medium">Available in 3 sizes</p>
        
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-bold text-[#E60000]">{product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProductSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(".product-card", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full max-w-[1600px] mx-auto px-6 py-24 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Hot Right Now</h2>
        <button className="bg-black text-white px-8 py-3.5 rounded-md text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center gap-3">
          Shop The Collection 
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Grid: 5 columns on desktop, 3 on tablet, 2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}