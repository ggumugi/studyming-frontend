import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { AiOutlineDown } from 'react-icons/ai' // 드롭다운 아이콘

import { fetchUserStudyGroupsThunk, fetchGroupMembersThunk } from '../../features/groupmemberSlice'

const RealTimeAccess = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 리덕스 스토어에서 데이터 가져오기
   const userStudyGroups = useSelector((state) => state.groupmembers.userStudyGroups || [])
   const userStudyCount = useSelector((state) => state.groupmembers.userStudyCount || 0)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember || { groupmembers: [] })
   const loading = useSelector((state) => state.groupmembers.loading)

   // 선택된 스터디와 드롭다운 상태
   const [selectedStudy, setSelectedStudy] = useState(null)
   const [dropdownOpen, setDropdownOpen] = useState(false)

   // 유저가 가입한 스터디 그룹 목록 가져오기 (처음 한 번만)
   useEffect(() => {
      dispatch(fetchUserStudyGroupsThunk())
   }, [dispatch])

   // 선택된 스터디가 변경되면 해당 스터디의 멤버 목록 가져오기
   useEffect(() => {
      if (selectedStudy) {
         // 초기 데이터 로딩
         dispatch(fetchGroupMembersThunk(selectedStudy.id))

         // 10초마다 멤버 상태 업데이트 (폴링)
         const intervalId = setInterval(() => {
            dispatch(fetchGroupMembersThunk(selectedStudy.id))
               .unwrap()
               .then(() => {
                  console.log('멤버 상태 업데이트 완료:', new Date().toLocaleTimeString())
               })
               .catch((error) => {
                  console.error('멤버 상태 업데이트 실패:', error)
               })
         }, 10000) // 10초 간격

         // 선택된 스터디가 변경되거나 컴포넌트 언마운트 시 인터벌 정리
         return () => clearInterval(intervalId)
      }
   }, [dispatch, selectedStudy])

   // 스터디 그룹 데이터가 로드되면 첫 번째 스터디를 기본 선택
   useEffect(() => {
      if (userStudyGroups && userStudyGroups.length > 0 && !selectedStudy) {
         setSelectedStudy(userStudyGroups[0])
      }
   }, [userStudyGroups, selectedStudy])

   // 스터디 바로가기 핸들러
   const handleStudyVisit = () => {
      if (selectedStudy) {
         navigate(`/study/detail/${selectedStudy.id}`)
      }
   }

   // 접속 중인 멤버 수 계산
   const onlineMembersCount = groupmembers ? groupmembers.filter((member) => member.status === 'on').length : 0

   return (
      <Container>
         {/* 현재 참여 중인 스터디 개수 */}
         <Header>
            <StudyInfo>
               참여 중인 스터디 <span>{userStudyCount}</span>개
            </StudyInfo>
            {selectedStudy && <VisitButton onClick={handleStudyVisit}>{selectedStudy.name} 바로가기 →</VisitButton>}
         </Header>

         {/* 스터디 드롭다운 */}
         {loading ? (
            <LoadingText>스터디 정보를 불러오는 중...</LoadingText>
         ) : userStudyGroups && userStudyGroups.length > 0 ? (
            <>
               <DropdownSection>
                  <DropdownContainer>
                     <SelectBox onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {selectedStudy ? selectedStudy.name : '스터디 선택'} <AiOutlineDown />
                     </SelectBox>
                     {dropdownOpen && (
                        <DropdownList>
                           {userStudyGroups.map((study) => (
                              <DropdownItem
                                 key={study.id}
                                 onClick={() => {
                                    setSelectedStudy(study)
                                    setDropdownOpen(false)
                                 }}
                              >
                                 {study.name}
                                 <span>{study.members}명 가입 중</span>
                              </DropdownItem>
                           ))}
                        </DropdownList>
                     )}
                  </DropdownContainer>
                  {selectedStudy && (
                     <MemberCount>
                        {selectedStudy.name} 현재 <span>{onlineMembersCount}</span>명 접속 중입니다
                     </MemberCount>
                  )}
               </DropdownSection>

               {/* 실시간 접속 현황 */}
               <SectionTitle>실시간 접속 현황</SectionTitle>
               <Divider />

               {/* 접속 중인 멤버 리스트 */}
               {groupmembers && groupmembers.length > 0 ? (
                  <UserList>
                     {groupmembers.map((member) => (
                        <UserIcon key={member.userId} $isOnline={member.status === 'on'}>
                           <UserImage src={`${process.env.PUBLIC_URL}/img/${member.status === 'on' ? 'happyMing.png' : 'cryingMing.png'}`} alt="user" />
                           <p>{member.User ? member.User.nickname : '알 수 없음'}</p>
                        </UserIcon>
                     ))}
                  </UserList>
               ) : (
                  <NoMembersMessage>멤버 정보를 불러올 수 없습니다.</NoMembersMessage>
               )}
            </>
         ) : (
            <NoStudyMessage>
               참여 중인 스터디가 없습니다.
               <JoinStudyButton onClick={() => navigate('/study/list')}>스터디 찾아보기</JoinStudyButton>
            </NoStudyMessage>
         )}
      </Container>
   )
}

