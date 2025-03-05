import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllStudyGroupsThunk, fetchStudyGroupHashtagsThunk, searchStudyGroupsThunk, fetchMyStudyGroupsThunk, deleteStudyGroupThunk, clearSearchResults } from '../../features/studyListSlice'
import { toggleStudyLikeThunk, checkUserLikeStatusThunk, fetchStudyLikesThunk } from '../../features/likedSlice'

import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const StudyList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // Redux에서 로그인한 사용자 정보 & 스터디 그룹 데이터 가져오기
   const { studyGroups, myStudyGroups, searchResults, hashtags, loading, error } = useSelector((state) => state.studyList)
   const { user } = useSelector((state) => state.auth) // 로그인한 유저의 정보

   // 로컬 상태 관리
   const [likedStatus, setLikedStatus] = useState({}) // 각 스터디의 좋아요 상태 저장
   const [likeCounts, setLikeCounts] = useState({}) // 각 스터디의 좋아요 개수 저장
   const [searchTerm, setSearchTerm] = useState('') // 검색어 저장
   const [searchType, setSearchType] = useState('title') // 검색 기준 (제목 or 해시태그)
   const [isSearching, setIsSearching] = useState(false) // 검색 중인지 여부
   const [localSearchResults, setLocalSearchResults] = useState([]) // 로컬 검색 결과 (해시태그 검색용)

   // 페이징 처리 관련 상태
   const [myCurrentPage, setMyCurrentPage] = useState(1) // 내 스터디 페이지 번호
   const myStudiesPerPage = 4 // 한 페이지당 4개 표시

   const [allCurrentPage, setAllCurrentPage] = useState(1) // 전체 스터디 페이지 번호
   const allStudiesPerPage = 8 // 한 페이지당 8개 표시

   // 화면에 표시할 스터디 목록 결정
   const displayedStudies = isSearching ? (searchType === 'hashtag' ? localSearchResults : searchResults) : studyGroups

   /**
    * 1. 컴포넌트 마운트 시 데이터 로드
    */
   useEffect(() => {
      // 모든 스터디 그룹 목록 가져오기
      dispatch(fetchAllStudyGroupsThunk())

      // 로그인한 경우 내 스터디 그룹 목록 가져오기
      if (user) {
         dispatch(fetchMyStudyGroupsThunk())
      }
   }, [dispatch, user])

   /**
    * 2. 스터디 그룹 목록이 로드된 후 해시태그 및 좋아요 정보 가져오기
    */
   useEffect(() => {
      if (studyGroups.length > 0) {
         // 각 스터디 그룹의 해시태그 가져오기
         studyGroups.forEach((study) => {
            dispatch(fetchStudyGroupHashtagsThunk(study.id))
         })

         // 각 스터디 그룹의 좋아요 개수 가져오기
         studyGroups.forEach((study) => {
            dispatch(fetchStudyLikesThunk(study.id))
               .unwrap()
               .then((likeCount) => {
                  setLikeCounts((prev) => ({ ...prev, [study.id]: likeCount }))
               })
         })

         // 로그인한 경우 유저의 좋아요 상태 가져오기
         if (user) {
            studyGroups.forEach((study) => {
               dispatch(checkUserLikeStatusThunk(study.id))
                  .unwrap()
                  .then((likeStatus) => {
                     setLikedStatus((prev) => ({ ...prev, [study.id]: likeStatus }))
                  })
            })
         }
      }
   }, [dispatch, studyGroups, user])

   /**
    * 3. 검색 결과가 로드된 후 해시태그 및 좋아요 정보 가져오기
    */
   useEffect(() => {
      if (searchResults.length > 0 && isSearching && searchType === 'title') {
         // 각 검색 결과의 해시태그 가져오기
         searchResults.forEach((study) => {
            if (!hashtags[study.id]) {
               // 이미 불러온 해시태그가 없는 경우에만
               dispatch(fetchStudyGroupHashtagsThunk(study.id))
            }
         })

         // 각 검색 결과의 좋아요 개수 가져오기
         searchResults.forEach((study) => {
            if (likeCounts[study.id] === undefined) {
               // 이미 불러온 좋아요 개수가 없는 경우에만
               dispatch(fetchStudyLikesThunk(study.id))
                  .unwrap()
                  .then((likeCount) => {
                     setLikeCounts((prev) => ({ ...prev, [study.id]: likeCount }))
                  })
            }
         })

         // 로그인한 경우 유저의 좋아요 상태 가져오기
         if (user) {
            searchResults.forEach((study) => {
               if (likedStatus[study.id] === undefined) {
                  // 이미 불러온 좋아요 상태가 없는 경우에만
                  dispatch(checkUserLikeStatusThunk(study.id))
                     .unwrap()
                     .then((likeStatus) => {
                        setLikedStatus((prev) => ({ ...prev, [study.id]: likeStatus }))
                     })
               }
            })
         }
      }
   }, [dispatch, searchResults, isSearching, searchType, hashtags, likeCounts, likedStatus, user])

   /**
    * 4. 로컬 검색 결과에 대한 좋아요 및 해시태그 정보 가져오기
    */
   useEffect(() => {
      if (localSearchResults.length > 0 && isSearching && searchType === 'hashtag') {
         // 각 검색 결과의 해시태그 가져오기
         localSearchResults.forEach((study) => {
            if (!hashtags[study.id]) {
               // 이미 불러온 해시태그가 없는 경우에만
               dispatch(fetchStudyGroupHashtagsThunk(study.id))
            }
         })

         // 각 검색 결과의 좋아요 개수 가져오기
         localSearchResults.forEach((study) => {
            if (likeCounts[study.id] === undefined) {
               // 이미 불러온 좋아요 개수가 없는 경우에만
               dispatch(fetchStudyLikesThunk(study.id))
                  .unwrap()
                  .then((likeCount) => {
                     setLikeCounts((prev) => ({ ...prev, [study.id]: likeCount }))
                  })
            }
         })

         // 로그인한 경우 유저의 좋아요 상태 가져오기
         if (user) {
            localSearchResults.forEach((study) => {
               if (likedStatus[study.id] === undefined) {
                  // 이미 불러온 좋아요 상태가 없는 경우에만
                  dispatch(checkUserLikeStatusThunk(study.id))
                     .unwrap()
                     .then((likeStatus) => {
                        setLikedStatus((prev) => ({ ...prev, [study.id]: likeStatus }))
                     })
               }
            })
         }
      }
   }, [dispatch, localSearchResults, isSearching, searchType, hashtags, likeCounts, likedStatus, user])

   /**
    * 5. 로그아웃 시 좋아요 상태 초기화
    */
   useEffect(() => {
      if (!user) {
         setLikedStatus({}) // 로그아웃하면 모든 하트를 회색으로 변경
      }
   }, [user])

   /**
    * 좋아요 클릭 핸들러
    */
   const handleLikeClick = (groupId) => {
      if (!user) return // 로그인하지 않으면 클릭 불가능

      const isLiked = likedStatus[groupId] // 현재 좋아요 상태

      // UI에서 즉시 반영
      setLikedStatus((prev) => ({
         ...prev,
         [groupId]: !isLiked,
      }))

      setLikeCounts((prev) => ({
         ...prev,
         [groupId]: isLiked ? prev[groupId] - 1 : prev[groupId] + 1,
      }))

      // Redux 액션 디스패치
      dispatch(toggleStudyLikeThunk(groupId))
         .unwrap()
         .then((response) => {
            // 서버 응답으로 상태 업데이트
            setLikedStatus((prev) => ({
               ...prev,
               [groupId]: response.liked,
            }))
            setLikeCounts((prev) => ({
               ...prev,
               [groupId]: response.likeCount,
            }))
         })
   }

   /**
    * 스터디 그룹 삭제 함수
    */
   const handleDeleteStudy = (e, studyId) => {
      e.stopPropagation() // 카드 클릭 이벤트 방지

      if (window.confirm('정말 삭제하시겠습니까?')) {
         dispatch(deleteStudyGroupThunk(studyId))
            .unwrap()
            .then(() => {
               // 삭제 성공 후 목록 새로고침
               dispatch(fetchAllStudyGroupsThunk())
               if (user) {
                  dispatch(fetchMyStudyGroupsThunk())
               }
            })
      }
   }

   /**
    * 해시태그 기반 로컬 검색 함수
    */
   const performHashtagSearch = (term) => {
      if (!term.trim()) return []

      const lowerCaseTerm = term.toLowerCase()

      // 해시태그 데이터를 기반으로 검색
      const results = studyGroups.filter((study) => {
         const studyHashtags = hashtags[study.id] || []
         return studyHashtags.some((tag) => tag.name.toLowerCase().includes(lowerCaseTerm))
      })

      return results
   }

   /**
    * 검색 버튼 클릭 시 실행되는 함수
    */
   const handleSearch = () => {
      if (!searchTerm.trim()) {
         // 검색어가 없으면 전체 목록으로 돌아감
         setIsSearching(false)
         setLocalSearchResults([])
         dispatch(clearSearchResults())
         return
      }

      // 검색 실행
      setIsSearching(true)
      setAllCurrentPage(1) // 검색 시 페이지 초기화

      if (searchType === 'hashtag') {
         // 해시태그 검색은 클라이언트 측에서 수행
         const results = performHashtagSearch(searchTerm)
         setLocalSearchResults(results)
      } else {
         // 제목 검색은 서버 측에서 수행
         dispatch(searchStudyGroupsThunk({ searchType, searchTerm }))
      }
   }

   /**
    * 검색어 변경 핸들러
    */
   const handleSearchTermChange = (e) => {
      setSearchTerm(e.target.value)
      // 검색어가 비어있으면 전체 목록으로 돌아감
      if (!e.target.value.trim()) {
         setIsSearching(false)
         setLocalSearchResults([])
         dispatch(clearSearchResults())
      }
   }

   /**
    * 검색 타입 변경 핸들러
    */
   const handleSearchTypeChange = (e) => {
      setSearchType(e.target.value)
      // 검색 타입이 변경되면 검색 결과 초기화
      setIsSearching(false)
      setLocalSearchResults([])
      dispatch(clearSearchResults())
   }

   /**
    * 스터디 등록 버튼 클릭 시 호출되는 함수
    */
   const handleStudyCreateClick = () => {
      navigate('/study/create')
   }

   /**
    * "내 스터디" 페이지 변경
    */
   const handleMyPageClick = (pageNumber) => {
      setMyCurrentPage(pageNumber)
   }

   /**
    * "스터디 목록" 페이지 변경
    */
   const handleAllPageClick = (pageNumber) => {
      setAllCurrentPage(pageNumber)
   }

   /**
    * 그룹 카드 클릭 시 상세 페이지로 이동
    */
   const handleCardClick = (studyId) => {
      if (!user) return // 로그인하지 않은 상태에서는 아무 동작도 하지 않음
      navigate(`/study/detail/${studyId}`)
   }

   // 페이징 처리된 내 스터디 목록
   const indexOfLastMyStudy = myCurrentPage * myStudiesPerPage
   const indexOfFirstMyStudy = indexOfLastMyStudy - myStudiesPerPage
   const currentUserStudies = myStudyGroups.slice(indexOfFirstMyStudy, indexOfLastMyStudy)

   // 페이징 처리된 전체 스터디 목록
   const indexOfLastAllStudy = allCurrentPage * allStudiesPerPage
   const indexOfFirstAllStudy = indexOfLastAllStudy - allStudiesPerPage
   const currentAllStudies = displayedStudies.slice(indexOfFirstAllStudy, indexOfLastAllStudy)

   // 페이징 버튼 렌더링 함수
   const renderPaginationButtons = (totalPages, currentPage, onPageChange) => {
      if (totalPages === 0) return null // 페이지가 없으면 렌더링하지 않음

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

   return (
      <Wrapper>
         <Header>
            <Title>내 스터디</Title>
            <StyledAddStudyButton onClick={handleStudyCreateClick}>스터디 등록</StyledAddStudyButton>
         </Header>
         <StyledDivider />
         <StudyContainer>
            {!user ? (
               <Message>로그인을 해주세요</Message>
            ) : currentUserStudies.length === 0 ? (
               <Message>내가 만든 스터디 그룹이 존재하지 않습니다</Message>
            ) : (
               currentUserStudies.map((study) => (
                  <StyledCard key={study.id} onClick={() => handleCardClick(study.id)}>
                     <CardTop>
                        {study.locked && <FaLock />}
                        {study.cam && <FaCamera />}
                        {study.sharing && <FaDesktop />}
                     </CardTop>
                     <HeartIcon
                        onClick={(e) => {
                           e.stopPropagation()
                           handleLikeClick(study.id)
                        }}
                        style={{ pointerEvents: user ? 'auto' : 'none' }}
                     >
                        <FaHeart
                           style={{
                              color: user ? (likedStatus[study.id] ? 'red' : 'gray') : 'gray',
                              cursor: user ? 'pointer' : 'default',
                              transition: 'color 0.2s ease-in-out',
                           }}
                        />
                        <LikeCount disabled={!user}>{likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}</LikeCount>
                     </HeartIcon>
                     {user?.role === 'ADMIN' && <DeleteButton onClick={(e) => handleDeleteStudy(e, study.id)}>삭제</DeleteButton>}
                     <CardContent>
                        <TitleText>{study.name}</TitleText>
                        <TagContainer>{hashtags[study.id] && hashtags[study.id].length > 0 ? hashtags[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                        <Participants>
                           인원 {study.countMembers}/{study.maxMembers}
                        </Participants>
                     </CardContent>
                  </StyledCard>
               ))
            )}
         </StudyContainer>
         {user && renderPaginationButtons(Math.ceil(myStudyGroups.length / myStudiesPerPage), myCurrentPage, handleMyPageClick)}

         <TitleWrapper>
            <Title>스터디 목록</Title>
         </TitleWrapper>
         <StyledDivider />

         <StudyContainer2>
            {loading ? (
               <Message>검색 중...</Message>
            ) : isSearching && displayedStudies.length === 0 ? (
               <Message>일치하는 스터디 그룹이 없습니다.</Message>
            ) : currentAllStudies.length === 0 ? (
               <Message>스터디 그룹이 없습니다.</Message>
            ) : (
               currentAllStudies.map((study) => (
                  <StyledCard key={study.id} onClick={() => handleCardClick(study.id)}>
                     <CardTop>
                        {study.locked && <FaLock />}
                        {study.cam && <FaCamera />}
                        {study.sharing && <FaDesktop />}
                     </CardTop>
                     <HeartIcon
                        onClick={(e) => {
                           e.stopPropagation()
                           handleLikeClick(study.id)
                        }}
                        style={{ pointerEvents: user ? 'auto' : 'none' }}
                     >
                        <FaHeart
                           style={{
                              color: user ? (likedStatus[study.id] ? 'red' : 'gray') : 'gray',
                              cursor: user ? 'pointer' : 'default',
                              transition: 'color 0.2s ease-in-out',
                           }}
                        />
                        {likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}
                     </HeartIcon>
                     {user?.role === 'ADMIN' && <DeleteButton onClick={(e) => handleDeleteStudy(e, study.id)}>삭제</DeleteButton>}
                     <CardContent>
                        <TitleText>{study.name}</TitleText>
                        <TagContainer>{hashtags[study.id] && hashtags[study.id].length > 0 ? hashtags[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                        <Participants>
                           인원 {study.countMembers}/{study.maxMembers}
                        </Participants>
                     </CardContent>
                  </StyledCard>
               ))
            )}
         </StudyContainer2>
         {renderPaginationButtons(Math.ceil(displayedStudies.length / allStudiesPerPage), allCurrentPage, handleAllPageClick)}

         {/* 검색 컨트롤 - 원래 위치로 이동 */}
         <SearchContainer>
            <Dropdown value={searchType} onChange={handleSearchTypeChange}>
               <option value="title">제목</option>
               <option value="hashtag">해시태그</option>
            </Dropdown>
            <SearchInput type="text" placeholder={searchType === 'title' ? '제목을 입력하세요' : '해시태그를 입력하세요'} value={searchTerm} onChange={handleSearchTermChange} />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
         </SearchContainer>
      </Wrapper>
   )
}

export default StudyList

// Styled Components는 원본 코드와 동일하게 유지
const Title = styled.h2`
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
   margin: 0;
`

const TitleWrapper = styled.div`
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 10px;
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
   height: 40px;
`
const StyledDivider = styled.div`
   width: 100%;
   border-top: 2px solid #ff7a00;
   margin-top: 10px;
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
   gap: 5px;
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
   white-space: nowrap;
   min-width: 60px;
   flex-shrink: 0;
   width: auto;
   &:hover {
      background-color: #ff7a00;
   }
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
   z-index: 10;

   &:hover {
      background-color: darkred;
   }
`
