import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import GroupSidebar from '../components/sidebar/GroupSidebar'
import Chat from '../components/studyGroup/Chat'
import ScreenShare from '../components/studyGroup/ScreenShare'
import Cam from '../components/studyGroup/Cam'
import Timer from '../components/shared/Timer'

import { fetchStudygroupByIdThunk } from '../features/studygroupSlice'
import { fetchGroupMembersThunk, participateInGroupThunk } from '../features/groupmemberSlice'
import { updateGrouptimeThunk } from '../features/grouptimeSlice'
import Ejection from '../components/shared/Ejection'

const StudyGroupPage = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()
   const { studygroup } = useSelector((state) => state.studygroups)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember)
   const { formattedTime } = useSelector((state) => state.grouptime) // 추가: 타이머 시간 가져오기
   const [selectedMenu, setSelectedMenu] = useState('채팅')
   const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태 관리
   const [isEjectionModalOpen, setIsEjectionModalOpen] = useState(false)

   const handleEjectionModalOpen = () => {
      console.log('🔥 강퇴 모달 열기 클릭됨')
      setIsEjectionModalOpen(true)
   }

   const handleEjectionModalClose = () => {
      console.log('❌ 강퇴 모달 닫기 클릭됨')
      setIsEjectionModalOpen(false)
   }

   const renderComponent = () => {
      switch (selectedMenu) {
         case '채팅':
            return <Chat studygroup={studygroup} groupmembers={groupmembers} user={user} />
         case '공부방':
            return <ScreenShare studygroup={studygroup} groupmembers={groupmembers} />
         default:
            return <p>잘못된 메뉴 선택</p>
      }
   }

   useEffect(() => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }
      dispatch(fetchStudygroupByIdThunk(id))
      dispatch(fetchGroupMembersThunk(id))
   }, [dispatch, id, isAuthenticated])

   const handleStudyOutClick = () => {
      setIsModalOpen(true) // 모달 열기
   }

   // 수정: 나가기 버튼 클릭 시 타이머 시간 저장 후 그룹 상태 변경
   const handleConfirmExit = () => {
      // 현재 타이머 시간 저장
      console.log('나가기 시작: 시간 저장 시도', { groupId: id, time: formattedTime })

      dispatch(updateGrouptimeThunk({ groupId: id, time: formattedTime }))
         .unwrap()
         .then((result) => {
            console.log('시간 저장 성공:', result)
            // 스터디 그룹 참여 상태 변경 (off)
            console.log('그룹 상태 변경 시도', { groupId: id, status: 'off' })
            return dispatch(participateInGroupThunk({ groupId: id, status: 'off' })).unwrap()
         })
         .then((result) => {
            console.log('그룹 상태 변경 성공:', result)
            navigate('/home')
         })
         .catch((err) => {
            console.error('스터디 나가기 실패 상세 정보:', {
               error: err,
               message: err.message,
               stack: err.stack,
               response: err.response?.data,
            })
            alert('스터디를 나가지 못했습니다.')
         })
         .finally(() => setIsModalOpen(false)) // 모달 닫기
   }

   console.log('studygroup ', studygroup, 'groupmembers', groupmembers)

   return (
      <>
         {studygroup && (
            <Container>
               <GroupSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} isAuthenticated={isAuthenticated} user={user} studygroup={studygroup} groupmembers={groupmembers} />

               <ContentArea>
                  <Header>
                     <h1>{studygroup.name}</h1>
                     <div>
                        {studygroup.createdBy === user?.id && <OutButton onClick={handleEjectionModalOpen}>강퇴</OutButton>}
                        <OutButton onClick={handleStudyOutClick}>나가기</OutButton>
                     </div>
                  </Header>
                  {renderComponent()}
               </ContentArea>
               {/* ✅ 강퇴 모달 추가 */}
               {isEjectionModalOpen && <Ejection isOpen={isEjectionModalOpen} onClose={handleEjectionModalClose} groupId={id} />}
               {isModalOpen && (
                  <Modal>
                     <ModalContent>
                        <p>정말로 나가시겠습니까?</p>
                        <button onClick={handleConfirmExit}>예</button>
                        <button onClick={() => setIsModalOpen(false)}>아니오</button>
                     </ModalContent>
                  </Modal>
               )}
               <Timer />
            </Container>
         )}
      </>
   )
}

export default StudyGroupPage

const Container = styled.div`
   display: flex;
   height: 100%;
`

const ContentArea = styled.div`
   flex: 1;
   padding: 40px;
   background-color: #fff;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-bottom: 10px;
   border-bottom: 2px solid #ff7a00;
   margin-bottom: 20px;
`

const OutButton = styled.button`
   background-color: #ff5733;
   color: white;
   padding: 10px 20px;
   border-radius: 20px;
   border: none;
   cursor: pointer;
   font-size: 14px;
   font-weight: bold;
   transition: background-color 0.3s;
   &:hover {
      background-color: #e74c3c;
   }
`

const Modal = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
`

const ModalContent = styled.div`
   background-color: white;
   padding: 20px;
   border-radius: 10px;
   text-align: center;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

   button {
      margin: 20px 10px 5px 10px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      &:hover {
         background-color: #ddd;
      }
   }
   button:first-of-type {
      background-color: #ff5733; /* 빨간색 배경 */
      color: white;
      &:hover {
         background-color: #e74c3c; /* 호버 시 더 진한 빨간색 */
      }
   }
`
