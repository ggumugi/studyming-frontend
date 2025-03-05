import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

const HeroSection = () => {
   return (
      <Container>
         {/* 📌 배경 텍스트 (첫 번째 줄 - 왼쪽 이동) */}
         <Marquee style={{ top: '-30px' }}>
            <MarqueeInner>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
            </MarqueeInner>
         </Marquee>

         {/* 📌 배경 텍스트 (두 번째 줄 - 오른쪽 이동) */}
         <Marquee style={{ top: '370px' }}>
            <MarqueeInnerReverse>
               <Text $isOutline>STUDYMING</Text>
               <Text $isOutline>STUDYMING</Text>
               <Text $isOutline>STUDYMING</Text>
               <Text $isOutline>STUDYMING</Text>
               <Text $isOutline>STUDYMING</Text>
               <Text $isOutline>STUDYMING</Text>
            </MarqueeInnerReverse>
         </Marquee>

         {/* 📌 배경 텍스트 (세 번째 줄 - 왼쪽 이동) */}
         <Marquee style={{ top: '570px' }}>
            <MarqueeInner>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
               <Text>STUDYMING</Text>
            </MarqueeInner>
         </Marquee>

         {/* 📌 중앙 카드 (앞에 배치) */}
         <Card>
            <Title>
               작심삼일 <span>STOP!</span>
            </Title>
            <SubTitle>
               <strong>스터디밍</strong>과 함께 성장을 시작해보세요
            </SubTitle>
            <Button>
               <Link to="/login">시작하기 →</Link>
            </Button>
            <FooterText>
               스터디밍이 처음이신가요?
               <br />
               <Link>
                  <span>
                     <Link to="/info">소개페이지로 이동 →</Link>
                  </span>
               </Link>
            </FooterText>
         </Card>
      </Container>
   )
}

export default HeroSection

// ⭐ Styled Components
const Container = styled.div`
   position: relative;
   width: 100%;
   height: 950px;
   background-color: #ff7a00;
   display: flex;
   justify-content: center;
   overflow: hidden;
`

// ⬅️ 왼쪽 방향으로 움직이는 애니메이션
const moveLeft = keyframes`
   from {
      transform: translateX(0%);
   }
   to {
      transform: translateX(-100%);
   }
`

// ➡ 오른쪽 방향으로 움직이는 애니메이션 (두 번째 줄만 반대로)
const moveRight = keyframes`
   from {
      transform: translateX(-100%);
   }
   to {
      transform: translateX(0%);
   }
`

const Marquee = styled.div`
   position: absolute;
   width: 100%;
   white-space: nowrap;
   overflow: hidden;
   z-index: 0;
`

// 첫 번째, 세 번째 줄 (왼쪽 이동)
const MarqueeInner = styled.div`
   display: flex;
   gap: 700px;
   animation: ${moveLeft} 30s linear infinite;
`

// 두 번째 줄만 오른쪽 이동
const MarqueeInnerReverse = styled.div`
   display: flex;
   gap: 850px;
   animation: ${moveRight} 30s linear infinite;
`

const Text = styled.div`
   font-size: 200px;
   font-weight: 800;
   text-transform: uppercase;
   color: ${({ $isOutline }) => ($isOutline ? 'transparent' : 'white')}; /* 내부 색상 제거 */
   -webkit-text-stroke: ${({ $isOutline }) => ($isOutline ? '4px white' : 'none')}; /* 테두리 적용 */
`

// 📌 중앙 카드 (앞에 배치되도록 absolute 설정)
const Card = styled.div`
   margin-top: 150px;
   position: absolute;
   background: white;
   padding: clamp(20px, 1vw, 50px) clamp(30px, 10vw, 150px);
   border-radius: 15px;
   text-align: center;
   box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
   z-index: 1;
`

const Title = styled.h1`
   font-size: clamp(20px, 2vw, 36px);
   font-weight: 500;
   span {
      color: #ff7a00;
      font-size: clamp(40px, 5vw, 50px);
      font-weight: clamp(300, 900, 900);

      display: inline-block;
      transform: rotate(5deg);
      color: transparent; /* 글자 내부 색 제거 */
      -webkit-text-stroke: 4px #ff7a00; /* 흰색 테두리 */
   }
`

const SubTitle = styled.p`
   font-size: clamp(20px, 2vw, 36px);
   font-weight: 500;
   strong {
      font-weight: 700;
      font-size: clamp(28px, 2vw, 48px);
      color: #ffa654;
   }
   margin-bottom: 40px;
`

const Button = styled.button`
   background-color: #ff7a00;
   color: white;
   padding: 10px 100px;
   border-radius: 10px;
   border: none;
   font-size: clamp(18px, 2vw, 32px);
   font-weight: 800;
   cursor: pointer;
   transition: 0.2s ease-in-out;
   &:hover {
      background-color: #e56e00;
   }
   margin-bottom: 30px;
`

const FooterText = styled.p`
   text-align: right;
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
   color: gray;
   margin-top: 10px;
   margin-right: clamp(-20px, -5vw, -50px);

   line-height: 1.5;
   span {
      text-decoration: underline;
   }
`
