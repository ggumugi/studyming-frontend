import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const StudyDetail = () => {
   //조건부렌더링으로 가입전,가입후(일반회원),방장에게 보이는 버튼 화면만 구현!

   // 더미 데이터로 가입 상태 설정 (나중에 백엔드에서 받아올 데이터)
   //api 받아온 후 axios로 하면 됨 아마.

   const [userStatus, setUserStatus] = useState('leader')
   // guest = 가입 전, member = 가입 후, leader = 방장

   // 스터디 수정(방장일 때 나타남)버튼 클릭 시 호출되는 함수
   const navigate = useNavigate() // useNavigate 훅을 사용하여 페이지 이동 함수 생성

   const handleStudyCreateClick = () => {
      navigate('/study/edit/id') // '/study-create' 페이지로 이동
   }
   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 상세</Title>
            <StyledDivider />
         </TitleContainer>

         <Content>
            <DetailRow>
               <LabelText>스터디 이름</LabelText>
               <DetailText>스페셜 빡쟁이들</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>공개여부</LabelText>
               <DetailText>공개</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>해시태그</LabelText>
               <TagContainer>
                  <Tag># 태그</Tag>
                  <Tag># 해시태그</Tag>
               </TagContainer>
            </DetailRow>

            <DetailRow>
               <LabelText>기간</LabelText>
               <DetailText>25.01.30 ~ 25.02.30</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>목표 시간</LabelText>
               <DetailText>1시간</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>접속 시간대</LabelText>
               <DetailText>09:00 ~ 20:00</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>상벌점 기능</LabelText>
               <DetailText>미적용</DetailText>
            </DetailRow>

            <DetailRow>
               <LabelText>스터디 에티켓</LabelText>
               <EtiquetteText>
                  공무원 자율 스터디입니다.
                  <br />
                  누구나 함께 공부하며 스터디 친구를 사귈 수 있어요^^
                  <br />
                  해당 스터디룸은 스터디밍에서 개설한 스터디로, 입장한 지 3일 이상 경과된 상태에서 카메라 출석이 되고 있지 않다면 발견되는 즉시 무통보 강제 퇴장 조치를 진행할 수 있습니다.
               </EtiquetteText>
            </DetailRow>
         </Content>

         {/* 조건부 렌더링: 가입 상태에 따라 다른 버튼 표시 */}
         {userStatus === 'guest' && <SubmitButton>스터디 가입하기</SubmitButton>}
         {userStatus === 'member' && <SubmitButton2>스터디 탈퇴하기</SubmitButton2>}
         {/*수정버튼 누를 때 study/edit/:id로 이어지게 하기 */}
         {userStatus === 'leader' && <SubmitButton onClick={handleStudyCreateClick}>스터디 정보 수정하기</SubmitButton>}
         {userStatus === 'leader' && <SubmitButton2>스터디 탈퇴하기</SubmitButton2>}
      </Wrapper>
   )
}

export default StudyDetail
const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center; /* 중앙 정렬 */
   align-items: center;
   min-height: 100vh;
   padding: 40px;
   width: 100%;
   max-width: 800px; /* 적절한 최대 너비 유지 */
   margin: 0 auto; /* 좌우 중앙 정렬 */

   @media (max-width: 768px) {
      padding: 20px;
      width: 95%;
   }
`

const TitleContainer = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   margin-bottom: 30px; /* 제목과 내용 사이 간격 추가 */
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
`

const StyledDivider = styled.div`
   width: 100%;
   height: 3px;
   background-color: #ff7a00;
   margin-bottom: 20px;
`

const Content = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const DetailRow = styled.div`
   display: flex;
   justify-content: flex-start; /* 기존 space-between에서 변경 */
   align-items: center;
   gap: 20px;
   width: 100%;
   margin-bottom: 20px; /* 항목 간 간격 추가 */

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }
`

const LabelText = styled.span`
   flex: 0 0 150px;
   font-size: 16px;
   font-weight: bold;
   text-align: left;
`

const DetailText = styled.span`
   font-size: 16px;
   color: #333;
   text-align: left;
   flex: 1;
`

const TagContainer = styled.div`
   display: flex;
   gap: 10px;
`

const Tag = styled.span`
   background-color: #f3f3f3;
   padding: 5px 10px;
   border-radius: 5px;
   font-size: 14px;
   color: #555;
`

const EtiquetteText = styled.p`
   font-size: 14px;
   line-height: 1.5;
   color: #666;

   padding: 10px;
   border-radius: 5px;
`

const SubmitButton = styled.button`
   padding: 12px 20px;
   background-color: #ff7a00;
   color: white;
   font-size: 16px;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 30px; /* 버튼과 마지막 항목 사이 간격 추가 */
   width: 70%;

   &:hover {
      background-color: #e66e00;
   }
`

const SubmitButton2 = styled.button`
   font-size: 14px;
   color: #ff7a00;
   text-decoraiton: under;
   background-color: transparent;
   border: 1px solid transparent;
   border-radius: 4px;
   margin-top: 20px;
   padding: 8px 16px;
   cursor: pointer;

   &:hover {
      background-color: #f0f0f0;
      border-color: #ccc;
   }
`
