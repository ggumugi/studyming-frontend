import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const StudyListPage = () => {
   //더미데이터를 이용해 카드섹션에 출력
   //반응형 구현 완
   //백엔드 api 연결 할 떄 검색 시 일치하는 그룹이없으면 일치하는 그룹이없습니다 화면에 띄우는 기능 구현
   //페이지네이션,이모티콘 누를 시 좋아요,좋아요 순 그룹정렬,드롭다운으로 제목/해시태그 선택(삭제될 수도.,...) 후 검색기능 백엔드 구현 후 구현예정
   //캠,잠금방,화면공유 유무에 따라 왼쪽 위 모니터,카메라,자물쇠 로고 활성/비활성화 백엔드 구현 후 구현예정
   const [searchQuery, setSearchQuery] = useState('')
   const [searchOption, setSearchOption] = useState('title') // 'title' or 'hashtag'

   // ✅ 상태관리
   const [searchType, setSearchType] = useState('title') // 검색 기준 (제목 or 해시태그)
   const [searchTerm, setSearchTerm] = useState('') // 검색어
   const [filteredStudies2, setFilteredStudies2] = useState([]) // 검색 결과

   // ✅ 검색 실행 함수
   const handleSearch = () => {
      let filteredResults = []

      if (searchType === 'title') {
         // 제목으로 검색
         filteredResults = studies.filter((study) => study.name.includes(searchTerm))
      } else if (searchType === 'hashtag') {
         // 해시태그로 검색
         filteredResults = studies.filter((study) => study.tags.some((tag) => tag.includes(searchTerm)))
      }

      setFilteredStudies2(filteredResults)
   }

   const studies = [
      { name: '고시고시 휘팅', participants: '인원 3/4', tags: ['#고시', '#공무원'], type: 'my' },
      { name: '취업캠프', participants: '인원 2/5', tags: ['#취업', '#공무원'], type: 'my' },
      { name: '스피킹 뽀개기', participants: '인원 3/4', tags: ['#영어', '#회화'], type: 'all' },
      { name: '중급반 내신', participants: '인원 4/5', tags: ['#수학', '#내신'], type: 'all' },
      { name: '2026 수능', participants: '인원 2/4', tags: ['#수능', '#영어'], type: 'all' },
      { name: '고등학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all' },
      { name: '중학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all' },
      { name: '간호사 국가고시', participants: '인원 5/5', tags: ['#간호사', '#국가고시'], type: 'all' },
      { name: '중간고사 죽겠다', participants: '인원 5/5', tags: ['#중간고사', '#a학점'], type: 'all' },
      { name: '한식조리기능사', participants: '인원 5/5', tags: ['#요리', '#배고파요'], type: 'all' },
   ]

   // 필터링 함수
   const filteredStudies = studies.filter((study) => {
      if (searchOption === 'title') {
         return study.name.toLowerCase().includes(searchQuery.toLowerCase())
      } else {
         return study.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      }
   })
   const navigate = useNavigate() // useNavigate 훅을 사용하여 페이지 이동 함수 생성

   // 스터디 등록 버튼 클릭 시 호출되는 함수
   const handleStudyCreateClick = () => {
      navigate('/study/create') // '/study-create' 페이지로 이동
   }

   //페이지네이션 함수(백엔드 구현 후  api 호출해와 실제로 페이지네이션 구현 가능)
   const [currentPage, setCurrentPage] = useState(1)

   const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber)
      console.log(`현재 페이지: ${pageNumber}`)
   }

   return (
      <Wrapper>
         <Header>
            <Title>내 스터디</Title>
            <StyledAddStudyButton onClick={handleStudyCreateClick}>스터디 등록</StyledAddStudyButton>
         </Header>
         <StyledDivider />

         <StudyContainer>
            {filteredStudies
               .filter((study) => study.type === 'my')
               .map((study, index) => (
                  <StyledCard key={index}>
                     <CardTop>
                        <FaLock />
                        <FaCamera />
                        <FaDesktop />
                     </CardTop>
                     <HeartIcon>
                        <FaHeart />
                     </HeartIcon>
                     <CardContent>
                        <TitleText>{study.name}</TitleText>
                        <TagContainer>
                           {study.tags.map((tag, i) => (
                              <Tag key={i}>{tag}</Tag>
                           ))}
                        </TagContainer>
                        <Participants>{study.participants}</Participants>
                     </CardContent>
                  </StyledCard>
               ))}
         </StudyContainer>

         <TitleWrapper>
            <Title>스터디 목록</Title>
         </TitleWrapper>
         <StyledDivider />

         <StudyContainer2>
            {filteredStudies
               .filter((study) => study.type === 'all')
               .map((study, index) => (
                  <StyledCard key={index}>
                     <CardTop>
                        <FaLock />
                        <FaCamera />
                        <FaDesktop />
                     </CardTop>
                     <HeartIcon>
                        <FaHeart />
                     </HeartIcon>
                     <CardContent>
                        <TitleText>{study.name}</TitleText>
                        <TagContainer>
                           {study.tags.map((tag, i) => (
                              <Tag key={i}>{tag}</Tag>
                           ))}
                        </TagContainer>
                        <Participants>{study.participants}</Participants>
                     </CardContent>
                  </StyledCard>
               ))}
         </StudyContainer2>

         <StyledPagination>
            <Button onClick={() => handlePageClick(1)}>1</Button>
            <Button onClick={() => handlePageClick(2)}>2</Button>
            <Button onClick={() => handlePageClick(3)}>3</Button>
            <Button onClick={() => handlePageClick(4)}>4</Button>
         </StyledPagination>

         <SearchContainer>
            <Dropdown value={searchType} onChange={(e) => setSearchType(e.target.value)}>
               <option value="title">제목</option>
               <option value="hashtag">해시태그</option>
            </Dropdown>
            <SearchInput type="text" placeholder="검색어를 입력하세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
         </SearchContainer>
      </Wrapper>
   )
}

