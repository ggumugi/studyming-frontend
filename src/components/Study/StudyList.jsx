import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudygroupsThunk, fetchStudygroupByIdThunk, deleteStudygroupThunk } from '../../features/studygroupSlice'
import { toggleStudyLikeThunk, checkUserLikeStatusThunk, fetchStudyLikesThunk } from '../../features/likedSlice'

import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

/*
좋아요 기능 ui 수정
활성여부 로고변함? cam sharing lock
*/
const StudyList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // Redux에서 로그인한 사용자 정보 & 스터디 그룹 데이터 가져오기
   const { studygroups, studygroup, loading } = useSelector((state) => state.studygroups)

   const [hashtagsMap, setHashtagsMap] = useState({}) // 🔥 해시태그를 개별적으로 저장할 상태

   const studygroupList = studygroups || [] //진짜배열

   const { user } = useSelector((state) => state.auth) //로그인한 유저의 정보

   const [likedStatus, setLikedStatus] = useState({}) //  각 스터디의 좋아요 상태 저장
   const [likeCounts, setLikeCounts] = useState({}) //  각 스터디의 좋아요 개수 저장

   /**
    * ✅ 1. 좋아요 상태 및 개수 불러오기 (로그인 유저 변경되거나, 그룹 리스트 변경 시)
    */
   useEffect(() => {
      if (studygroups.length > 0) {
         const fetchLikesData = async () => {
            const newLikedStatus = {}
            const newLikeCounts = {}

            await Promise.all(
               studygroups.map(async (study) => {
                  try {
                     const likeCount = await dispatch(fetchStudyLikesThunk(study.id)).unwrap()
                     newLikeCounts[study.id] = likeCount // ✅ 좋아요 개수 저장

                     if (user) {
                        const likeStatus = await dispatch(checkUserLikeStatusThunk(study.id)).unwrap()
                        newLikedStatus[study.id] = likeStatus
                     }
                  } catch (error) {
                     console.error('❌ 좋아요 데이터 불러오기 오류:', error)
                  }
               })
            )

            setLikeCounts(newLikeCounts) // ✅ 로그인 여부 관계없이 좋아요 숫자는 유지
            if (user) {
               setLikedStatus(newLikedStatus) // ✅ 로그인 시 Redux에서 불러온 값 유지
            }
         }

         fetchLikesData()
      }
   }, [dispatch, studygroups, user]) // ✅ 유저 변경 시 실행됨
   /**
    * ✅ 2. 로그아웃 시 좋아요 초기화 (회색 하트 유지)
    */
   useEffect(() => {
      if (!user) {
         setLikedStatus({}) //  로그아웃하면 모든 하트를 회색으로 변경
      }
   }, [user])

   /**
    * ✅ 3. 좋아요 클릭 핸들러 (UI 즉시 반영 후, Redux 요청)
    */
   const handleLikeClick = (groupId) => {
      if (!user) return // 로그인하지 않으면 클릭 불가능

      const isLiked = likedStatus[groupId] // 현재 좋아요 상태

      // ✅ UI에서 즉시 반영
      setLikedStatus((prev) => ({
         ...prev,
         [groupId]: !isLiked,
      }))

      setLikeCounts((prev) => ({
         ...prev,
         [groupId]: isLiked ? prev[groupId] - 1 : prev[groupId] + 1, // ✅ 좋아요 개수 변경
      }))

      // ✅ Redux Thunk 실행 후 서버 응답 반영
      dispatch(toggleStudyLikeThunk(groupId))
         .unwrap()
         .then((response) => {
            setLikedStatus((prev) => ({
               ...prev,
               [groupId]: response.liked,
            }))

            setLikeCounts((prev) => ({
               ...prev,
               [groupId]: response.likeCount,
            }))
         })
         .catch((error) => {
            console.error('❌ 좋아요 요청 오류:', error)
         })
   }

   //스터디그룹 삭제함수
   const handleDeleteStudy = (e, studyId) => {
      e.stopPropagation() // 🛑 카드 클릭 이벤트 방지

      if (window.confirm('정말 삭제하시겠습니까?')) {
         dispatch(deleteStudygroupThunk(studyId))
            .unwrap()
            .then(() => {
               alert('그룹을 삭제했습니다.')

               // ✅ Redux 상태에서 해당 그룹을 제거하여 UI에서도 즉시 반영
               dispatch(fetchStudygroupsThunk())
            })
            .catch((err) => {
               console.error('❌ 그룹 삭제 실패:', err)
               alert('그룹을 삭제할 수 없습니다.')
            })
      }
   }
   //해시태그 추출 로직(일단 됨....)
   // ✅ 1️⃣ 전체 스터디 그룹을 불러오는 useEffect (가장 먼저 실행)
   useEffect(() => {
      dispatch(fetchStudygroupsThunk()) // ✅ Redux 상태 업데이트
   }, [dispatch])

   // ✅ 2️⃣ 전체 스터디 그룹이 업데이트된 후 개별 해시태그 불러오는 useEffect 실행
   useEffect(() => {
      if (Array.isArray(studygroups) && studygroups.length > 0) {
         const fetchHashtags = async () => {
            try {
               const newHashtagsMap = {}

               await Promise.all(
                  studygroups.map(async (study) => {
                     const response = await dispatch(fetchStudygroupByIdThunk(study.id)).unwrap()
                     newHashtagsMap[study.id] = response.studygroup?.Hashtaged || []
                  })
               )

               setHashtagsMap(newHashtagsMap) // ✅ Redux는 변경하지 않고 클라이언트 상태만 업데이트
            } catch (error) {
               console.error('❌ 해시태그 불러오기 실패:', error)
            }
         }

         fetchHashtags()
      }
   }, [dispatch, studygroups]) // ✅ `studygroups`가 업데이트된 후 실행

   //  페이징 처리 관련 상태
   const [myCurrentPage, setMyCurrentPage] = useState(1) // ✅ 내 스터디 페이지 번호
   const myStudiesPerPage = 4 // ✅ 한 페이지당 4개 표시

   const [allCurrentPage, setAllCurrentPage] = useState(1) // ✅ 전체 스터디 페이지 번호
   const allStudiesPerPage = 8 // ✅ 한 페이지당 8개 표시

   // 수정: 올바른 데이터 구조로 변경
   const sortedStudies = [...studygroupList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

   // ✅ 현재 로그인한 사용자가 만든 스터디 필터링
   const userCreatedStudies = sortedStudies.filter((study) => study.createdBy === user?.id)

   // ✅ 모든 사용자가 만든 스터디
   const allStudies = sortedStudies

   // ✅ "내 스터디" 페이징 처리 (4개씩)
   const indexOfLastMyStudy = myCurrentPage * myStudiesPerPage
   const indexOfFirstMyStudy = indexOfLastMyStudy - myStudiesPerPage
   const currentUserStudies = userCreatedStudies.slice(indexOfFirstMyStudy, indexOfLastMyStudy)

   // ✅ "전체 스터디" 페이징 처리 (8개씩)
   const indexOfLastAllStudy = allCurrentPage * allStudiesPerPage
   const indexOfFirstAllStudy = indexOfLastAllStudy - allStudiesPerPage
   const currentAllStudies = allStudies.slice(indexOfFirstAllStudy, indexOfLastAllStudy)

   //StyledPagination 유지하면서 동적으로 버튼 생성
   const renderPaginationButtons = (totalPages, currentPage, onPageChange) => {
      return (
         <StyledPagination>
            <Button onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
               ◀ 이전
            </Button>

            {[...Array(totalPages).keys()].map((number) => (
               <Button key={number + 1} onClick={() => onPageChange(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                  {number + 1}
               </Button>
            ))}

            <Button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
               다음 ▶
            </Button>
         </StyledPagination>
      )
   }

   //검색어 저장
   const [searchTerm, setSearchTerm] = useState('') // 검색어 저장
   const [searchType, setSearchType] = useState('title') // 🔥 검색 기준 (제목 or 해시태그)
   const [filteredStudies, setFilteredStudies] = useState([]) // 검색 결과 저장

   // 🔹 검색 버튼 클릭 시 실행되는 함수
   const handleSearch = () => {
      if (!searchTerm.trim()) {
         setFilteredStudies(studygroupList)
         return
      }

      const lowerCaseSearch = searchTerm.toLowerCase()

      const results = studygroupList.filter((study) => {
         if (searchType === 'title') {
            return study.name.toLowerCase().includes(lowerCaseSearch)
         } else if (searchType === 'hashtag') {
            return hashtagsMap[study.id] && hashtagsMap[study.id].some((tag) => tag.name.toLowerCase().includes(lowerCaseSearch))
         }
         return false
      })

      setFilteredStudies(results)
   }

   // 🔹 검색어 입력 시, 전체 리스트 유지
   useEffect(() => {
      if (!searchTerm.trim()) {
         setFilteredStudies(studygroupList) // ✅ 검색어가 없으면 전체 리스트 표시
      }
   }, [searchTerm, studygroupList])

   // 스터디 등록 버튼 클릭 시 호출되는 함수
   const handleStudyCreateClick = () => {
      navigate('/study/create') // '/study-create' 페이지로 이동
   }

   //  "내 스터디" 페이지 변경
   const handleMyPageClick = (pageNumber) => {
      setMyCurrentPage(pageNumber)
      console.log(`📌 내 스터디 현재 페이지: ${pageNumber}`)
   }

   //  "스터디 목록" 페이지 변경
   const handleAllPageClick = (pageNumber) => {
      setAllCurrentPage(pageNumber)
      console.log(`📌 전체 스터디 현재 페이지: ${pageNumber}`)
   }

   // 그룹 카드 클릭 시 상세 페이지로 이동
   const handleCardClick = (studyId) => {
      navigate(`/study/detail/${studyId}`)
   }

   return (
      <Wrapper>
         <Header>
            <Title>내 스터디</Title>
            <StyledAddStudyButton onClick={handleStudyCreateClick}>스터디 등록</StyledAddStudyButton>
         </Header>
         <StyledDivider />

         <StudyContainer>
            {!user ? ( // ✅ 유저가 로그인 안 한 상태
               <Message>로그인을 해주세요</Message>
            ) : currentUserStudies.length === 0 ? ( // ✅ 내가 만든 스터디가 없는 경우
               <Message>내가 만든 스터디 그룹이 존재하지 않습니다</Message>
            ) : (
               currentUserStudies.map(
                  (
                     study // ✅ 현재 페이지에 해당하는 스터디만 렌더링
                  ) => (
                     <StyledCard key={study.id} onClick={() => handleCardClick(study.id)}>
                        <CardTop>
                           {study.lock && <FaLock />}
                           {study.cam && <FaCamera />}
                           {study.sharing && <FaDesktop />}
                        </CardTop>
                        <HeartIcon
                           onClick={(e) => {
                              e.stopPropagation() // 카드 클릭 이벤트 방지
                              handleLikeClick(study.id)
                           }}
                           style={{ pointerEvents: user ? 'auto' : 'none' }} // 🔥 로그아웃 시 클릭 비활성화
                        >
                           <FaHeart
                              style={{
                                 color: user ? (likedStatus[study.id] ? 'red' : 'gray') : 'gray', // 🔥 로그아웃 시 회색 유지
                                 cursor: user ? 'pointer' : 'default',
                                 transition: 'color 0.2s ease-in-out',
                              }}
                           />
                           <LikeCount disabled={!user}>{likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}</LikeCount>
                        </HeartIcon>
                        {/* ✅ 관리자인 경우 삭제 버튼 표시 */}
                        {user?.role === 'ADMIN' && <DeleteButton onClick={(e) => handleDeleteStudy(e, study.id)}>삭제</DeleteButton>}
                        <CardContent>
                           <TitleText>{study.name}</TitleText>
                           <TagContainer>{hashtagsMap[study.id] && hashtagsMap[study.id].length > 0 ? hashtagsMap[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                           <Participants>
                              인원 {study.countMembers}/{study.maxMembers}
                           </Participants>
                        </CardContent>
                     </StyledCard>
                  )
               )
            )}
         </StudyContainer>
         {/* ✅ "내 스터디" 페이징 적용 (StudyContainer 아래) */}
         {renderPaginationButtons(Math.ceil(userCreatedStudies.length / myStudiesPerPage), myCurrentPage, handleMyPageClick)}
         {/* ✅ 카드 섹션 - 검색 결과 반영 */}
         <TitleWrapper>
            <Title>스터디 목록</Title>
         </TitleWrapper>
         <StyledDivider />
         <StudyContainer2>
            {filteredStudies.length === 0 && searchTerm ? ( // ✅ 검색 결과가 없을 경우
               <Message>일치하는 스터디 그룹이 없습니다.</Message>
            ) : (
               filteredStudies.map(
                  (
                     study // ✅ 현재 페이지의 스터디만 표시
                  ) => (
                     <StyledCard key={study.id} onClick={() => handleCardClick(study.id)}>
                        <CardTop>
                           {study.locked && <FaLock />}
                           {study.camera && <FaCamera />}
                           {study.screenShare && <FaDesktop />}
                        </CardTop>
                        <HeartIcon
                           onClick={(e) => {
                              e.stopPropagation() // 카드 클릭 이벤트 방지
                              handleLikeClick(study.id)
                           }}
                           style={{ pointerEvents: user ? 'auto' : 'none' }} // 🔥 로그아웃 시 클릭 비활성화
                        >
                           <FaHeart
                              style={{
                                 color: user ? (likedStatus[study.id] ? 'red' : 'gray') : 'gray', // 🔥 로그아웃 시 회색 유지
                                 cursor: user ? 'pointer' : 'default',
                                 transition: 'color 0.2s ease-in-out',
                              }}
                           />
                           {likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}
                        </HeartIcon>
                        {/* ✅ 관리자인 경우 삭제 버튼 표시 */}
                        {user?.role === 'ADMIN' && <DeleteButton onClick={(e) => handleDeleteStudy(e, study.id)}>삭제</DeleteButton>}
                        <CardContent>
                           <TitleText>{study.name}</TitleText>
                           <TagContainer>{hashtagsMap[study.id] && hashtagsMap[study.id].length > 0 ? hashtagsMap[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                           <Participants>
                              인원 {study.countMembers}/{study.maxMembers}
                           </Participants>
                        </CardContent>
                     </StyledCard>
                  )
               )
            )}
         </StudyContainer2>
         {/* ✅ "스터디 목록" 페이징 적용 (StudyContainer2 아래) */}
         {renderPaginationButtons(Math.ceil(allStudies.length / allStudiesPerPage), allCurrentPage, handleAllPageClick)}

         <SearchContainer>
            <Dropdown value={searchType} onChange={(e) => setSearchType(e.target.value)}>
               <option value="title">제목</option>
               <option value="hashtag">해시태그</option>
            </Dropdown>
            <SearchInput type="text" placeholder={searchType === 'title' ? '제목을 입력하세요' : '해시태그를 입력하세요'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
         </SearchContainer>
      </Wrapper>
   )
}

export default StudyList

// Styled Components

const Title = styled.h2`
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
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
   padding: 0 15px;
   background-color: #ff7a00;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: clamp(10px, 1vw, 14px);
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
   position: relative;
`

const CardTop = styled.div`
   position: absolute;
   top: 10px;
   left: 10px;
   display: flex;
   gap: 10px;
   font-size: clamp(14px, 2vw, 20px);
   color: #ff7a00;
`

const HeartIcon = styled.div`
   position: absolute;
   top: 10px;
   right: 10px;
   font-size: clamp(14px, 2vw, 20px);
   display: flex;
   gap: 5px; /* 하트와 숫자 간격 */
   align-items: center;
`

const LikeCount = styled.span`
   font-size: clamp(12px, 1vw, 14px);
   font-weight: bold;
   color: black;
`

const TitleText = styled.h3`
   font-size: clamp(15px, 2vw, 18px);
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
   font-size: clamp(12px, 1vw, 14px);
   color: gray;
`

const SearchContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 10px;
   width: 100%;
   margin: 0 auto 40px auto;
   flex-wrap: nowarp;
`

const Dropdown = styled.select`
   padding: 10px;
   font-size: clamp(12px, 1vw, 14px);
   border: 1px solid #ff7a00;
   border-radius: 4px;
   outline: none;
   cursor: pointer;
`

const SearchInput = styled.input`
   padding: 10px;
   font-size: clamp(12px, 1vw, 14px);
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
   white-space: nowrap; /* ✅ 텍스트 줄바꿈 방지 */
   min-width: 60px; /* ✅ 너무 작아지지 않도록 설정 */
   flex-shrink: 0; /* ✅ 버튼 크기 유지 */
   width: auto; /* ✅ 텍스트 크기에 맞게 버튼 크기 자동 조정 */
   font-size: clamp(12px, 1vw, 14px);
   &:hover {
      background-color: #ff7a00;
   }
`
/* ???? */
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
/* ???? */

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
const Message = styled.p`
   text-align: center;
   font-size: clamp(14px, 2vw, 16px);
   font-weight: bold;
   color: gray;
   margin: 20px 0;
`
const DeleteButton = styled.button`
   position: absolute;
   bottom: 10px;
   right: 10px;
   background-color: red;
   color: white;
   border: none;
   padding: 5px 10px;
   border-radius: 4px;
   cursor: pointer;
   font-size: 12px;
   z-index: 10; /* 다른 요소 위에 배치 */

   &:hover {
      background-color: darkred;
   }
`
