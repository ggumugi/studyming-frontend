import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'

const StudyListPage = () => {
   const [studies, setStudies] = useState([
      { name: '고시고시 휘팅', participants: '인원 3/4', tags: ['#고시', '#공무원'], type: 'my' },
      { name: '취업캠프', participants: '인원 2/5', tags: ['#취업', '#공무원'], type: 'my' },
      { name: '스피킹 뽀개기', participants: '인원 3/4', tags: ['#영어', '#회화'], type: 'all' },
      { name: '중급반 내신', participants: '인원 4/5', tags: ['#수학', '#내신'], type: 'all' },
      { name: '2026 수능', participants: '인원 2/4', tags: ['#수능', '#영어'], type: 'all' },
      { name: '고등학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all' },
   ])

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
   justify-content: flex-start;
   align-items: center;
`

const Title = styled.h2`
   font-size: 32px;
   color: black;
   margin-bottom: 20px;
   line-height: 1.2; /* 줄 간격 조정 */
   font-family: 'Noto Sans KR', sans-serif; /* 한글 폰트 지정 */
   display: inline-block; /* 텍스트가 제대로 배치되도록 수정 */
`
const StyledDivider = styled.div`
   border-top: 2px solid #ff7a00;
   margin: 20px 0;
   width: 100%; /* 주황선이 전체 너비로 적용되도록 */
`

const StudyContainer = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
   justify-content: flex-start;
   width: 100%;
`

const StyledCard = styled(Card)`
   width: 22%; /* 카드 크기를 줄여서 한 줄에 4개씩 */
   height: 206px;
   margin-bottom: 20px;
   border-radius: 10px;
   position: relative;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;
   padding: 10px;
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