export default StudyListPage

// Styled Components

const Title = styled.h2`
   font-size: 24px; /* 글자 크기 줄임 */
   margin: 0; /* 여백 제거 */
`

const TitleWrapper = styled.div`
   width: 100%;
   display: flex;
   justify-content: space-between; /* 양쪽 끝에 배치 */
   align-items: center; /* 텍스트와 버튼을 세로 중앙 정렬 */
   margin-bottom: 10px; /* 필요에 따라 간격 조정 */
`

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 20px;
   max-width: 1200px;
   margin: 0 auto;
`

const Header = styled.div`
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
`

const StyledAddStudyButton = styled.button`
   padding: 10px 20px;
   background-color: #ff7a00;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;
   height: 40px; /* 버튼 높이 조정 */
`
const StyledDivider = styled.div`
   width: 100%;
   border-top: 2px solid #ff7a00;
   margin-top: 10px; /* 제목과의 간격 */
`

const StudyContainer = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: 20px;
   width: 100%;
   margin-bottom: 40px;

   @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
   }

   @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
   }

   @media (max-width: 600px) {
      grid-template-columns: 1fr;
   }
`

const StudyContainer2 = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 2fr);
   gap: 20px;
   width: 100%;
   margin-bottom: 40px;
   @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
   }

   @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
   }

   @media (max-width: 600px) {
      grid-template-columns: 1fr;
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
   display: flex;
   gap: 10px;
   font-size: 20px;
   color: #ff7a00;
`

const HeartIcon = styled.div`
   position: absolute;
   top: 10px;
   right: 10px;
   font-size: 20px;
   color: #ff7a00;
`

const TitleText = styled.h3`
   font-size: 18px;
   font-weight: bold;
   margin-top: 40px;
   margin-bottom: 10px;
`

const TagContainer = styled.div`
   display: flex;
   justify-content: center;
   gap: 10px;
   flex-wrap: wrap;
   margin-bottom: 10px;
`

const Tag = styled.span`
   background-color: #ff7a00;
   color: white;
   padding: 5px 10px;
   border-radius: 15px;
   font-size: 12px;
`

const Participants = styled.div`
   position: absolute;
   bottom: 10px;
   left: 10px;
   font-size: 14px;
   color: gray;
`

const SearchContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 10px;
   width: 100%;
   margin: 0 auto 40px auto;
`

const Dropdown = styled.select`
   padding: 10px;
   font-size: 14px;
   border: 1px solid #ff7a00;
   border-radius: 4px;
   outline: none;
   cursor: pointer;
`

const SearchInput = styled.input`
   padding: 10px;
   font-size: 14px;
   width: 500px;
   max-width: 100%;
   border: 1px solid #ff7a00;
   border-radius: 4px;
   outline: none;
`

const SearchButton = styled.button`
   padding: 10px 20px;
   background-color: #e76f00;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;
   &:hover {
      background-color: #ff7a00;
   }
`
const ResultsContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 15px;
   width: 100%;
   max-width: 600px;
`

const NoResults = styled.p`
   font-size: 16px;
   color: gray;
   text-align: center;
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
