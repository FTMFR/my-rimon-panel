"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

export function Sliders() {
  return (
    <div className="hidden md:flex hiddebn w-1/2 items-center justify-center bg-[#F8F2F0] relative">
      <div className="absolute z-100 text-white font-medium bottom-[50px] text-xl">
        Capturing Moments, Creating Memories.
      </div>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          renderBullet: (_, className) =>
            `<span class="${className}" style="display:inline-block;width:30px;height:5px;margin:0 4px;border-radius:2px;"></span>`,
        }}
        className="w-full h-full"
      >
        <SwiperSlide className="flex items-center justify-center">
          <Image
            src="/images/one.jpg"
            alt="Slide 1"
            className="object-cover"
            fill
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Image
            src="/images/two.jpg"
            alt="Slide 2"
            className="object-cover"
            fill
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Image
            src="/images/three.jpg"
            alt="Slide 3"
            className="object-cover"
            fill
          />
        </SwiperSlide>
      </Swiper>

      {/* Move this outside Swiper but still inside container */}
      <div className="custom-pagination absolute bottom-8 w-full flex justify-center z-10" />
    </div>
  );
}