export default RealTimeAccess

// 🎨 Styled Components
const Container = styled.div`
   width: 90%;
   margin: auto;
   padding: 20px;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 20px;
`

const StudyInfo = styled.div`
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
   color: #333;
   span {
      color: #ff7a00;
      font-weight: 700;
   }
`

const VisitButton = styled.button`
   background: white;
   color: black;
   border: 1px solid #eaeaea;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   padding: 8px 12px;
   border-radius: 25px;
   cursor: pointer;
   font-size: clamp(10px, 1vw, 14px);
   font-weight: 300;

   &:hover {
      background: #ff7a00;
      color: white;
   }
`

/* 🔹 드롭다운 관련 스타일 */
const DropdownSection = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
`

const DropdownContainer = styled.div`
   position: relative;
   width: 100%;
   max-width: 200px;
`

const SelectBox = styled.div`
   padding: 10px;
   background: white;
   border: 1px solid #eaeaea;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   border-radius: 15px;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: space-between;
   font-size: clamp(12px, 1vw, 16px);
   font-weight: 400;
   color: #333;

   &:hover {
      background: #f5f5f5;
   }
`

const MemberCount = styled.div`
   font-size: clamp(12px, 1vw, 16px);
   font-weight: 300;
   color: #666;
   margin-top: 5px;
   span {
      color: #ff7a00;
      font-weight: 700;
   }
`

const DropdownList = styled.ul`
   position: absolute;
   top: 100%;
   left: 0;
   width: 100%;
   background: white;
   border: 1px solid #ddd;
   border-radius: 5px;
   margin-top: 5px;
   list-style: none;
   padding: 0;
   z-index: 100;
`

const DropdownItem = styled.li`
   padding: 10px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 16px;
   cursor: pointer;
   color: #333;

   &:hover {
      background: #ff7a00;
      color: white;
   }

   span {
      font-size: 12px;
      color: #999;
   }
   &:hover span {
      color: white;
   }
`

/* 🔹 실시간 접속 현황 */
const SectionTitle = styled.h3`
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
   color: #ff7a00;
   margin-top: 30px;
`

const Divider = styled.div`
   width: 100%;
   height: 2px;
   background-color: #ff7a00;
   margin: 10px 0;
`

const UserList = styled.div`
   display: flex;
   justify-content: space-around;
   gap: 30px;
   margin-top: 20px;
   min-height: 100px; /* 최소 높이 설정으로 로딩 시 레이아웃 변동 방지 */
`

const UserIcon = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   font-size: 14px;
   color: ${({ $isOnline }) => ($isOnline ? 'orange' : 'black')};
   position: relative;
   p {
      margin-top: 5px;
      padding-right: 14px;
   }
`

const UserImage = styled.img`
   width: auto;
   height: 50px;
`

const LoadingText = styled.p`
   text-align: center;
   color: #666;
   margin: 20px 0;
   font-size: 14px;
   height: 180px; /* 로딩 시 충분한 높이 확보 */
   display: flex;
   justify-content: center;
   align-items: center;
`

const NoStudyMessage = styled.div`
   text-align: center;
   margin: 30px 0;
   color: #666;
   font-size: 16px;
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 15px;
   min-height: 180px; /* 최소 높이 설정으로 로딩 시 레이아웃 변동 방지 */
   justify-content: center;
`

const JoinStudyButton = styled.button`
   background-color: #ff7a00;
   color: white;
   border: none;
   padding: 10px 20px;
   border-radius: 5px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background-color: #e66e00;
   }
`

const LeaderBadge = styled.span`
   background-color: #ff7a00;
   color: white;
   font-size: 10px;
   padding: 2px 6px;
   border-radius: 10px;
   position: absolute;
   top: -5px;
   right: -5px;
`

const NoMembersMessage = styled.p`
   text-align: center;
   color: #888;
   margin: 20px 0;
   font-size: 14px;
   width: 100%;
   min-height: 100px; /* 최소 높이 설정으로 로딩 시 레이아웃 변동 방지 */
   display: flex;
   justify-content: center;
   align-items: center;
`
