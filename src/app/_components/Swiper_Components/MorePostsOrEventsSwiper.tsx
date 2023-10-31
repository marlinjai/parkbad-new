import { useEffect, useRef } from 'react'
import { register } from 'swiper/element/bundle'
import { Autoplay, Keyboard, Navigation } from 'swiper/modules'
import Image from 'next/image'

export function ImageFaderSwiper(props) {
  const swiperRef = useRef(null)
  const { children, ...rest } = props

  useEffect(() => {
    register()

    const params = {
      ...rest,
      speed: 3000,
      effect: 'fade', // Fade effect instead of cards
      grabCursor: false,
      modules: [Autoplay, Keyboard],
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        disabledClass: 'disabled_swiper_button',
      },
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
    }

    Object.assign(swiperRef.current, params)
    swiperRef.current.initialize()
  }, [])

  return (
    <div className="my-pz10 px-pz10 md:px-pz20">
      <swiper-container
        className="swiper-container"
        init="false"
        ref={swiperRef}
      >
        {children}
        <div className="swiper-pagination"></div>
      </swiper-container>
    </div>
  )
}

export function SwiperSlide(props) {
  const { src, alt, ...rest } = props

  return (
    <swiper-slide {...rest}>
      <div className="relative h-full w-auto">
        <Image src={src} layout="fill" alt={alt} />
      </div>
    </swiper-slide>
  )
}

export default function ImageFader(props) {
  const { images } = props
  return (
    <ImageFaderSwiper className="fader">
      {images.map((image, index) => (
        <SwiperSlide key={index} src={image.src} alt={image.alt} />
      ))}
    </ImageFaderSwiper>
  )
}
