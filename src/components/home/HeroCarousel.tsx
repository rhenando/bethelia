import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

export default function HeroCarousel() {
  const slides = [
    {
      id: 1,
      image: "/slide1.png",
      link: "/deals",
    },
    {
      id: 2,
      image: "/slide2.png",
      link: "/deals",
    },
    {
      id: 3,
      image: "/slide3.png",
      link: "/deals",
    },
  ];

  return (
    <section className='relative w-full overflow-hidden'>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className='heroSwiper'
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.link} className='block w-full h-full'>
              <div className='w-full h-[45vh] md:h-[55vh] flex items-center justify-center bg-black'>
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className='w-full h-full object-contain md:object-cover'
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
