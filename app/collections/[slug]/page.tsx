"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useGSAP } from "@gsap/react";

const SIZES = [
  "UK 3",
  "UK 4",
  "UK 5",
  "UK 6",
  "UK 7",
  "UK 8",
  "UK 9",
  "UK 10",
  "UK 11",
  "UK 12",
];
const FILTERS = [
  "CATEGORY",
  "BRAND",
  "COLLECTION",
  "COLOUR",
  "SIZE",
  "ON SALE",
];

export default function CollectionPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const scope = useRef(null);

  useGSAP(
    () => {
      gsap.from(".product-card", {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="bg-[#F9F8F3] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070"
          alt="Sneakers Header"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
            Sneakers
          </h1>
          <p className="max-w-2xl mt-4 text-sm md:text-base font-medium leading-relaxed opacity-90">
            Step into the culture with our collection of exclusive sneakers from
            brands like Jordan, Nike, ASICS, and Cleens. From classic Air Jordan
            4s to the latest collabs.
          </p>
        </div>
      </div>

      {/* Breadcrumbs & Size Quick-Select */}
      <div className="max-w-[1500px] mx-auto px-6 py-6">
        <nav className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
          HOME • {slug?.replace("-", " ")}
        </nav>

        <div className="flex flex-wrap gap-2 mb-8">
          {SIZES.map((size) => (
            <button
              key={size}
              className="px-5 py-3 bg-[#EAE8E0] hover:bg-black hover:text-white transition-colors text-xs font-bold rounded-sm"
            >
              {size}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-y border-gray-200 py-4 mb-10 gap-4">
          <div className="flex flex-wrap gap-8">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-2 text-xs font-black tracking-tighter hover:opacity-60"
              >
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-gray-400 tracking-tight">
              Showing 78 products
            </span>
            <button className="flex items-center gap-2 text-xs font-black tracking-tighter">
              SORT <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12">
          {/* Repeat this Card 10+ times */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="product-card group flex flex-col cursor-pointer"
            >
              <div className="relative bg-white aspect-[4/5] overflow-hidden rounded-sm flex items-center justify-center p-4">
                <span className="absolute top-3 left-3 bg-[#E60000] text-white text-[10px] font-bold px-2 py-1 z-10">
                  SALE
                </span>
                <Image
                  src={`https://picsum.photos/seed/${i + 10}/400/500`}
                  alt="Product"
                  width={300}
                  height={300}
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 w-full bg-black text-white py-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    DON'T SLEEP!
                  </p>
                  <p className="text-[9px] opacity-80">
                    {i * 2} sold in last few days
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  SAUCONY
                </p>
                <h3 className="text-xs font-bold leading-tight group-hover:underline uppercase tracking-tighter">
                  Saucony ProGrid Triumph 4 'Shadow'
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Available in 6 sizes
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-black text-[#E60000]">
                    £89.99
                  </span>
                  <span className="text-[10px] text-gray-400 line-through font-bold">
                    £169.99
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
