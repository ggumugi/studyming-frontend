import React from 'react'
import styled from 'styled-components'

// 🔥 Mock 데이터 (더미 데이터, 추후 백엔드 데이터로 대체 가능)
const mockScreens = [
   { id: 1, nickname: '사용자1', screenUrl: '/img/camTest1.png' },
   { id: 2, nickname: '사자2', screenUrl: '/img/camTest2.png' },
   { id: 3, nickname: '사용자3', screenUrl: '/img/camTest3.png' },
   { id: 4, nickname: '사용자4', screenUrl: '/img/camTest.png' },
   { id: 5, nickname: '사용자5', screenUrl: '/img/camTest.png' },
   { id: 6, nickname: '사용자6dd', screenUrl: '/img/camTest.png' },
]

const ScreenShare = () => {
   return (
      <Container>
         {mockScreens.map((screen) => (
            <ScreenBox key={screen.id}>
               <ScreenImage src={screen.screenUrl} alt={`${screen.nickname}의 화면`} />
               <Nickname>{screen.nickname}</Nickname>
            </ScreenBox>
         ))}
      </Container>
   )
}

export default ScreenShare

// ⭐ Styled Components
const Container = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr); /* ✅ 2열 */
   grid-template-rows: repeat(3, 1fr); /* ✅ 3행 */
   gap: 16px;
   width: 100%;
   height: 150vh;
   padding: 20px;
`

const ScreenBox = styled.div`
   position: relative;
   display: flex;
   justify-content: center;
   align-items: center;
   border: 2px solid #ddd;
   border-radius: 8px;
   overflow: hidden;
   background-color: #000;
`

const ScreenImage = styled.img`
   width: 100%;
   max-width: 750px;
   height: auto;
   object-fit: cover;
`

const Nickname = styled.div`
   position: absolute;
   bottom: 10px;
   right: 10px;
   background: rgba(0, 0, 0, 0.6);
   color: #fff;
   padding: 10px 15px;
   border-radius: 5px;
   font-size: 14px;
`
