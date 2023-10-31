// import { useEffect, useRef } from 'react'
// import { register } from 'swiper/element/bundle'
// import {
//   Autoplay,
//   EffectCards,
//   Keyboard,
//   Navigation,
//   Pagination,
// } from 'swiper/modules'

// export function CardSwiper(props) {
//   const swiperRef = useRef(null)
//   const nextRef = useRef(null)
//   const prevRef = useRef(null)
//   const { children, ...rest } = props

//   useEffect(() => {
//     // Register Swiper web component
//     register()

//     // pass component props to parameters
//     const params = {
//       ...rest,
//       speed: 500,
//       effect: 'cards',
//       grabCursor: true,
//       modules: [EffectCards, Navigation, Pagination, Autoplay, Keyboard],
//       navigation: {
//         nextEl: nextRef.current,
//         prevEl: prevRef.current,
//       },
//       // autoplay: {
//       //   delay: 1800,
//       //   disableOnInteraction: false,
//       //   pauseOnMouseEnter: true,
//       // },
//       pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//       },
//       loop: true,
//       loopedSlides: 2,
//       keyboard: {
//         enabled: true,
//         onlyInViewport: false,
//       },
//     }

//     // Assign it to swiper element
//     Object.assign(swiperRef.current, params)

//     // initialize swiper
//     swiperRef.current.initialize()

//     // Attach event listeners
//     nextRef.current.addEventListener('click', () =>
//       swiperRef.current.swiper.slideNext()
//     )
//     prevRef.current.addEventListener('click', () =>
//       swiperRef.current.swiper.slidePrev()
//     )
//   }, [])

//   return (
//     <div>
//       <swiper-container init="false" ref={swiperRef}>
//         {children}

//         <div className="swiper-controls">
//           <div className="my-swiper-button-prev" ref={prevRef}>
//             <div className=" slider-arrow left group bg-brand-colour-light hover:bg-brand-accent-3">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 className=" stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 19.5L8.25 12l7.5-7.5"
//                 />
//               </svg>
//             </div>
//           </div>
//           <div className="my-swiper-button-next" ref={nextRef}>
//             <div className=" slider-arrow right group bg-brand-colour-light hover:bg-brand-accent-3">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 className=" stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M8.25 4.5l7.5 7.5-7.5 7.5"
//                 />
//               </svg>
//             </div>
//           </div>
//           <div id="Partner" className="swiper-pagination"></div>
//         </div>
//       </swiper-container>
//     </div>
//   )
// }

// export function SwiperSlide(props) {
//   const { children, ...rest } = props

//   return <swiper-slide {...rest}>{children}</swiper-slide>
// }
