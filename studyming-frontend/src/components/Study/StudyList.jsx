import React from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa' // 아이콘 사용

const StudyListPage = () => {
   const studies = [
      { name: '고시고시 휘팅', participants: '인원 3/4', tags: ['#고시', '#공무원'], type: 'my' },
      { name: '취업캠프', participants: '인원 2/5', tags: ['#취업', '#공무원'], type: 'my' },
      { name: '스피킹 뽀개기', participants: '인원 3/4', tags: ['#영어', '#회화'], type: 'all' },
      { name: '중급반 내신', participants: '인원 4/5', tags: ['#수학', '#내신'], type: 'all' },
      { name: '2026 수능', participants: '인원 2/4', tags: ['#수능', '#영어'], type: 'all' },
      { name: '고등학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all' },
   ]

   return (
      <Wrapper>
         <TitleWrapper>
            <Title>내 스터디</Title>
            <StyledDivider />
         </TitleWrapper>

         <StudyContainer>
            {studies
               .filter((study) => study.type === 'my')
               .map((study, index) => (
                  <StyledCard key={index}>
                     <CardTop>
                        <FaLock />
                        <FaCamera />
                        <FaDesktop />
                        <FaHeart />
                     </CardTop>
                     <CardContent>
                        <Typography variant="h5" component="div">
                           {study.name}
                        </Typography>
                        <Tags>
                           {study.tags.map((tag, i) => (
                              <Tag key={i}>{tag}</Tag>
                           ))}
                        </Tags>
                        <Typography variant="body2" color="textSecondary">
                           {study.participants}
                        </Typography>
                     </CardContent>
                  </StyledCard>
               ))}
         </StudyContainer>

         <TitleWrapper>
            <Title>스터디 목록</Title>
            <StyledDivider />
         </TitleWrapper>

         <StudyContainer>
            {studies
               .filter((study) => study.type === 'all')
               .map((study, index) => (
                  <StyledCard key={index}>
                     <CardTop>
                        <FaLock />
                        <FaCamera />
                        <FaDesktop />
                        <FaHeart />
                     </CardTop>
                     <CardContent>
                        <Typography variant="h5" component="div">
                           {study.name}
                        </Typography>
                        <Tags>
                           {study.tags.map((tag, i) => (
                              <Tag key={i}>{tag}</Tag>
                           ))}
                        </Tags>
                        <Typography variant="body2" color="textSecondary">
                           {study.participants}
                        </Typography>
                     </CardContent>
                  </StyledCard>
               ))}
         </StudyContainer>

         <SearchContainer>
            <TextField label="스터디 검색" variant="outlined" fullWidth />
         </SearchContainer>

         <StyledPagination>
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
            <Button>4</Button>
         </StyledPagination>
      </Wrapper>
   )
}

export default StudyListPage

// Styled Components
const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 20px;
   max-width: 1200px; /* 최대 너비 설정 */
   margin: 0 auto; /* 중앙 정렬 */
`

const TitleWrapper = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column; /* 세로로 배치 */
   align-items: flex-start; /* 왼쪽 정렬 */
   gap: 5px; /* 제목과 선 사이 간격 */
`

const Title = styled.h2`
   font-size: 32px;
   color: black;
   margin: 0; /* 여백 제거 */
   display: inline-block;
`

const StyledDivider = styled.div`
   width: 100%; /* 전체 너비를 차지 */
   border-top: 2px solid #ff7a00; /* 주황색 선 */
`

const StudyContainer = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr); /* 기본 4개의 카드로 설정 */
   gap: 20px;
   width: 100%;
   margin-bottom: 40px;

   // 반응형 웹 설정
   @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr); /* 화면이 작아지면 3개의 카드로 변경 */
   }

   @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr); /* 화면이 더 작아지면 2개의 카드로 변경 */
   }

   @media (max-width: 600px) {
      grid-template-columns: 1fr; /* 화면이 아주 작아지면 1개 카드로 변경 */
   }
`

const StyledCard = styled(Card)`
   width: 100%;
   height: 206px;
   margin: 20px 0;
   border-radius: 10px;
   position: relative;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;
   padding: 10px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const CardTop = styled.div`
   position: absolute;
   top: 10px;
   left: 10px;
   right: 10px;
   display: flex;
   justify-content: space-between;
   font-size: 20px;
   color: #ff7a00;
`

const Tags = styled.div`
   margin-top: 10px;
   display: flex;
   gap: 10px;
   flex-wrap: wrap;
   justify-content: center;
`

const Tag = styled.span`
   background-color: #ff7a00;
   color: white;
   padding: 5px 10px;
   border-radius: 15px;
   font-size: 12px;
`

const SearchContainer = styled.div`
   width: 100%;
   margin-top: 20px;
   margin-bottom: 40px;
`

const StyledPagination = styled.div`
   display: flex;
   justify-content: center;
   gap: 10px;
   margin-bottom: 40px;
   button {
      color: black;
      padding: 10px 20px;
      cursor: pointer;
   }
`
