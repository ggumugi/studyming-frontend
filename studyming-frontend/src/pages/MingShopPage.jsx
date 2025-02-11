import React from 'react'
import styled from 'styled-components'

const MingShopPage = () => {
   const items = [
      { id: 1, title: '채팅방 당근 세트', description: '주황색 채팅방 테마', date: '5일 남음', img: '/img/carrot.png' },
      { id: 2, title: '채팅방 토마토 세트', description: '빨간색 채팅방 테마', date: '5일 남음', img: '/img/tomato.png' },
      { id: 3, title: '채팅방 가지 세트', description: '보라색 채팅방 테마', date: '5일 남음', img: '/img/eggplant.png' },
      { id: 4, title: '채팅방 자색고구마 세트', description: '핑크색 채팅방 테마', date: '5일 남음', img: '/img/sweetpotato.png' },
      { id: 5, title: '백색소음 white 테마', description: '공부 집중용 앰비언스 테마', date: '5일 남음', img: '/img/whitenoise.png' },
      { id: 6, title: '뽀모도로 타이머 세트', description: '25분 집중용 타이머', date: '5일 남음', img: '/img/timer.png' },
      { id: 7, title: '흔내는 토끼콘 (GIF)', description: '엉덩이 때려주는 토끼 이모티콘', date: '5일 남음', img: '/img/tornado.gif' },
      { id: 8, title: '악령 물러가라콘 (GIF)', description: '소금으로 잡생각을 물리치는 이모티콘', date: '5일 남음', img: '/img/salt.gif' },
   ]

   return (
      <Container>
         <ItemGrid>
            {items.map((item) => (
               <ItemCard key={item.id}>
                  <ImageWrapper>
                     <ItemImage src={item.img} alt={item.title} /> {/* 이미지 경로는 직접 입력 */}
                  </ImageWrapper>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemDescription>{item.description}</ItemDescription>
                  <ItemDate>{item.date}</ItemDate>
               </ItemCard>
            ))}
         </ItemGrid>
      </Container>
   )
}

export default MingShopPage

// Styled Components
const Container = styled.div`
   padding: 50px;
`

const ItemGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr); /* 한 줄에 네 개씩 */
   gap: 20px;
`

const ItemCard = styled.div`
   background-color: #fff; /* 흰색 배경 */
   border-radius: 8px;
   padding: 20px;
   text-align: center;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 300px; /* 아이템 카드 고정 높이 설정 */
`

const ImageWrapper = styled.div`
   width: 100%;
   height: 200px; /* 고정된 이미지 높이 */
   margin-bottom: 10px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
   border-radius: 16px; /* 부드러운 곡선 */
   overflow: hidden;
`

const ItemImage = styled.img`
   width: 100%;
   height: 100%;
   object-fit: contain; /* 이미지를 잘라서 박스에 맞게 크기 조정 */
   transform: scale(0.6);
`

const ItemTitle = styled.h3`
   font-size: 18px;
   margin-bottom: 5px;
`

const ItemDescription = styled.p`
   font-size: 14px;
   color: #999;
   margin-bottom: 5px;
`

const ItemDate = styled.p`
   font-size: 12px;
   color: #999;
`
