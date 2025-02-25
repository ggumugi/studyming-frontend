import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudygroupsThunk, fetchStudygroupByIdThunk, deleteStudygroupThunk } from '../../features/studygroupSlice'
import { toggleStudyLikeThunk, checkUserLikeStatusThunk, fetchStudyLikesThunk } from '../../features/likedSlice'

import styled from 'styled-components'
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { FaLock, FaCamera, FaDesktop, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

/*
좋아요 기능 ui 수정(리덕스는 구현 완)
삭제누르면 오류뜨는거(근데 또 새고하면 데베에서 삭제는 됨;)
페이징,검색기능 만들기(내스터디-4개 전체-8개)
지금순서 좋아요랑 상관없이 최신순인데 좋아요 ui구현하고 좋아요+최신순으로..
활성여부 로고변함? cam sharing lock 
해시태그 추출(코드 슬랙에 복사해놧는데 되긴 되는데 새고하면 다없어짐 ㄱ-)
그룹카드 누르면 각 스터디디테일 페이지로? 가게 navigate?...?
*/
const StudyListPage = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // Redux에서 로그인한 사용자 정보 & 스터디 그룹 데이터 가져오기
   const { studygroups, studygroup, loadinsg } = useSelector((state) => state.studygroups)

   const [hashtagsMap, setHashtagsMap] = useState({}) // 🔥 해시태그를 개별적으로 저장할 상태

   // 수정: 실제 배열을 가져와야 함
   const studygroupList = studygroups || [] //진짜배열

   const { user } = useSelector((state) => state.auth) //로그인한 유저의 정보

   const [likedStatus, setLikedStatus] = useState({}) //  각 스터디의 좋아요 상태 저장
   const [likeCounts, setLikeCounts] = useState({}) //  각 스터디의 좋아요 개수 저장
   useEffect(() => {
      studygroupList.forEach((study) => {
         dispatch(checkUserLikeStatusThunk(study.id)).then((response) => {
            setLikedStatus((prev) => ({
               ...prev,
               [study.id]: response.payload, // ✅ 현재 유저의 좋아요 상태 유지
            }))
         })

         dispatch(fetchStudyLikesThunk(study.id)).then((response) => {
            setLikeCounts((prev) => ({
               ...prev,
               [study.id]: response.payload, // ✅ 전체 좋아요 개수 유지
            }))
         })
      })
   }, [dispatch, studygroupList, user]) // ✅ 로그인한 유저가 변경될 때 실행
   //좋아요 상태유지
   useEffect(() => {
      if (user) {
         studygroupList.forEach((study) => {
            dispatch(checkUserLikeStatusThunk(study.id)) // ✅ 유저의 좋아요 상태 불러오기
         })
      }
   }, [dispatch, user])
   const handleLikeClick = (groupId) => {
      // ✅ 현재 좋아요 상태 가져오기
      const isLiked = likedStatus[groupId]

      // ✅ UI에서 즉시 반영
      setLikedStatus((prev) => ({
         ...prev,
         [groupId]: !isLiked,
      }))

      setLikeCounts((prev) => ({
         ...prev,
         [groupId]: isLiked ? prev[groupId] - 1 : prev[groupId] + 1, // ✅ Redux 최신 값과 동기화
      }))

      // ✅ Redux Thunk 실행 후, 최신 개수 반영
      dispatch(toggleStudyLikeThunk(groupId))
         .then((response) => {
            if (response.error) {
               console.error('❌ 좋아요 요청 실패:', response.error)
            } else {
               // ✅ Redux 값으로 다시 최신 데이터 업데이트
               setLikeCounts((prev) => ({
                  ...prev,
                  [groupId]: response.payload.likeCount,
               }))
            }
         })
         .catch((error) => {
            console.error('❌ 좋아요 요청 중 오류 발생:', error)
         })
   }

   // 스터디 그룹 삭제 핸들러
   // const handleDeleteStudy = (studyId) => {
   //    if (window.confirm('정말 삭제하시겠습니까?')) {
   //       dispatch(deleteStudygroupThunk(studyId)).then((response) => {
   //          console.log(response)
   //          if (response.payload.success) {
   //             alert('스터디 그룹이 삭제되었습니다.')
   //             window.location.reload()
   //          } else {
   //             alert('삭제에 실패했습니다.')
   //          }
   //       })
   //    }
   // } -- jiuuu 한테 설명해주기

   const handleDeleteStudy = (studyId) => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
         dispatch(deleteStudygroupThunk(studyId))
            .unwrap()
            .then(() => {
               alert('그룹을 삭제 했습니다.')
               window.location.reload()
            })
            .catch((err) => {
               console.error('그룹 삭제제 실패 : ', err)
               alert('그룹을 삭제할할 수 없습니다.')
            })
      }
   }

   //  페이징 처리 관련 상태
   const [currentPage, setCurrentPage] = useState(1)
   const myStudiesPerPage = 4 //  내 스터디는 한 페이지에 4개씩 표시
   const allStudiesPerPage = 8 //  모든 스터디는 한 페이지에 8개씩 표시

   //해시태그 추출용인데 나중에 수정
   useEffect(() => {
      dispatch(fetchStudygroupsThunk()) //  스터디 그룹 불러오기
   }, [dispatch])
   useEffect(() => {
      if (Array.isArray(studygroups) && studygroups.length > 0) {
         // ✅ 배열인지 확인
         studygroups.forEach((study) => {
            if (!hashtagsMap[study.id]) {
               dispatch(fetchStudygroupByIdThunk(study.id)).then((response) => {
                  if (response.payload) {
                     setHashtagsMap((prev) => ({
                        ...prev,
                        [study.id]: response.payload.hashtags || [],
                     }))
                  }
               })
            }
         })
      } else {
         console.log('❌ studygroups가 배열이 아님:', studygroups) // 🔥 디버깅용
      }
   }, [dispatch, studygroups])
   // ✅ 수정: 올바른 데이터 구조로 변경
   const sortedStudies = [...studygroupList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

   //  현재 로그인한 사용자가 만든 스터디 필터링
   const userCreatedStudies = sortedStudies.filter((study) => study.createdBy === user?.id)

   //  모든 사용자가 만든 스터디
   const allStudies = sortedStudies

   //  내 스터디 페이징 처리
   const indexOfLastMyStudy = currentPage * myStudiesPerPage
   const indexOfFirstMyStudy = indexOfLastMyStudy - myStudiesPerPage
   const currentUserStudies = userCreatedStudies.slice(indexOfFirstMyStudy, indexOfLastMyStudy)

   //  모든 스터디 페이징 처리
   const indexOfLastAllStudy = currentPage * allStudiesPerPage
   const indexOfFirstAllStudy = indexOfLastAllStudy - allStudiesPerPage
   const currentAllStudies = allStudies.slice(indexOfFirstAllStudy, indexOfLastAllStudy)

   // ✅ 상태관리
   const [searchType, setSearchType] = useState('title') // 검색 기준 (제목 or 해시태그)
   const [searchTerm, setSearchTerm] = useState('') // 검색어

   // 스터디 등록 버튼 클릭 시 호출되는 함수
   const handleStudyCreateClick = () => {
      navigate('/study/create') // '/study-create' 페이지로 이동
   }

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
            {!user ? ( // ✅ 유저가 로그인 안 한 상태
               <Message>로그인을 해주세요</Message>
            ) : [...studygroupList].filter((study) => study.createdBy === user?.id).length === 0 ? ( // ✅ 내가 만든 스터디가 없는 경우
               <Message>내가 만든 스터디 그룹이 존재하지 않습니다</Message>
            ) : (
               [...studygroupList]
                  .filter((study) => study.createdBy === user?.id) // ✅ 현재 로그인한 유저가 만든 스터디만 표시
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ 최신순 정렬
                  .map((study) => (
                     <StyledCard key={study.id}>
                        <CardTop>
                           {study.lock && <FaLock />}
                           {study.cam && <FaCamera />}
                           {study.sharing && <FaDesktop />}
                        </CardTop>
                        <HeartIcon
                           $liked={likedStatus[study.id]} // ✅ likedStatus를 기반으로 하트 색 유지
                           onClick={() => handleLikeClick(study.id)}
                        >
                           <FaHeart />
                           {likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}
                        </HeartIcon>
                        {/* ✅ 관리자인 경우 삭제 버튼 표시 */}
                        {user?.role === 'ADMIN' && <DeleteButton onClick={() => handleDeleteStudy(study.id)}>삭제</DeleteButton>}
                        <CardContent>
                           <TitleText>{study.name}</TitleText>
                           <TagContainer>{hashtagsMap[study.id] && hashtagsMap[study.id].length > 0 ? hashtagsMap[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                           <Participants>
                              인원 {study.countMembers}/{study.maxMembers}
                           </Participants>
                        </CardContent>
                     </StyledCard>
                  ))
            )}
         </StudyContainer>
         {/* ✅ 카드 섹션 - 검색 결과 반영 */}
         <TitleWrapper>
            <Title>스터디 목록</Title>
         </TitleWrapper>
         <StyledDivider />
         <StudyContainer2>
            {studygroupList.length === 0 ? ( // ✅ 모든 유저가 만든 그룹이 없을 경우
               <Message>스터디 그룹이 존재하지 않습니다</Message>
            ) : (
               [...studygroupList] // ✅ 원본 배열을 복사해서 정렬!
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ 최신순 정렬
                  .map((study) => (
                     <StyledCard key={study.id}>
                        <CardTop>
                           {study.locked && <FaLock />}
                           {study.camera && <FaCamera />}
                           {study.screenShare && <FaDesktop />}
                        </CardTop>
                        <HeartIcon
                           $liked={likedStatus[study.id]} // ✅ likedStatus를 기반으로 하트 색 유지
                           onClick={() => handleLikeClick(study.id)}
                        >
                           <FaHeart />
                           {likeCounts[study.id] !== undefined ? likeCounts[study.id] : '0'}
                        </HeartIcon>

                        {/* ✅ 관리자인 경우 삭제 버튼 표시 */}
                        {user?.role === 'ADMIN' && <DeleteButton onClick={() => handleDeleteStudy(study.id)}>삭제</DeleteButton>}

                        <CardContent>
                           <TitleText>{study.name}</TitleText>
                           <TagContainer>{hashtagsMap[study.id] && hashtagsMap[study.id].length > 0 ? hashtagsMap[study.id].slice(0, 2).map((tag, i) => <Tag key={i}>#{tag.name}</Tag>) : <Tag>해시태그 없음</Tag>}</TagContainer>
                           <Participants>
                              인원 {study.countMembers}/{study.maxMembers}
                           </Participants>
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
            <SearchButton>검색</SearchButton>
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
   font-size: 20px;
   color: #ff7a00;
`

const HeartIcon = styled.div`
   position: absolute;
   top: 10px;
   right: 10px;
   font-size: 20px;
   color: ${(props) => (props.$liked ? 'red' : '#ccc')}; /* ❤️ 좋아요 상태에 따라 색 변경 */
   &:hover {
      color: red; /* 마우스 올리면 빨간색 */
   }
`
const LikeCount = styled.span`
   font-size: 14px;
   font-weight: bold;
   color: black;
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
const Message = styled.p`
   text-align: center;
   font-size: 18px;
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
