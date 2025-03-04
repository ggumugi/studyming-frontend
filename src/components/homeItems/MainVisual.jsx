import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchPostsThunk } from '../../features/postSlice'

import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

// ✅ 캐러셀 데이터 (예제)
/* 타이틀 최대 40자.  
안그러면 줄넘어가고 간격 이상해짐 */

// ✅ 커스텀 화살표 (왼쪽)
const PrevArrow = ({ onClick }) => (
   <ArrowButton onClick={onClick} $left>
      <AiOutlineLeft />
   </ArrowButton>
)

// ✅ 커스텀 화살표 (오른쪽)
const NextArrow = ({ onClick }) => (
   <ArrowButton onClick={onClick} $right>
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
   const dispatch = useDispatch()
   const { posts, loading } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk({ page: 1, category: 'noti', limit: 5 }))
   }, [dispatch])

   return (
      <MainBanner>
         {loading ? (
            <p>로딩 중...</p>
         ) : (
            <StyledSlider {...settings}>
               {posts.length > 0 ? (
                  posts.map((item, index) => (
                     <CarouselItem key={index}>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                     </CarouselItem>
                  ))
               ) : (
                  <p>공지사항이 없습니다.</p>
               )}
            </StyledSlider>
         )}
      </MainBanner>
   )
}

export default MainVisual

/* 🎨 Styled Components */
const MainBanner = styled.div`
   width: 90%;
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
      opacity: 0.3;
   }

   .slick-dots li.slick-active button:before {
      color: #ffffff;
      opacity: 1;
      font-size: 8px;
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
   ${({ $left }) => $left && 'left: -50px;'}
   ${({ $right }) => $right && 'right: -50px;'}
   background: transparent;
   color: white;
   border: none;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   font-size: 28px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: 0.3s;

   /* 왼쪽 화살표 */
   ${({ $left }) => $left && `left: clamp(5px, 4vw, -50px);`}

   /* 오른쪽 화살표 */
   ${({ $right }) => $right && `right: clamp(5px, 4vw, -50px);`}
   
   &:hover {
      background: rgba(255, 255, 255, 0.2);
   }
`
