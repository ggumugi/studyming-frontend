import React, { useState } from 'react'
import styled from 'styled-components'

const StudyLeaderExitPending = () => {
   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 상세(탈퇴 보류)</Title>
            <SmallText>위임 신청 처리중</SmallText>
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

         <SubmitButton>스터디 탈퇴취소</SubmitButton>
      </Wrapper>
   )
}

export default StudyLeaderExitPending
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
   justify-content: space-between; /* 양 끝으로 정렬 */
   align-items: flex-start;
   margin-bottom: 30px; /* 제목과 내용 사이 간격 추가 */
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
`
const SmallText = styled.span`
   font-size: 14px;
   color: #999; /* 작은 글씨 색상 */
   align-items: flex-end;
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
