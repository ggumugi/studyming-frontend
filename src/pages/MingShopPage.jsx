import React from 'react'
import styled from 'styled-components'
import ItemList from '../components/shop/ItemList'

const MingShopPage = () => {
   const items = [
      { id: 1, title: '50밍', detail: '50밍 구매', price: '500', img: '/img/50ming.png', limit: null, type: 'cash' },
      { id: 2, title: '150밍', detail: '150밍 구매', price: '1400', img: '/img/150ming.png', limit: null, type: 'cash' },
      { id: 3, title: '250밍', detail: '250밍 구매', price: '2300', img: '/img/250ming.png', limit: null, type: 'cash' },
      { id: 4, title: '550밍', detail: '550밍 구매', price: '4500', img: '/img/550ming.png', limit: null, type: 'cash' },
      { id: 5, title: '웃는 토끼 콘', detail: '진심을 다해 응원하는 토끼 이모티콘', price: '100', img: '/img/sebin.png', limit: 7, type: 'emoticon' },
      { id: 6, title: '소금뿌리는 토끼 콘 (GIF)', detail: '소금을 뿌려 액운을 막아주는 토끼 이모티콘', price: '100', img: '/img/salt.gif', limit: 7, type: 'emoticon' },
      { id: 7, title: '혼내는 토끼 콘1 (GIF)', detail: '거대당근으로 혼내주는 토끼 이모티콘', price: '100', img: '/img/carrotsmash.gif', limit: 7, type: 'emoticon' },
      { id: 8, title: '혼내는 토끼 콘2 (GIF)', detail: '회전 회오리로 혼내주는 토끼 이모티콘', price: '100', img: '/img/tornado.gif', limit: 7, type: 'emoticon' },
      { id: 9, title: '보라돌이 이모티콘', detail: '텔레토비 보라돌이의 안녕 이모티콘', price: '100', img: '/img/purple.png', limit: 7, type: 'emoticon' },
      { id: 10, title: '뚜비 이모티콘', detail: '텔레토비 뚜비의 안녕 이모티콘', price: '100', img: '/img/green.png', limit: 7, type: 'emoticon' },
      { id: 11, title: '나나 이모티콘', detail: '텔레토비 나나의 안녕 이모티콘', price: '100', img: '/img/yellow.png', limit: 7, type: 'emoticon' },
      { id: 12, title: '뽀 이모티콘', detail: '텔레토비 뽀의 안녕 이모티콘', price: '100', img: '/img/red.png', limit: 7, type: 'emoticon' },
      { id: 13, title: '채팅방 당근 세트', detail: '주황주황 채팅방 테마~', price: '100', img: '/img/carrot.png', limit: 7, type: 'decoration' },
      { id: 14, title: '채팅방 토마토 세트', detail: '빨강빨강 채팅방 테마~', price: '100', img: '/img/tomato.png', limit: 7, type: 'decoration' },
      { id: 15, title: '채팅방 가지 세트', detail: '보라보라 채팅방 테마~', price: '100', img: '/img/eggplant.png', limit: 7, type: 'decoration' },
      { id: 16, title: '채팅방 자색고구마 세트', detail: '핑크핑크 채팅방 테마~', price: '100', img: '/img/sweetpotato.png', limit: 7, type: 'decoration' },
      { id: 17, title: '백색소음', detail: 'comming soon~', price: '100', img: '/img/whitenoise.png', limit: 7, type: 'studytool' },
      { id: 18, title: '뽀모도로 타이머', detail: 'comming soon~', price: '100', img: '/img/timer.png', limit: 7, type: 'studytool' },
   ]
   const titleList = ['이 모든 매력적인 상품을 쉽고 빠르게 구매할 수 있는 방법', '채팅방의 인싸템! 이모티콘', '삭막한 채팅창에 활력을! 채팅창 꾸미기', '이것만 있다면 당신도 될 수 있다 공부왕!']

   return (
      <Container>
         <Title>{titleList[0]}</Title>
         <ItemList items={items.filter((item) => item.type === 'cash')} />
         <Title>{titleList[1]}</Title>
         <ItemList items={items.filter((item) => item.type === 'emoticon')} />
         <Title>{titleList[2]}</Title>
         <ItemList items={items.filter((item) => item.type === 'decoration')} />
         <Title>{titleList[3]}</Title>
         <ItemList items={items.filter((item) => item.type === 'studytool')} />
      </Container>
   )
}

export default MingShopPage

// Styled Components
const Container = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 50px;
   width: 100%;
`

const Title = styled.h2`
   width: 100%; /* 컨테이너의 전체 길이 */
   max-width: 1200px; /* 최대 너비 설정 */
   text-align: left; /* 왼쪽 정렬 */
   font-weight: 300;
   font-size: 32px;
   border-bottom: 2px solid #ff7a00;
   padding-bottom: 10px;
   margin-bottom: 40px; /* 아이템과 간격 추가 */
`

const ItemGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr); /* 한 줄에 네 개씩 */
   gap: 20px;
   max-width: 1200px; /* 최대 너비 설정 */
   width: 100%;
   margin: 0 auto; /* 가운데 정렬 */
   margin-bottom: 50px; /* 다음 title과 간격 추가 */
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
   max-width: 325px;
`

const ImageWrapper = styled.div`
   width: 100%;
   max-width: 280px;
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
