// components/studyGroup/StudyRoomLayout.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import TeamList from './TeamList'
import { fetchStudygroupByIdThunk } from '../../features/studygroupSlice'
import { fetchGroupMembersThunk, participateInGroupThunk } from '../../features/groupmemberSlice'
import { updateGrouptimeThunk } from '../../features/grouptimeSlice'
import Timer from '../shared/Timer'
import Ejection from '../shared/Ejection'

const StudyRoomLayout = ({ children, activeTab, setActiveTab }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()
   const { studygroup } = useSelector((state) => state.studygroups)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember)
   const { formattedTime } = useSelector((state) => state.grouptime)
   const user = useSelector((state) => state.auth.user)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [isEjectionModalOpen, setIsEjectionModalOpen] = useState(false)

   // 사용자 정보 대기 상태 추가
   const [isWaitingForUser, setIsWaitingForUser] = useState(true)
   const [waitTimer, setWaitTimer] = useState(null)

   // 사용자 정보 기다리기
   useEffect(() => {
      // 이미 사용자 정보가 있으면 대기 종료
      if (user) {
         setIsWaitingForUser(false)
         if (waitTimer) {
            clearTimeout(waitTimer)
         }
         return
      }

      // 사용자 정보가 없으면 3초 기다림
      if (isWaitingForUser && !waitTimer) {
         const timerId = setTimeout(() => {
            setIsWaitingForUser(false)
         }, 2000) // 2초 대기

         setWaitTimer(timerId)

         return () => {
            if (timerId) {
               clearTimeout(timerId)
            }
         }
      }
   }, [user, isWaitingForUser, waitTimer])

   // 인증 상태 확인 및 데이터 로딩
   useEffect(() => {
      // 아직 사용자 정보를 기다리는 중이면 아무것도 하지 않음
      if (isWaitingForUser) {
         return
      }

      // 대기 후에도 사용자 정보가 없으면 로그인 페이지로 이동
      if (!user) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }

      // 사용자 정보가 있으면 데이터 로딩 진행
      dispatch(fetchStudygroupByIdThunk(id))
      dispatch(fetchGroupMembersThunk(id))

      // 참가자 상태를 'on'으로 설정
      dispatch(
         participateInGroupThunk({
            groupId: id,
            status: 'on',
         })
      )

      // 컴포넌트 언마운트 시 참가자 상태를 'off'로 설정
      return () => {
         if (user) {
            dispatch(
               participateInGroupThunk({
                  groupId: id,
                  status: 'off',
               })
            )
         }
      }
   }, [dispatch, id, user, navigate, isWaitingForUser])

   const handleEjectionModalOpen = () => {
      setIsEjectionModalOpen(true)
   }

   const handleEjectionModalClose = () => {
      setIsEjectionModalOpen(false)
   }

   const handleStudyOutClick = () => {
      setIsModalOpen(true)
   }

   const handleConfirmExit = () => {
      dispatch(updateGrouptimeThunk({ groupId: id, time: formattedTime }))
         .unwrap()
         .then(() => {
            return dispatch(participateInGroupThunk({ groupId: id, status: 'off' })).unwrap()
         })
         .then(() => {
            navigate('/home')
         })
         .catch((err) => {
            console.error('스터디 나가기 실패:', err)
            alert('스터디를 나가지 못했습니다.')
         })
         .finally(() => setIsModalOpen(false))
   }

   // 사용자 정보를 기다리는 동안 로딩 표시
   if (isWaitingForUser) {
      return (
         <LoadingContainer>
            <LoadingSpinner />
            <div>사용자 정보를 불러오는 중입니다...</div>
         </LoadingContainer>
      )
   }

   // 데이터 로딩 중 표시
   if (!studygroup || !groupmembers) {
      return (
         <LoadingContainer>
            <LoadingSpinner />
            <div>스터디 데이터를 불러오는 중입니다...</div>
         </LoadingContainer>
      )
   }

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               <MenuItem $isActive={activeTab === 'chat'}>
                  <StyledButton onClick={() => setActiveTab('chat')}>채팅</StyledButton>
                  {activeTab === 'chat' && <ActiveIndicator />}
               </MenuItem>
               <MenuItem $isActive={activeTab === 'video'}>
                  <StyledButton onClick={() => setActiveTab('video')}>공부방</StyledButton>
                  {activeTab === 'video' && <ActiveIndicator />}
               </MenuItem>
            </MenuList>

            <TeamListWrapper>
               <TeamList groupmembers={groupmembers} studygroup={studygroup} />
            </TeamListWrapper>
         </SidebarContainer>

         <ContentArea>
            <Header>
               <h1>{studygroup.name}</h1>
               <div>
                  {studygroup.createdBy === user?.id && <OutButton onClick={handleEjectionModalOpen}>강퇴</OutButton>}
                  <OutButton onClick={handleStudyOutClick}>나가기</OutButton>
               </div>
            </Header>

            {/* 자식 컴포넌트 렌더링 - 여기서 탭에 따라 다른 컴포넌트가 표시됨 */}
            {children}
         </ContentArea>

         {/* 모달 컴포넌트 */}
         {isModalOpen && (
            <Modal>
               <ModalContent>
                  <p>정말로 나가시겠습니까?</p>
                  <button onClick={handleConfirmExit}>예</button>
                  <button onClick={() => setIsModalOpen(false)}>아니오</button>
               </ModalContent>
            </Modal>
         )}

         {/* 강퇴 모달 */}
         {isEjectionModalOpen && <Ejection isOpen={isEjectionModalOpen} onClose={handleEjectionModalClose} groupId={id} />}

         <Timer />
      </Container>
   )
}

export default StudyRoomLayout

// 스타일 컴포넌트
const Container = styled.div`
   display: flex;
   height: 100%;
`

const SidebarContainer = styled.nav`
   width: 250px;
   height: 100vh;
   padding: 20px;
   display: flex;
   flex-direction: column;
   border-right: 1px solid #ddd;
   justify-content: space-between;
`

const MenuList = styled.ul`
   margin-top: 100px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 40px;
`

const MenuItem = styled.li`
   position: relative;
   display: flex;
   margin-right: 10px;
   justify-content: center;
   font-size: 20px;
   font-weight: ${(props) => (props.$isActive ? '500' : '300')};
   color: ${(props) => (props.$isActive ? '#FF7A00' : '#000')};
   cursor: pointer;
`

const StyledButton = styled.button`
   all: unset;
   text-decoration: none;
   color: inherit;
   text-align: right;
   display: block;
   &:hover {
      color: #ff7f00;
   }
`

const ActiveIndicator = styled.div`
   position: absolute;
   right: -34px;
   top: 50%;
   transform: translateY(-50%);
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;
`

const TeamListWrapper = styled.div`
   width: 100%;
   margin-top: auto;
`

const ContentArea = styled.div`
   flex: 1;
   padding: 40px;
   background-color: #fff;
   display: flex;
   flex-direction: column;
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
   margin-left: 10px;
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
   z-index: 1000;
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
      background-color: #ff5733;
      color: white;
      &:hover {
         background-color: #e74c3c;
      }
   }
`

// 로딩 컴포넌트 개선
const LoadingContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   height: 100vh;
   font-size: 18px;
   color: #666;
`

const LoadingSpinner = styled.div`
   width: 40px;
   height: 40px;
   border: 4px solid #f3f3f3;
   border-top: 4px solid #ff7a00;
   border-radius: 50%;
   animation: spin 1s linear infinite;
   margin-bottom: 15px;

   @keyframes spin {
      0% {
         transform: rotate(0deg);
      }
      100% {
         transform: rotate(360deg);
      }
   }
`
