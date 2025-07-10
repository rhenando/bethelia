import React, { useRef, useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function PromoBannerCarousel({ banners }) {
  const timer = useRef();
  const [pause, setPause] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const imageRefs = useRef([]);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    animation: { duration: 1200, easing: (t) => t },
    detailsChanged(s) {
      s.slides.forEach((slide, idx) => {
        const img = imageRefs.current[idx];
        if (img)
          img.style.transform = `translateX(${
            40 * slide.progress
          }px) scale(1.08)`;
      });
      setCurrentSlide(s.track.details.rel);
    },
    created: (slider) => {
      autoplay(slider);
      slider.container.addEventListener("mouseover", () => setPause(true));
      slider.container.addEventListener("mouseout", () => setPause(false));
    },
    dragStarted: () => setPause(true),
    dragEnded: () => setPause(false),
    updated: autoplay,
    animationEnded: autoplay,
  });

  function autoplay(slider) {
    clearTimeout(timer.current);
    if (!pause) timer.current = setTimeout(() => slider?.next(), 3000);
  }

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(
    () => instanceRef.current && autoplay(instanceRef.current),
    [pause]
  );

  imageRefs.current = [];

  return (
    <div className='mx-4 mt-3 mb-0 rounded-xl overflow-hidden'>
      <div ref={sliderRef} className='keen-slider rounded-xl'>
        {banners.map((banner, idx) => (
          <div className='keen-slider__slide flex min-w-full' key={idx}>
            <div
              className={`flex items-center p-4 w-full relative rounded-xl ${banner.bg}`}
            >
              <div className='flex-1'>
                <div className={`text-sm font-medium mb-1 ${banner.color}`}>
                  {banner.title}
                </div>
                <div className={`text-2xl font-bold mb-1 ${banner.color}`}>
                  {banner.subtitle}
                </div>
                <button className='mt-2 px-5 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-opacity-90 transition'>
                  {banner.button}
                </button>
              </div>
              <img
                ref={(el) => (imageRefs.current[idx] = el)}
                src={banner.image}
                alt='model'
                className='h-28 w-20 object-cover rounded-xl ml-2 transition-transform duration-500 will-change-transform'
                style={{ transform: "scale(1.08)" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className='w-full flex justify-center py-2 gap-2'>
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-28 rounded transition-all duration-300 ${
              currentSlide === idx ? "bg-blue-400" : "bg-blue-100"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
