import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const StudyListPage = () => {
   //더미데이터를 이용해 카드섹션에 출력
   //반응형 구현 완
   //검색기능

   //페이지네이션 함수만 만듬
   //캠,잠금방,화면공유 유무에 따라 왼쪽 위 모니터,카메라,자물쇠 로고 활성,좋아요 기능 조건부로 임시적으로 렌더링

   const studies = [
      { name: '고시고시 휘팅', participants: '인원 3/4', tags: ['#고시', '#공무원'], type: 'my', locked: true, camera: false, screenShare: true, liked: true },
      { name: '취업캠프', participants: '인원 2/5', tags: ['#취업', '#공무원'], type: 'my', locked: false, camera: true, screenShare: false, liked: true },
      { name: '스피킹 뽀개기', participants: '인원 3/4', tags: ['#영어', '#회화'], type: 'all', locked: true, camera: true, screenShare: true, liked: false },
      { name: '중급반 내신', participants: '인원 4/5', tags: ['#수학', '#내신'], type: 'all', locked: false, camera: false, screenShare: false, liked: false },
      { name: '2026 수능', participants: '인원 2/4', tags: ['#수능', '#영어'], type: 'all', locked: true, camera: false, screenShare: true, liked: true },
      { name: '고등학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all', locked: false, camera: true, screenShare: false, liked: false },
      { name: '중학교 내신', participants: '인원 5/5', tags: ['#내신', '#영어'], type: 'all', locked: true, camera: true, screenShare: true, liked: true },
      { name: '간호사 국가고시', participants: '인원 5/5', tags: ['#간호사', '#국가고시'], type: 'all', locked: false, camera: false, screenShare: false, liked: false },
      { name: '중간고사 죽겠다', participants: '인원 5/5', tags: ['#중간고사', '#a학점'], type: 'all', locked: true, camera: false, screenShare: true, liked: false },
      { name: '한식조리기능사', participants: '인원 5/5', tags: ['#요리', '#배고파요'], type: 'all', locked: false, camera: true, screenShare: false, liked: false },
   ]

   const [searchQuery, setSearchQuery] = useState('')
   const [searchOption, setSearchOption] = useState('title') // 'title' or 'hashtag'

   // ✅ 상태관리
   const [searchType, setSearchType] = useState('title') // 검색 기준 (제목 or 해시태그)
   const [searchTerm, setSearchTerm] = useState('') // 검색어
   const [filteredStudies2, setFilteredStudies2] = useState(studies) // 검색 결과

   const handleSearch = () => {
      if (!searchTerm.trim()) {
         console.log('검색어가 비어있음 → 전체 목록 유지')
         setFilteredStudies2(null)
         return
      }

      const lowerCaseSearch = searchTerm.toLowerCase()
      let filteredResults = []

      if (searchType === 'title') {
         filteredResults = studies.filter((study) => study.name.toLowerCase().includes(lowerCaseSearch))
      } else if (searchType === 'hashtag') {
         filteredResults = studies.filter((study) => study.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearch)))
      }

      console.log('검색 결과:', filteredResults)
      setFilteredStudies2(filteredResults)
   }

   // ✅ 스터디 리스트 상태 (각 스터디별 `liked` 상태 저장)
   const [studyList, setStudyList] = useState(studies)

   // ✅ 좋아요 버튼 클릭 핸들러
   const toggleLike = (index) => {
      setStudyList((prevStudies) => prevStudies.map((study, i) => (i === index ? { ...study, liked: !study.liked } : study)))
   }

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
                        {study.locked && <FaLock />} {/* 🔒 잠금 여부 */}
                        {study.camera && <FaCamera />} {/* 📷 카메라 여부 */}
                        {study.screenShare && <FaDesktop />} {/* 🖥️ 화면 공유 여부 */}
                     </CardTop>

                     {/* ✅ 좋아요 버튼 */}
                     <HeartIcon liked={study.liked} onClick={() => toggleLike(index)}>
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

         {/* ✅ 카드 섹션 - 검색 결과 반영 */}
         <TitleWrapper>
            <Title>스터디 목록</Title>
         </TitleWrapper>
         <StyledDivider />

         <StudyContainer2>
            {filteredStudies2 !== null && filteredStudies2.length === 0 ? (
               <NoResults>일치하는 스터디 그룹이 없습니다.</NoResults>
            ) : (
               (filteredStudies2 !== null ? filteredStudies2 : studies)
                  .filter((study) => study.type === 'all')
                  .map((study, index) => (
                     <StyledCard key={index}>
                        <CardTop>
                           {study.locked && <FaLock />} {/* 🔒 잠금 여부 */}
                           {study.camera && <FaCamera />} {/* 📷 카메라 여부 */}
                           {study.screenShare && <FaDesktop />} {/* 🖥️ 화면 공유 여부 */}
                        </CardTop>

                        {/* ✅ 좋아요 버튼 */}
                        <HeartIcon liked={study.liked} onClick={() => toggleLike(index)}>
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
                  ))
            )}
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
   color: ${(props) => (props.liked ? 'red' : '#ccc')}; /* ❤️ 좋아요 상태에 따라 색 변경 */
   &:hover {
      color: red; /* 마우스 올리면 빨간색 */
   }
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
   margin-top: 50px;
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
