import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { AiOutlineDown } from 'react-icons/ai' // 드롭다운 아이콘

import { fetchUserStudyCountThunk } from '../../features/groupmemberSlice'

const RealTimeAccess = () => {
   const dispatch = useDispatch()

   // 로그인한 유저의 참여 중인 스터디 개수 불러오기
   const userStudyCount = useSelector((state) => state.groupmembers.userStudyCount)

   // 로그인한 유저의 참여 중인 스터디 개수 불러오기
   useEffect(() => {
      dispatch(fetchUserStudyCountThunk())
   }, [dispatch])

   // ✅ 참여 중인 스터디 목록 (임시 데이터)
   const studyList = [
      { id: 1, name: '고시생방', members: 6 },
      { id: 2, name: '토익 스터디', members: 4 },
   ]

   // ✅ 현재 접속 중인 멤버 (임시 데이터)
   const users = [
      { id: 1, nickname: 'User1', isOnline: true },
      { id: 2, nickname: 'User2', isOnline: false },
      { id: 3, nickname: 'User3', isOnline: false },
      { id: 4, nickname: 'User4', isOnline: true },
      { id: 5, nickname: 'User5', isOnline: true },
   ]

   const [selectedStudy, setSelectedStudy] = useState(studyList[0]) // 기본 선택된 스터디
   const [dropdownOpen, setDropdownOpen] = useState(false) // 드롭다운 열기 상태

   return (
      <Container>
         {/* 🔹 현재 참여 중인 스터디 개수 */}
         <Header>
            <StudyInfo>
               참여 중인 스터디 <span>{userStudyCount}</span>개
            </StudyInfo>
            <VisitButton>{selectedStudy.name} 바로가기 →</VisitButton>
         </Header>

         {/* 🔹 스터디 드롭다운 */}
         <DropdownSection>
            <DropdownContainer>
               <SelectBox onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selectedStudy.name} <AiOutlineDown />
               </SelectBox>
               {dropdownOpen && (
                  <DropdownList>
                     {studyList.map((study) => (
                        <DropdownItem
                           key={study.id}
                           onClick={() => {
                              setSelectedStudy(study)
                              setDropdownOpen(false)
                           }}
                        >
                           {study.name}
                           <span>{study.members}명 접속 중</span>
                        </DropdownItem>
                     ))}
                  </DropdownList>
               )}
            </DropdownContainer>
            <MemberCount>
               {selectedStudy.name} 현재 <span>{selectedStudy.members}</span>명 접속 중입니다
            </MemberCount>
         </DropdownSection>

         {/* 🔹 실시간 접속 현황 */}
         <SectionTitle>실시간 접속 현황</SectionTitle>
         <Divider />

         {/* 🔹 접속 중인 멤버 리스트 */}
         <UserList>
            {users.map((user) => (
               <UserIcon key={user.id} $isOnline={user.isOnline}>
                  <UserImage src={`${process.env.PUBLIC_URL}/img/${user.isOnline ? 'happyMing.png' : 'cryingMing.png'}`} alt="user" />
                  <p>{user.nickname}</p>
               </UserIcon>
            ))}
         </UserList>
      </Container>
   )
}

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
   font-size: clamp(12px, 1vw, 16px);
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
`

const UserIcon = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   font-size: 14px;
   color: ${({ $isOnline }) => ($isOnline ? 'orange' : 'black')};
   p {
      margin-top: 5px;
      padding-right: 14px;
   }
`

const UserImage = styled.img`
   width: auto;
   height: 50px;
`

export default RealTimeAccess
