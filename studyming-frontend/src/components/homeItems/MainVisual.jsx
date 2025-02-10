import React from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

// ✅ 캐러셀 데이터 (예제)
const carouselData = [
   { title: '제 23회 가맹거래사 1차 빈자리 원서접수', date: '02 / 12' },
   { title: '변리사 2차 시험 D-3000111111111100000111111111', date: '03 / 15' },
   { title: '공인회계사 CPA 1차 발표', date: '04 / 05' },
]

// ✅ 커스텀 화살표 (왼쪽)
const PrevArrow = ({ onClick }) => (
   <ArrowButton onClick={onClick} left>
      <AiOutlineLeft />
   </ArrowButton>
)

// ✅ 커스텀 화살표 (오른쪽)
const NextArrow = ({ onClick }) => (
   <ArrowButton onClick={onClick} right>
      <AiOutlineRight />
   </ArrowButton>
)

// ✅ Slick 캐러셀 설정
const settings = {
   dots: true,
   infinite: true,
   speed: 500,
   slidesToShow: 1,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 3000,
   prevArrow: <PrevArrow />,
   nextArrow: <NextArrow />,
}

const MainVisual = () => {
   return (
      <MainBanner>
         <StyledSlider {...settings}>
            {carouselData.map((item, index) => (
               <CarouselItem key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.date}</p>
               </CarouselItem>
            ))}
         </StyledSlider>
      </MainBanner>
   )
}

export default MainVisual

/* 🎨 Styled Components */
const MainBanner = styled.div`
   width: 100%;
   height: 200px;
   background-image: url(${process.env.PUBLIC_URL + '/img/mainVisual.png'});
   background-size: cover;
   background-repeat: no-repeat;
   background-position: center;
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   grid-column: span 3;
   padding: 20px;
`

const StyledSlider = styled(Slider)`
   width: 100%;
   max-width: 500px;
   text-align: center;

   .slick-dots {
      bottom: -25px;
   }

   .slick-dots li button:before {
      color: #ffffff;
      font-size: 8px;
      opacity: 0.5;
   }

   .slick-dots li.slick-active button:before {
      color: #ffffff;
      opacity: 1;
      font-size: 13px;
   }
`

const CarouselItem = styled.div`
   h3 {
      font-size: 22px;
      font-weight: bold;
      color: white;
   }
   p {
      font-size: 16px;
      color: white;
      margin: 10px 0;
   }
`

const ArrowButton = styled.button`
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   ${({ left }) => left && 'left: -50px;'}
   ${({ right }) => right && 'right: -50px;'}
   background: transparent;
   color: white;
   border: none;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   font-size: 38px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: 0.3s;

   &:hover {
      background: rgba(0, 0, 0, 0.5);
   }
`
