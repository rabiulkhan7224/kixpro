"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    id: 1,
    title: "5 Stars",
    content: "Love it",
    author: "Michael",
    initials: "M",
    date: "1 month ago",
  },
  {
    id: 2,
    title: "Great Experiences",
    content: "By far the best service you can ask for. Very helpful and attentive. Thanks again",
    author: "Anton L.",
    initials: "AL",
    date: "1 month ago",
    verified: true,
    helpfulCount: 4
  },
  {
    id: 3,
    title: "Mr Corbett",
    content: "Very good delivery and great product will be buying from again",
    author: "Charlie C.",
    initials: "CC",
    date: "1 month ago",
    verified: true
  },
  {
    id: 4,
    title: "Highly Recommend",
    content: "The quality of the hoodie is unmatched. Fast shipping to the UK.",
    author: "Sarah J.",
    initials: "SJ",
    date: "2 weeks ago",
    verified: true
  }
];

export default function Reviews() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".review-card-anim", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-[#F3F1E9] py-24 px-6 md:px-10">
      <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-tight italic">
        Recognized by Culture Makers
      </h2>

      <div className="max-w-[1400px] mx-auto relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((rev) => (
              <CarouselItem key={rev.id} className="pl-4 md:basis-1/2 lg:basis-1/3 review-card-anim">
                <Card className="border-none shadow-sm rounded-sm overflow-hidden h-full min-h-[380px]">
                  <CardContent className="p-8 flex flex-col justify-between h-full bg-white">
                    {/* Top Section: Stars & Date */}
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex text-black text-xl tracking-tighter">★★★★★</div>
                        <span className="text-gray-400 text-[12px] font-medium uppercase tracking-wider">
                          {rev.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-3 tracking-tight">{rev.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        "{rev.content}"
                      </p>
                    </div>

                    {/* Bottom Section: Author Info */}
                    <div className="mt-10 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#EAE8E0] flex items-center justify-center font-bold text-xs">
                            {rev.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold flex items-center gap-1.5">
                              {rev.author}
                              {rev.verified && (
                                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Buyer</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-gray-400 text-[11px] font-bold">
                          <button className="flex items-center gap-1 hover:text-black transition-colors underline underline-offset-4">
                            Helpful? 👍 {rev.helpfulCount || 0}
                          </button>
                          <button className="flex items-center gap-1 hover:text-black transition-colors underline underline-offset-4">
                            👎 0
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 opacity-50">
                         <img src="/verified-by-shop.png" alt="Verified" className="h-4 object-contain" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation controls positioned at the edges */}
          <div className="hidden lg:block">
            <CarouselPrevious className="absolute -left-12 border-none bg-transparent hover:bg-transparent" />
            <CarouselNext className="absolute -right-12 border-none bg-transparent hover:bg-transparent" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}