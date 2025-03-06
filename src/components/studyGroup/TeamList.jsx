import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { FaCrown } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { fetchGroupMembersThunk } from '../../features/groupmemberSlice'
import { useParams } from 'react-router-dom'

const TeamList = ({ groupmembers, studygroup }) => {
   const dispatch = useDispatch()
   const { id: groupId } = useParams()
   const [isFixed, setIsFixed] = useState(true)
   const [position, setPosition] = useState({ top: 0, bottom: 0 })
   const teamListRef = useRef(null)

   // 데이터가 없을 때 안전하게 처리
   const safeGroupmembers = groupmembers || []

   // 스크롤 추적 기능
   useEffect(() => {
      const footer = document.getElementById('footer')

      if (!footer || !teamListRef.current) {
         console.warn('Footer element or TeamList element not found')
         return
      }

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setIsFixed(false)
               const footerRect = footer.getBoundingClientRect()
               const offsetTop = window.scrollY + footerRect.top - teamListRef.current.offsetHeight
               setPosition({ top: offsetTop, bottom: 'auto' })
            } else {
               setIsFixed(true)
               setPosition({ top: 'auto', bottom: 0 })
            }
         },
         { rootMargin: '0px', threshold: 0 }
      )

      observer.observe(footer)
      return () => observer.unobserve(footer)
   }, [])

   // 실시간 업데이트를 위한 폴링 구현
   useEffect(() => {
      // 초기 데이터 로딩
      if (groupId) {
         dispatch(fetchGroupMembersThunk(groupId))
      }

      // 10초마다 멤버 목록 업데이트 (폴링 간격은 필요에 따라 조정)
      const intervalId = setInterval(() => {
         if (groupId) {
            dispatch(fetchGroupMembersThunk(groupId))
               .unwrap()
               .then()
               .catch((error) => {
                  console.error('TeamList 업데이트 실패:', error)
               })
         }
      }, 10000) // 10초 간격

      // 컴포넌트 언마운트 시 인터벌 정리
      return () => clearInterval(intervalId)
   }, [dispatch, groupId])

   return (
      <>
         <TeamListWrapper $isFixed={isFixed} $position={position} ref={teamListRef}>
            <TitleWrapper>
               <Title>스터디원 목록</Title>
            </TitleWrapper>
         </TeamListWrapper>

         <TeamMembers>
            {safeGroupmembers.map((member) => (
               <Member key={member.id}>
                  <MemberGrid>
                     <CrownWrapper>{member.role === 'leader' && <FaCrown />}</CrownWrapper>
                     <ProfileWrapper>
                        <ProfileIcon src={member.status === 'on' ? '/img/happyMing.png' : '/img/cryingMing.png'} alt={member.status === 'on' ? '접속중' : '미접속'} />
                     </ProfileWrapper>
                     <MemberName $isOnline={member.status === 'on'}>{member.User?.nickname || '사용자'}</MemberName>
                  </MemberGrid>
               </Member>
            ))}
         </TeamMembers>
      </>
   )
}

export default TeamList

// Styled Components
const TeamListWrapper = styled.div`
   width: 100%;
   max-width: 250px;
   padding: 0;
   position: ${(props) => (props.$isFixed ? 'fixed' : 'absolute')};
   top: ${(props) => (props.$isFixed ? 'auto' : `${props.$position.top}px`)};
   bottom: ${(props) => (props.$isFixed ? '0' : 'auto')};
   transition: top 0.3s ease, bottom 0.3s ease;
   @media (max-width: 965px) {
      position: static; /* ✅ position을 기본값으로 되돌림 */
      top: unset; /* ✅ top 속성 제거 */
      bottom: unset; /* ✅ bottom 속성 제거 */
      transition: none; /* ✅ 애니메이션 제거 */
   }
`

const TitleWrapper = styled.div`
   background-color: #fcf4eb;
   width: calc(100% + 20px);
   max-width: 250px;
   margin-left: -20px;
   padding: 20px 10px;
   box-sizing: border-box;
   border-right: 1px solid #ddd;
   display: flex;
   flex-direction: column;
   align-items: flex-end;

   @media (max-width: 965px) {
      display: none;
   }
`

const Title = styled.h3`
   font-size: 20px;
   font-weight: 300;
   text-align: right;
   margin: 0;
`

const TeamMembers = styled.ul`
   list-style: none;
   padding: 0;
   margin: 0;

   @media (max-width: 965px) {
      padding: 0px 20px 0px 20px;
      display: flex;
      overflow-x: auto; /* ✅ 가로 스크롤 활성화 */
      white-space: nowrap; /* ✅ 줄바꿈 방지 */

      &::-webkit-scrollbar {
         height: 3px; /* ✅ 스크롤바 높이 조정 */
      }

      &::-webkit-scrollbar-thumb {
         background: #ccc; /* ✅ 스크롤바 색상 */
         border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
         background: #f0f0f0; /* ✅ 스크롤바 배경 */
      }
   }
`

const Member = styled.li`
   display: flex;
   align-items: center;
   padding: 15px 0;
   font-size: 20px;
   font-weight: 300;
   transition: background-color 0.3s;

   @media (max-width: 965px) {
      margin-right: 30px;
   }
`

const MemberGrid = styled.div`
   display: grid;
   grid-template-columns: 30px 40px auto;
   align-items: center;
   width: 100%;
   gap: 15px;
`

const CrownWrapper = styled.div`
   font-size: 16px;
   color: #ffa654;
   display: flex;
   align-items: center;
   justify-content: center;
`

const ProfileWrapper = styled.div`
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
`

const ProfileIcon = styled.img`
   height: 30px;
   object-fit: cover;
   transform: translateY(-2px);
`

const MemberName = styled.span`
   width: 100%;
   color: ${(props) => (props.$isOnline ? '#FF7A00' : '#333')};
   text-align: left;
   transition: color 0.3s;
`
